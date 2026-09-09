const mod = require('embedded-postgres');
const EmbeddedPostgres = mod.default ?? mod;
const path = require('path');
const os = require('os');
const fs = require('fs');
const { execSync } = require('child_process');

const dataDir = path.join(os.homedir(), '.bhumitra', 'pgdata');
if (fs.existsSync(dataDir)) {
  fs.rmSync(dataDir, { recursive: true, force: true });
}
fs.mkdirSync(dataDir, { recursive: true });

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  port: 54329,
  user: 'postgres',
  password: 'password',
  persistent: true,
});

async function main() {
  console.log('1. Initialising embedded postgres in', dataDir);
  await pg.initialise();
  console.log('2. Starting postgres...');
  await pg.start();

  const client = pg.getPgClient('postgres');
  await client.connect();
  console.log('3. Connected to postgres');

  await client.query("CREATE ROLE bhumitra WITH LOGIN SUPERUSER PASSWORD 'bhumitra_secure_dev'");
  console.log('4. Role bhumitra created');

  await client.query("CREATE DATABASE bhumitra OWNER bhumitra");
  console.log('5. Database bhumitra created');
  await client.end();

  const dbUrl = 'postgresql://bhumitra:bhumitra_secure_dev@127.0.0.1:54329/bhumitra?schema=public';
  process.env.DATABASE_URL = dbUrl;

  console.log('6. Running prisma db push...');
  execSync('npx prisma db push --accept-data-loss', { cwd: __dirname, env: process.env, stdio: 'inherit' });

  console.log('7. Running seed...');
  execSync('npx ts-node --project tsconfig.json prisma/seed/index.ts', { cwd: __dirname, env: process.env, stdio: 'inherit' });

  console.log('8. Complete! Stopping postgres...');
  await pg.stop();
  console.log('ALL DONE! Database fully persistent and seeded!');
}

main().catch((err) => {
  console.error('Fatal init error:', err);
  process.exit(1);
});
