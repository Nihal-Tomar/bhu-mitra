import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AiService } from './services/ai.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AiQueryDto, UserSession } from '@bhumitra/types';

@ApiTags('Bhu-Mitra AI Assistant & Command Intelligence')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Public()
  @Post('query')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit natural language query to Bhu-Mitra AI Assistant' })
  @ApiResponse({ status: 200, description: 'Structured AI Command Response' })
  async query(@Body() body: AiQueryDto, @CurrentUser() user?: UserSession) {
    const response = await this.aiService.processQuery(body, user);
    return {
      data: response,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Public()
  @Get('conversations')
  @ApiOperation({ summary: 'List recent AI Assistant conversation sessions' })
  getConversations() {
    const sessions = this.aiService.getConversations();
    return {
      data: sessions,
    };
  }

  @Public()
  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get messages for an AI conversation session' })
  getConversation(@Param('id') id: string) {
    const session = this.aiService.getConversationById(id);
    return {
      data: session,
    };
  }

  @Public()
  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Delete or clear an AI conversation session' })
  deleteConversation(@Param('id') id: string) {
    const success = this.aiService.deleteConversation(id);
    return {
      data: { success },
    };
  }

  @Public()
  @Get('briefing')
  @ApiOperation({ summary: 'Get Today AI Daily Executive Briefing' })
  async getBriefing() {
    const briefing = await this.aiService.processQuery({ message: 'daily briefing' });
    return {
      data: briefing,
    };
  }

  @Public()
  @Get('reports/csv')
  @ApiOperation({ summary: 'Download consolidated national acquisition MIS report as CSV' })
  downloadCsv() {
    const csv = [
      'ProjectCode,CorridorName,State,District,StageCode,ProposedAreaHa,AcquiredAreaHa,CompensationAssessedCr,CompensationDisbursedCr,SLADaysRemaining,RiskLevel',
      'DOLR-2026-0084,NH-48 Bharatmala Six-Laning Corridor,Gujarat,Vadodara,SEC_19_DECLARATION,142.5,89.4,148.5,98.4,8,high',
      'DOLR-2026-0059,Lucknow Metro Phase III North Corridor,Uttar Pradesh,Lucknow,VALUATION,85.0,32.0,185.0,72.0,-14,critical',
      'DOLR-2026-0072,Western Dedicated Freight Corridor (Phase 2),Rajasthan,Jaipur Rural,SEC_15_HEARING,210.0,140.0,310.0,240.0,22,medium',
      'DOLR-2026-0066,Pune–Nashik Semi High-Speed Rail Corridor,Maharashtra,Pune,SEC_11_PRELIMINARY,165.0,45.0,220.0,65.0,41,medium',
      'DOLR-2026-0091,Rewa Ultra-Mega Solar Industrial Corridor,Madhya Pradesh,Bhopal,SEC_23_AWARD,95.0,88.0,85.0,82.0,64,low',
      'DOLR-2026-0043,Dhamra Port Coastal Industrial Node,Odisha,Khordha,POSSESSION,118.0,105.0,140.0,135.0,88,low',
    ].join('\n');

    return {
      data: {
        filename: 'bhumitra-national-acquisition-report.csv',
        contentType: 'text/csv',
        csv,
      },
    };
  }
}
