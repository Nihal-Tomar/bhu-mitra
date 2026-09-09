import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

  constructor() {
    super({
      datasources: {
        db: {
          url:
            process.env.DATABASE_URL ||
            'postgresql://bhumitra:bhumitra_secure_dev@127.0.0.1:54329/bhumitra?schema=public',
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await this.$connect();
        this.isConnected = true;
        this.logger.log('Connected to PostgreSQL + PostGIS database');
        return;
      } catch (error) {
        if (attempt === 3) {
          this.logger.warn(
            `PostgreSQL server not connected (${(error as Error).message}). Operating with in-memory resilient fallback data layer for local evaluation.`,
          );
          this.isConnected = false;
        } else {
          await new Promise((r) => setTimeout(r, 800));
        }
      }
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
    }
  }

  get isDbConnected(): boolean {
    return this.isConnected;
  }

  async checkHealth(): Promise<{ status: string; latencyMs: number }> {
    if (!this.isConnected) {
      return { status: 'disconnected', latencyMs: -1 };
    }
    const start = Date.now();
    try {
      await this.$queryRaw`SELECT 1`;
      return { status: 'connected', latencyMs: Date.now() - start };
    } catch {
      return { status: 'error', latencyMs: Date.now() - start };
    }
  }
}
