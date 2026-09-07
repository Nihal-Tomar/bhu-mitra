import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { UserSession } from '@bhumitra/types';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get in-app notifications for the authenticated officer' })
  async getNotifications(@CurrentUser() user: UserSession) {
    const data = await this.notificationsService.getNotifications(user);
    return { data };
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count for officer badge' })
  async getUnreadCount(@CurrentUser() user: UserSession) {
    const count = await this.notificationsService.getUnreadCount(user);
    return { data: { unreadCount: count } };
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@CurrentUser() user: UserSession) {
    const res = await this.notificationsService.markAllAsRead(user);
    return { data: res };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a specific notification as read' })
  async markAsRead(@Param('id') id: string, @CurrentUser() user: UserSession) {
    const res = await this.notificationsService.markAsRead(id, user);
    return { data: res };
  }
}
