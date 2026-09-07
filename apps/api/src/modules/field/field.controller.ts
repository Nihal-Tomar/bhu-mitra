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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FieldService } from './field.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { FieldInspectionDto, UserSession } from '@bhumitra/types';

@ApiTags('Field Operations')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Get('inspections')
  @ApiOperation({ summary: 'Get field inspection records for parcels/projects' })
  @ApiQuery({ name: 'parcelId', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  async getInspections(
    @Query('parcelId') parcelId?: string,
    @Query('projectId') projectId?: string,
  ) {
    const data = await this.fieldService.getInspections({ parcelId, projectId });
    return { data };
  }

  @Post('inspections')
  @ApiOperation({ summary: 'Submit a field inspection report with GPS coordinates and evidence' })
  async submitInspection(@Body() data: Partial<FieldInspectionDto>, @CurrentUser() user: UserSession) {
    const created = await this.fieldService.submitInspection(data, user);
    return { data: created };
  }

  @UseGuards(RolesGuard)
  @Roles('DISTRICT_COLLECTOR', 'CALA', 'TEHSILDAR', 'SUPER_ADMIN')
  @Patch('inspections/:id/verify')
  @ApiOperation({ summary: 'Verify or flag discrepancies in a field inspection report' })
  async verifyInspection(
    @Param('id') id: string,
    @Body('status') status: 'VERIFIED' | 'DISCREPANCY_NOTED' | 'RE_SURVEY_REQUIRED',
    @Body('notes') notes: string,
    @CurrentUser() user: UserSession,
  ) {
    const updated = await this.fieldService.verifyInspection(
      id,
      status,
      notes,
      user.id,
      user.name,
      user.role,
    );
    return { data: updated };
  }
}
