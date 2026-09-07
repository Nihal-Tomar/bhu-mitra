import { Module, Global } from '@nestjs/common';
import { EmbeddedPgService } from './embedded-pg.service';

/**
 * EmbeddedPgModule — starts a real PostgreSQL 18 server in-process
 * when DATABASE_URL is not reachable or USE_EMBEDDED_PG=true.
 *
 * This module must be imported BEFORE PrismaModule so that the DATABASE_URL
 * env var is patched before Prisma tries to connect.
 */
@Global()
@Module({
  providers: [EmbeddedPgService],
  exports: [EmbeddedPgService],
})
export class EmbeddedPgModule {}
