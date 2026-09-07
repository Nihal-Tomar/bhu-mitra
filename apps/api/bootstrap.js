#!/usr/bin/env node
/**
 * BhuMitra — Database Bootstrap Script
 *
 * Runs BEFORE the NestJS server starts:
 *  1. Loads .env from workspace root
 *  2. Starts embedded PostgreSQL (if USE_EMBEDDED_PG=true or port 5432 not reachable)
 *  3. Runs Prisma migrate deploy
 *  4. Runs database seed
 */

/* ─── Module setup ─────────────────────────────────────────────────────────── */
const path = require('path');
const os = require('os');
const net = require('net');
const fs = require('fs');
const { execSync } = require('child_process');

const API_ROOT = __dirname;                        // apps/api/
const WORKSPACE_ROOT = path.join(API_ROOT, '..', '..'); // monorepo root

/* ─── Load .env from workspace root ───────────────────────────────────────── */
const dotenvPath = path.join(
  WORKSPACE_ROOT, 'node_modules', '.pnpm', 'dotenv@16.6.1', 'node_modules', 'dotenv'
);
try {
  const dotenv = require(dotenvPath);
  dotenv.config({ path: path.join(WORKSPACE_ROOT, '.env.local') });
  dotenv.config({ path: path.join(WORKSPACE_ROOT, '.env') });
  console.log('[Bootstrap] Loaded .env from workspace root');
} catch (err) {
  console.warn('[Bootstrap] Could not load dotenv:', err.message, '— relying on pre-set env vars');
}

/* ─── Constants ────────────────────────────────────────────────────────────── */
const EMBEDDED_PORT = 54329;
const DB_USER    = 'bhumitra';
const DB_PASS    = 'bhumitra_secure_dev';
const DB_NAME    = 'bhumitra';
const DATA_DIR   = path.join(os.homedir(), '.bhumitra', 'pgdata');

// Binaries
const PRISMA_CMD = path.join(API_ROOT, 'node_modules', '.bin', 'prisma.CMD');
const TS_NODE    = path.join(WORKSPACE_ROOT, 'node_modules', '.bin', 'ts-node.CMD');
const SCHEMA     = path.join(API_ROOT, 'prisma', 'schema.prisma');
const SEED_FILE  = path.join(API_ROOT, 'prisma', 'seed', 'index.ts');

/* ─── TCP probe ────────────────────────────────────────────────────────────── */
function probeTcp(host, port, ms = 2000) {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    let done = false;
    const finish = (v) => { if (!done) { done = true; sock.destroy(); resolve(v); } };
    sock.setTimeout(ms);
    sock.once('connect', () => finish(true));
    sock.once('timeout', () => finish(false));
    sock.once('error',   () => finish(false));
    sock.connect(port, host);
  });
}

/* ─── pg_hba patch ─────────────────────────────────────────────────────────── */
function patchHba() {
  const p = path.join(DATA_DIR, 'pg_hba.conf');
  if (!fs.existsSync(p)) return;
  const src = fs.readFileSync(p, 'utf8');
  const patched = src
    .replace(/^(local\s+all\s+all\s+)\w+$/gm,            '$1trust')
    .replace(/^(host\s+all\s+all\s+127\.0\.0\.1\/32\s+)\w+$/gm, '$1trust')
    .replace(/^(host\s+all\s+all\s+::1\/128\s+)\w+$/gm,  '$1trust');
  fs.writeFileSync(p, patched, 'utf8');
  console.log('[Bootstrap] pg_hba.conf → trust auth for local connections');
}

/* ─── Embedded Postgres startup ────────────────────────────────────────────── */
async function startEmbeddedPg() {
  // Load embedded-postgres from api node_modules
  let EmbeddedPostgres;
  try {
    const mod = require(path.join(API_ROOT, 'node_modules', 'embedded-postgres'));
    EmbeddedPostgres = mod.default ?? mod;
  } catch (err) {
    console.error('[Bootstrap] embedded-postgres not found:', err.message);
    return false;
  }

  const pg = new EmbeddedPostgres({
    port: EMBEDDED_PORT,
    database: 'postgres',
    user: 'postgres',
    persistent: true,
    dataDirectory: DATA_DIR,
  });

  console.log(`[Bootstrap] Initialising embedded PostgreSQL (${DATA_DIR})...`);
  await pg.initialise();
  await pg.start();
  console.log(`[Bootstrap] Embedded PostgreSQL started on port ${EMBEDDED_PORT}`);

  patchHba();
  await bootstrapRoleAndDb(pg);

  // Override DATABASE_URL for all child processes and NestJS
  process.env.DATABASE_URL = `postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:${EMBEDDED_PORT}/${DB_NAME}?schema=public`;
  console.log('[Bootstrap] DATABASE_URL → embedded PostgreSQL on port', EMBEDDED_PORT);

  const stop = () => { try { pg.stop(); } catch {} };
  process.on('exit',   stop);
  process.on('SIGINT',  () => { stop(); process.exit(0); });
  process.on('SIGTERM', () => { stop(); process.exit(0); });
  return true;
}

/* ─── Role & database bootstrap ────────────────────────────────────────────── */
async function bootstrapRoleAndDb() {
  // Find pg Client — embedded-postgres bundles pg
  let Client;
  const pgPaths = [
    path.join(API_ROOT, 'node_modules', 'embedded-postgres', 'node_modules', 'pg'),
    path.join(WORKSPACE_ROOT, 'node_modules', '.pnpm'),  // won't work directly but try
  ];
  for (const p of pgPaths) {
    try { Client = require(p).Client; if (Client) break; } catch {}
  }
  if (!Client) {
    console.warn('[Bootstrap] pg module not found — cannot auto-create role/database');
    return;
  }

  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      const admin = new Client({ host: '127.0.0.1', port: EMBEDDED_PORT, user: 'postgres', database: 'postgres' });
      await admin.connect();

      await admin.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
            CREATE ROLE ${DB_USER} WITH LOGIN SUPERUSER PASSWORD '${DB_PASS}';
          END IF;
        END $$;
      `);

      await admin.query('SELECT pg_reload_conf()');

      const row = await admin.query(`SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`);
      if (row.rows.length === 0) {
        await admin.query(`CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}`);
        console.log(`[Bootstrap] Database "${DB_NAME}" created`);
      } else {
        console.log(`[Bootstrap] Database "${DB_NAME}" already exists`);
      }
      await admin.end();
      return;
    } catch (err) {
      console.log(`[Bootstrap] DB bootstrap attempt ${attempt}/8: ${err.message} — retrying...`);
      await new Promise(r => setTimeout(r, 700));
    }
  }
  console.warn('[Bootstrap] Could not bootstrap role/database after 8 attempts');
}

/* ─── Migrations ────────────────────────────────────────────────────────────── */
async function runMigrations() {
  if (!fs.existsSync(PRISMA_CMD)) {
    console.warn('[Bootstrap] prisma binary not found at:', PRISMA_CMD);
    return;
  }
  console.log('[Bootstrap] Running prisma migrate deploy...');
  try {
    execSync(`"${PRISMA_CMD}" migrate deploy --schema "${SCHEMA}"`, {
      env:   { ...process.env },
      cwd:   API_ROOT,
      stdio: 'inherit',
      shell: false,
    });
    console.log('[Bootstrap] ✅ Migrations applied');
  } catch (err) {
    console.warn('[Bootstrap] Migration warning:', err.message);
  }
}

/* ─── Seed ──────────────────────────────────────────────────────────────────── */
async function runSeed() {
  if (!fs.existsSync(SEED_FILE)) {
    console.log('[Bootstrap] No seed file, skipping');
    return;
  }
  if (!fs.existsSync(TS_NODE)) {
    console.warn('[Bootstrap] ts-node not found at:', TS_NODE);
    return;
  }
  console.log('[Bootstrap] Running database seed...');
  try {
    execSync(
      `"${TS_NODE}" --project tsconfig.json "${SEED_FILE}"`,
      { env: { ...process.env }, cwd: API_ROOT, stdio: 'inherit', shell: false }
    );
    console.log('[Bootstrap] ✅ Seed complete');
  } catch (err) {
    console.warn('[Bootstrap] Seed warning (may already be seeded):', err.message);
  }
}

/* ─── Main ──────────────────────────────────────────────────────────────────── */
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  BHUMITRA — Database Bootstrap');
  console.log('═══════════════════════════════════════════════════════════════');

  const forceEmbedded = process.env.USE_EMBEDDED_PG === 'true';
  let useEmbedded = forceEmbedded;

  if (!forceEmbedded) {
    const dbUrl = process.env.DATABASE_URL || '';
    if (!dbUrl) {
      console.log('[Bootstrap] No DATABASE_URL — using embedded PostgreSQL');
      useEmbedded = true;
    } else {
      try {
        const url = new URL(dbUrl);
        const host = url.hostname || 'localhost';
        const port = parseInt(url.port || '5432', 10);
        const reachable = await probeTcp(host, port);
        if (!reachable) {
          console.log(`[Bootstrap] Port ${port} not reachable on ${host} → using embedded fallback`);
          useEmbedded = true;
        } else {
          console.log(`[Bootstrap] External PostgreSQL at ${host}:${port} is reachable`);
        }
      } catch {
        useEmbedded = true;
      }
    }
  } else {
    console.log('[Bootstrap] USE_EMBEDDED_PG=true → starting embedded PostgreSQL');
  }

  if (useEmbedded) {
    await startEmbeddedPg();
  }

  await runMigrations();
  await runSeed();

  const maskedUrl = (process.env.DATABASE_URL || '(none)').replace(/:[^:@]+@/, ':***@');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  DATABASE_URL : ${maskedUrl}`);
  console.log('  Bootstrap complete.');
  console.log('═══════════════════════════════════════════════════════════════');
}

main().catch((err) => {
  console.error('[Bootstrap] Fatal error:', err);
  process.exit(1);
});
