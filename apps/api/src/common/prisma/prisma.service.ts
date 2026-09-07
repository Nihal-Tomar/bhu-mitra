import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('Connected to PostgreSQL + PostGIS database');
    } catch (error) {
      this.logger.warn(
        `PostgreSQL server not connected (${(error as Error).message}). Operating with in-memory resilient fallback data layer for local evaluation.`,
      );
      this.isConnected = false;
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
