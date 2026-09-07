import { Injectable, Optional, Logger } from '@nestjs/common';
import { DataStoreService } from '../../common/data-store/data-store.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { AuditLogDto } from '@bhumitra/types';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async getLogs(query?: {
    entityType?: string;
    entityId?: string;
    actorId?: string;
    action?: string;
  }): Promise<AuditLogDto[]> {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const where: Record<string, any> = {};
        if (query?.entityType) where.entityType = query.entityType;
        if (query?.entityId) where.entityId = query.entityId;
        if (query?.actorId) where.actorId = query.actorId;
        if (query?.action) where.action = query.action;

        const logs = await this.prisma.auditLog.findMany({
          where,
          orderBy: { timestamp: 'desc' },
          take: 100,
        });

        if (logs.length > 0) {
          return logs.map((l) => ({
            id: l.id,
            actorId: l.actorId || 'system',
            actorName: l.actorName,
            actorRole: l.actorRole || 'OFFICER',
            action: l.action as any,
            entityType: l.entityType as any,
            entityId: l.entityId,
            previousState: (l.previousState as Record<string, unknown>) || undefined,
            newState: (l.newState as Record<string, unknown>) || undefined,
            ipAddress: l.ipAddress || undefined,
            remarks: l.remarks || undefined,
            timestamp: l.timestamp.toISOString(),
          }));
        }
      } catch (err) {
        this.logger.warn(`Prisma getLogs failed: ${(err as Error).message}`);
      }
    }

    let items = this.dataStore.getAuditLogs(query);
    if (query?.actorId) {
      items = items.filter((l) => l.actorId === query.actorId);
    }
    if (query?.action) {
      items = items.filter((l) => l.action === query.action);
    }
    return items;
  }
}
