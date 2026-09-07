import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CompensationService } from './compensation.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { CompensationAwardDto, UserSession } from '@bhumitra/types';
import type { RfctlarrCalcParams } from './calculator/rfctlarr.calculator';

@ApiTags('Compensation, Valuation & Awards')
@Controller('compensation')
export class CompensationController {
  constructor(private readonly compensationService: CompensationService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get compensation overview (valuations, awards, payments)' })
  @ApiResponse({ status: 200, description: 'Compensation summary' })
  async getSummary() {
    const summary = await this.compensationService.getSummary();
    return {
      data: summary,
    };
  }

  @Public()
  @Post('calculate')
  @ApiOperation({ summary: 'Calculate statutory compensation per RFCTLARR 2013 First Schedule' })
  @ApiResponse({ status: 200, description: 'Calculated breakdown with solatium and interest' })
  calculate(@Body() body: RfctlarrCalcParams) {
    const result = this.compensationService.calculateCompensation(body);
    return {
      data: result,
    };
  }

  @Public()
  @Get('valuations')
  @ApiOperation({ summary: 'List market valuations with 100% solatium & multiplier breakdown' })
  getValuations() {
    return {
      data: this.compensationService.getValuations(),
    };
  }

  @Public()
  @Get('awards')
  @ApiOperation({ summary: 'List statutory Section 23/30 awards' })
  getAwards() {
    return {
      data: this.compensationService.getAwards(),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DISTRICT_COLLECTOR', 'CALA', 'SUPER_ADMIN')
  @Post('awards')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Issue statutory Section 23/30 compensation award' })
  async createAward(
    @Body() awardData: Partial<CompensationAwardDto>,
    @CurrentUser() user: UserSession,
  ) {
    const award = await this.compensationService.createAward(awardData, user.id, user.name, user.role);
    return {
      data: award,
    };
  }

  @Public()
  @Get('payments')
  @ApiOperation({ summary: 'List DBT payment transactions' })
  getPayments() {
    return {
      data: this.compensationService.getPayments(),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DISTRICT_COLLECTOR', 'CALA', 'COMPENSATION_OFFICER', 'SUPER_ADMIN')
  @Post('disbursements')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Execute transactional DBT compensation disbursement' })
  async recordDisbursement(
    @Body()
    body: {
      awardId: string;
      beneficiaryName: string;
      accountNumberMasked: string;
      ifsc: string;
      amount: number;
      utrNumber?: string;
    },
    @CurrentUser() user: UserSession,
  ) {
    const payment = await this.compensationService.recordDisbursement(
      body,
      user.id,
      user.name,
      user.role,
    );
    return {
      data: payment,
    };
  }
}
