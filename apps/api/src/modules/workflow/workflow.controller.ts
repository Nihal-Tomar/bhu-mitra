import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { TransitionDto, UserSession } from '@bhumitra/types';

@ApiTags('Action Centre & Statutory Workflow')
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Public()
  @Get('action-centre')
  @ApiOperation({ summary: 'Get Action Centre tasks with SLA status (urgent, due today, upcoming)' })
  @ApiResponse({ status: 200, description: 'Action Centre task groups' })
  getActionCentre(@Query('role') role?: string) {
    return {
      data: this.workflowService.getActionCentre(role),
    };
  }

  @Public()
  @Post('actions/:id/complete')
  @ApiOperation({ summary: 'Mark Action Centre task as completed' })
  completeAction(@Param('id') id: string, @Body('remarks') remarks?: string) {
    return {
      data: this.workflowService.completeAction(id, remarks),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('transition')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Transition acquisition project to next statutory stage' })
  transition(@Body() data: TransitionDto, @CurrentUser() user: UserSession) {
    return {
      data: this.workflowService.transition(data, user.id, user.name, user.role),
    };
  }
}
