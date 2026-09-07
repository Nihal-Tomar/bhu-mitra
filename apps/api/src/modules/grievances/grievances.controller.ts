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
import { GrievancesService } from './grievances.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { GrievanceDto, UserSession } from '@bhumitra/types';

@ApiTags('Grievances & Section 15 Objections')
@Controller('grievances')
export class GrievancesController {
  constructor(private readonly grievancesService: GrievancesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List public grievances and Section 15 statutory objections' })
  @ApiResponse({ status: 200, description: 'Grievance list' })
  async getAll(
    @Query('projectId') projectId?: string,
    @Query('status') status?: string,
    @Query('isOverdue') isOverdue?: boolean,
  ) {
    const items = await this.grievancesService.getAll({ projectId, status, isOverdue });
    return {
      data: items,
      meta: {
        total: items.length,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Public()
  @Get(':ticket')
  @ApiOperation({ summary: 'Get grievance by ticket number or ID' })
  @ApiResponse({ status: 200, description: 'Grievance details' })
  async getByTicket(@Param('ticket') ticket: string) {
    const item = await this.grievancesService.getByTicket(ticket);
    return { data: item };
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'File a public objection / citizen grievance' })
  @ApiResponse({ status: 201, description: 'Grievance submitted successfully' })
  async create(@Body() body: Partial<GrievanceDto>) {
    const item = await this.grievancesService.create(body);
    return { data: item };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DISTRICT_COLLECTOR', 'CALA', 'LAND_ACQUISITION_OFFICER', 'SUPER_ADMIN')
  @Patch(':id/status')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update grievance resolution status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: GrievanceDto['status'],
    @Body('remarks') remarks: string,
    @CurrentUser() user: UserSession,
  ) {
    const updated = await this.grievancesService.updateStatus(
      id,
      status,
      remarks,
      user.id,
      user.name,
      user.role,
    );
    return { data: updated };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DISTRICT_COLLECTOR', 'CALA', 'LAND_ACQUISITION_OFFICER', 'SUPER_ADMIN')
  @Post(':id/hearing')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Schedule Section 15 statutory objection hearing' })
  async scheduleHearing(
    @Param('id') id: string,
    @Body('hearingDate') hearingDate: string,
    @CurrentUser() user: UserSession,
  ) {
    const updated = await this.grievancesService.scheduleHearing(
      id,
      hearingDate,
      user.id,
      user.name,
      user.role,
    );
    return { data: updated };
  }
}
