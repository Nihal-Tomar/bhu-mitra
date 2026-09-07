import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Command Centre & Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Public()
  @Get('dashboard')
  @ApiOperation({ summary: 'National Command Centre live KPIs, state breakdown & priority actions' })
  @ApiResponse({ status: 200, description: 'Live database-driven Command Centre metrics' })
  async getDashboard() {
    const data = await this.analyticsService.getDashboard();
    return { data };
  }

  @Public()
  @Get('decision-support')
  @ApiOperation({ summary: 'Explainable rule-based decision support radar (delay risk, bottleneck predictions)' })
  @ApiResponse({ status: 200, description: 'Decision support radar insights' })
  getDecisionSupport() {
    return {
      data: this.analyticsService.getDecisionSupport(),
    };
  }
}
