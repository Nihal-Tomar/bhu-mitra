import { Injectable, Optional, Logger } from '@nestjs/common';
import { DataStoreService } from '../../common/data-store/data-store.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { NotificationDto, UserSession } from '@bhumitra/types';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async getNotifications(user: UserSession): Promise<NotificationDto[]> {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const notifs = await this.prisma.notification.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
        });

        if (notifs.length > 0) {
          return notifs.map((n) => ({
            id: n.id,
            userId: n.userId,
            title: n.title,
            message: n.message,
            type: (n.type as any) || 'SLA_ALERT',
            priority: (n.priority as any) || 'MEDIUM',
            linkUrl: n.linkUrl || undefined,
            isRead: n.isRead,
            createdAt: n.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        this.logger.warn(`Prisma getNotifications failed: ${(err as Error).message}`);
      }
    }

    return this.dataStore.getNotificationsForUser(user.id);
  }

  async getUnreadCount(user: UserSession): Promise<number> {
    const list = await this.getNotifications(user);
    return list.filter((n) => !n.isRead).length;
  }

  async markAsRead(id: string, user: UserSession): Promise<{ success: boolean }> {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.notification.updateMany({
          where: { id, userId: user.id },
          data: { isRead: true },
        });
      } catch (err) {
        this.logger.warn(`Failed to mark read in DB: ${(err as Error).message}`);
      }
    }

    this.dataStore.markNotificationRead(id, user.id);
    return { success: true };
  }

  async markAllAsRead(user: UserSession): Promise<{ success: boolean; count: number }> {
    let count = 0;
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const res = await this.prisma.notification.updateMany({
          where: { userId: user.id, isRead: false },
          data: { isRead: true },
        });
        count = res.count;
      } catch (err) {
        this.logger.warn(`Failed to mark all read in DB: ${(err as Error).message}`);
      }
    }

    const memCount = this.dataStore.markAllNotificationsRead(user.id);
    return { success: true, count: count || memCount };
  }

  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'SLA_ALERT' | 'COMPLIANCE' | 'SYSTEM' | 'APPROVAL_REQUIRED',
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    entityType?: string,
    entityId?: string,
  ): Promise<NotificationDto> {
    const notif: NotificationDto = {
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      type,
      priority,
      entityType,
      entityId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.notification.create({
          data: {
            id: notif.id,
            userId,
            title,
            message,
            type,
            priority,
            isRead: false,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed to insert notification in DB: ${(err as Error).message}`);
      }
    }

    return notif;
  }
}
