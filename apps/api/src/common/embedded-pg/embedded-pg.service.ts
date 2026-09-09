import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as path from 'path';
import * as os from 'os';
import * as net from 'net';
import * as fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const EmbeddedPostgres: any = (() => {
  try {
    // CommonJS require - works with moduleResolution:Node
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('embedded-postgres');
    return mod.default ?? mod;
  } catch {
    return null;
  }
})();

/**
 * EmbeddedPgService — lifecycle manager for an embedded PostgreSQL server.
 *
 * Activation conditions (checked in order):
 *  1. USE_EMBEDDED_PG=true   — explicit opt-in
 *  2. No DATABASE_URL set    — no external DB configured
 *  3. External Postgres unreachable (TCP probe) — automatic fallback
 *
 * When activated it patches process.env.DATABASE_URL to point at the
 * embedded server BEFORE PrismaService.onModuleInit() runs.
 */
@Injectable()
export class EmbeddedPgService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmbeddedPgService.name);
  private pg: any = null;
  private isRunning = false;

  static readonly PORT = 54329;
  static readonly USER = 'bhumitra';
  static readonly PASSWORD = 'bhumitra_secure_dev';
  static readonly DATABASE = 'bhumitra';

  private get dataDir(): string {
    return path.join(os.homedir(), '.bhumitra', 'pgdata');
  }

  async onModuleInit() {
    if (!EmbeddedPostgres) {
      this.logger.warn('embedded-postgres not available — skipping embedded DB startup');
      return;
    }

    const forceEmbedded = process.env.USE_EMBEDDED_PG === 'true';
    const noDbUrl = !process.env.DATABASE_URL;
    const externalUnreachable =
      !forceEmbedded && !noDbUrl
        ? !(await this.probeTcp(this.parseDbHost(), this.parseDbPort()))
        : false;

    const shouldStart = forceEmbedded || noDbUrl || externalUnreachable;

    if (!shouldStart) {
      this.logger.log('External PostgreSQL reachable — embedded server not started');
      return;
    }

    if (externalUnreachable) {
      this.logger.warn(
        `External PostgreSQL unreachable. ` +
          `Falling back to embedded PostgreSQL on port ${EmbeddedPgService.PORT}.`,
      );
    } else {
      this.logger.log(
        `Starting embedded PostgreSQL on port ${EmbeddedPgService.PORT}...`,
      );
    }

    await this.startEmbedded();
  }

  async onModuleDestroy() {
    if (this.pg && this.isRunning) {
      try {
        await this.pg.stop();
        this.isRunning = false;
        this.logger.log('Embedded PostgreSQL stopped');
      } catch (err) {
        this.logger.warn(`Error stopping embedded PostgreSQL: ${(err as Error).message}`);
      }
    }
  }

  get isEmbeddedRunning(): boolean {
    return this.isRunning;
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────

  private async startEmbedded() {
    try {
      const pgControl = path.join(this.dataDir, 'global', 'pg_control');
      
      this.pg = new EmbeddedPostgres({
        databaseDir: this.dataDir,
        port: EmbeddedPgService.PORT,
        user: 'postgres',
        password: 'password',
        persistent: true,
      });

      if (!fs.existsSync(pgControl)) {
        this.logger.log(`Initialising embedded PostgreSQL cluster in ${this.dataDir}...`);
        await this.pg.initialise();
      }

      await this.pg.start();
      this.isRunning = true;
      this.logger.log(`Embedded PostgreSQL started on port ${EmbeddedPgService.PORT}`);

      // Bootstrap role and database
      await this.bootstrapDatabase();

      // Override DATABASE_URL so Prisma picks up the embedded server
      process.env.DATABASE_URL =
        `postgresql://${EmbeddedPgService.USER}:${EmbeddedPgService.PASSWORD}` +
        `@127.0.0.1:${EmbeddedPgService.PORT}/${EmbeddedPgService.DATABASE}?schema=public`;

      this.logger.log(
        `DATABASE_URL → embedded server: ` +
          `postgresql://${EmbeddedPgService.USER}:***@127.0.0.1:${EmbeddedPgService.PORT}/${EmbeddedPgService.DATABASE}`,
      );
    } catch (err) {
      this.logger.error(`Failed to start embedded PostgreSQL: ${(err as Error).message}`);
      this.logger.warn('Prisma will attempt connection using existing DATABASE_URL.');
    }
  }

  private async bootstrapDatabase() {
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const admin = this.pg.getPgClient('postgres');
        await admin.connect();

        // Create bhumitra role if missing
        await admin.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${EmbeddedPgService.USER}') THEN
              CREATE ROLE ${EmbeddedPgService.USER}
                WITH LOGIN SUPERUSER PASSWORD '${EmbeddedPgService.PASSWORD}';
            END IF;
          END
          $$;
        `);

        // Create bhumitra database if missing
        const dbRow = await admin.query(
          `SELECT 1 FROM pg_database WHERE datname = '${EmbeddedPgService.DATABASE}'`,
        );
        if ((dbRow as any).rows.length === 0) {
          await admin.query(
            `CREATE DATABASE ${EmbeddedPgService.DATABASE} OWNER ${EmbeddedPgService.USER}`,
          );
          this.logger.log(`Database "${EmbeddedPgService.DATABASE}" created`);
        }

        await admin.end();
        this.logger.log(`Bootstrap complete — role and database verified`);
        return;
      } catch (err) {
        this.logger.debug(
          `Bootstrap attempt ${attempt}/5 failed: ${(err as Error).message}. Retrying in 500ms…`,
        );
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    this.logger.warn('Bootstrap failed after 5 attempts — Prisma may not connect.');
  }

  private parseDbHost(): string {
    try {
      return new URL(process.env.DATABASE_URL ?? '').hostname;
    } catch {
      return 'localhost';
    }
  }

  private parseDbPort(): number {
    try {
      return parseInt(new URL(process.env.DATABASE_URL ?? '').port || '5432', 10);
    } catch {
      return 5432;
    }
  }

  private probeTcp(host: string, port: number, timeoutMs = 2000): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      let resolved = false;
      const done = (ok: boolean) => {
        if (!resolved) {
          resolved = true;
          socket.destroy();
          resolve(ok);
        }
      };
      socket.setTimeout(timeoutMs);
      socket.once('connect', () => done(true));
      socket.once('timeout', () => done(false));
      socket.once('error', () => done(false));
      socket.connect(port, host);
    });
  }
}
