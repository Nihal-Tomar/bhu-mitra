import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Audit Trail')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Retrieve tamper-evident audit logs (filterable by entity, actor, action)' })
  @ApiQuery({ name: 'entityType', required: false, description: 'Filter by entity type (e.g. PROJECT, PARCEL, USER)' })
  @ApiQuery({ name: 'entityId', required: false, description: 'Filter by specific entity ID' })
  @ApiQuery({ name: 'actorId', required: false, description: 'Filter by officer actor ID' })
  @ApiQuery({ name: 'action', required: false, description: 'Filter by action type (CREATE, UPDATE, LOGIN, DISBURSE)' })
  async getLogs(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('actorId') actorId?: string,
    @Query('action') action?: string,
  ) {
    const items = await this.auditService.getLogs({ entityType, entityId, actorId, action });
    return {
      data: items,
      meta: {
        total: items.length,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
