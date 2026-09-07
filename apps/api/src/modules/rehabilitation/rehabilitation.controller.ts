import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RehabilitationService } from './rehabilitation.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { RRCaseDto, UserSession } from '@bhumitra/types';

@ApiTags('Rehabilitation & Resettlement (R&R)')
@Controller('rr')
export class RehabilitationController {
  constructor(private readonly rrService: RehabilitationService) {}

  @Public()
  @Get('cases')
  @ApiOperation({ summary: 'List R&R cases, family heads, packages, and plot allocations' })
  @ApiResponse({ status: 200, description: 'R&R cases list' })
  async getCases(@Query('projectId') projectId?: string) {
    const items = await this.rrService.getCases(projectId);
    return {
      data: items,
      meta: {
        total: items.length,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Public()
  @Get('cases/:id')
  @ApiOperation({ summary: 'Get detailed R&R case by ID' })
  async getCaseById(@Param('id') id: string) {
    const data = await this.rrService.getCaseById(id);
    return { data };
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Get R&R national/project entitlement statistics' })
  async getStats() {
    const data = await this.rrService.getStats();
    return { data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DISTRICT_COLLECTOR', 'CALA', 'RR_OFFICER', 'SUPER_ADMIN')
  @Post('cases')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new R&R case record for affected family' })
  async createCase(
    @Body() body: Partial<RRCaseDto>,
    @CurrentUser() user: UserSession,
  ) {
    const created = await this.rrService.createCase(body, user.id, user.name, user.role);
    return { data: created };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DISTRICT_COLLECTOR', 'CALA', 'RR_OFFICER', 'SUPER_ADMIN')
  @Patch('cases/:id/status')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update R&R case progression status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: RRCaseDto['status'],
    @CurrentUser() user: UserSession,
  ) {
    const updated = await this.rrService.updateStatus(id, status, user.id, user.name, user.role);
    return { data: updated };
  }
}
