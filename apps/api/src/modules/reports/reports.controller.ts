import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiProduces } from '@nestjs/swagger';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Reports & MIS')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('mis')
  @ApiOperation({ summary: 'Get Management Information System summary report' })
  async getMisReport() {
    const data = await this.reportsService.getMisReport();
    return { data };
  }

  @Get('export')
  @ApiOperation({ summary: 'Export report data as CSV' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Report type: state-kpi, projects, compensation, grievances, or mis (default)',
  })
  @ApiProduces('text/csv', 'application/json')
  async exportCsv(@Query('type') type = 'mis', @Res({ passthrough: true }) res: Response) {
    const csv = await this.reportsService.exportCsv(type);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="bhumitra-${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
    );
    return csv;
  }
}
