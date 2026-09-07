import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JurisdictionGuard } from '../../common/guards/jurisdiction.guard';
import type { ProjectDto, ProjectFilterQuery, UserSession } from '@bhumitra/types';

@ApiTags('Projects & Digital Twin')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all acquisition projects (filtered & paginated)' })
  @ApiResponse({ status: 200, description: 'List of acquisition projects' })
  async getAll(@Query() query: ProjectFilterQuery) {
    const result = await this.projectsService.getAll(query);
    return {
      data: result.items,
      meta: {
        total: result.total,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get complete project details by ID or project code' })
  @ApiResponse({ status: 200, description: 'Detailed project view' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getById(@Param('id') id: string) {
    const project = await this.projectsService.getById(id);
    return {
      data: project,
    };
  }

  @Public()
  @Get(':id/summary')
  @ApiOperation({ summary: 'Get project Digital Twin high-level summary' })
  async getSummary(@Param('id') id: string) {
    const project = await this.projectsService.getById(id);
    return {
      data: {
        id: project.id,
        projectCode: project.projectCode,
        name: project.name,
        type: project.type,
        ministry: project.ministry,
        stage: project.stage,
        slaDaysRemaining: project.slaDaysRemaining,
        riskLevel: project.riskLevel,
        landAcquiredHa: project.totalAreaAcquiredHa,
        landProposedHa: project.totalAreaProposedHa,
        progressPercentage: Math.round((project.totalAreaAcquiredHa / (project.totalAreaProposedHa || 1)) * 100),
      },
    };
  }

  @Public()
  @Get(':id/health')
  @ApiOperation({ summary: 'Get project health score and risk diagnostics' })
  async getHealth(@Param('id') id: string) {
    const health = await this.projectsService.getHealth(id);
    return {
      data: health,
    };
  }

  @UseGuards(JwtAuthGuard, JurisdictionGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new land acquisition project proposal' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async create(@Body() body: Partial<ProjectDto>, @CurrentUser() user: UserSession) {
    const project = await this.projectsService.create(body, user.id, user.name);
    return {
      data: project,
    };
  }
}
