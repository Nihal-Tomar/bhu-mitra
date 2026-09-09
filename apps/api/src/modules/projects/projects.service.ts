import {
  Injectable,
  NotFoundException,
  Optional,
  Logger,
} from '@nestjs/common';
import { DataStoreService } from '../../common/data-store/data-store.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { ProjectDto, ProjectFilterQuery } from '@bhumitra/types';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async getAll(query?: ProjectFilterQuery): Promise<{ items: ProjectDto[]; total: number }> {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const where: Record<string, any> = {};
        if (query?.state) {
          where.state = { code: query.state };
        }
        if (query?.status) {
          where.status = query.status;
        }
        if (query?.search) {
          where.OR = [
            { name: { contains: query.search, mode: 'insensitive' } },
            { projectCode: { contains: query.search, mode: 'insensitive' } },
          ];
        }

        const [items, total] = await Promise.all([
          this.prisma.project.findMany({
            where,
            include: { state: true, district: true },
            take: query?.limit || 50,
            skip: query?.page ? (query.page - 1) * (query.limit || 50) : 0,
            orderBy: { createdAt: 'desc' },
          }),
          this.prisma.project.count({ where }),
        ]);

        if (items.length > 0) {
          return {
            items: items.map((p) => ({
              id: p.id,
              projectCode: p.projectCode,
              name: p.name,
              description: p.description || undefined,
              type: (p.type as any) || 'Highway',
              ministry: p.ministry || 'MoRTH',
              requiringBody: p.requiringBody || 'NHAI',
              state: p.state?.name || 'Unknown',
              stateCode: p.state?.code || 'GJ',
              district: p.district?.name || 'Unknown',
              stage: p.stage,
              stageCode: (p.stageCode as any) || 'SIA',
              status: (p.status as any) || 'IN_PROGRESS',
              totalAreaProposedHa: p.totalAreaProposedHa,
              totalAreaNotifiedHa: p.totalAreaNotifiedHa,
              totalAreaAcquiredHa: p.totalAreaAcquiredHa,
              estimatedBudgetCr: p.estimatedBudgetCr,
              compensationAssessedCr: p.compensationAssessedCr,
              compensationDisbursedCr: p.compensationDisbursedCr,
              affectedFamilies: p.affectedFamilies,
              slaDaysRemaining: p.slaDaysRemaining,
              riskLevel: (p.riskLevel as any) || 'medium',
              delayPredictedDays: p.delayPredictedDays,
              recommendedAction: p.recommendedAction || 'Proceed with planned survey',
              targetCompletionDate: p.targetCompletionDate.toISOString(),
              startDate: p.startDate.toISOString(),
              createdAt: p.createdAt.toISOString(),
              updatedAt: p.updatedAt.toISOString(),
            })),
            total,
          };
        }
      } catch (err) {
        this.logger.warn(`Prisma getAll projects query failed: ${(err as Error).message}. Using fallback.`);
      }
    }

    const items = this.dataStore.getProjects(query);
    return {
      items,
      total: items.length,
    };
  }

  async getById(id: string): Promise<ProjectDto> {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const p = await this.prisma.project.findFirst({
          where: { OR: [{ id }, { projectCode: id }] },
          include: { state: true, district: true },
        });
        if (p) {
          return {
            id: p.id,
            projectCode: p.projectCode,
            name: p.name,
            description: p.description || undefined,
            type: (p.type as any) || 'Highway',
            ministry: p.ministry || 'MoRTH',
            requiringBody: p.requiringBody || 'NHAI',
            state: p.state?.name || 'Unknown',
            stateCode: p.state?.code || 'GJ',
            district: p.district?.name || 'Unknown',
            stage: p.stage,
            stageCode: (p.stageCode as any) || 'SIA',
            status: (p.status as any) || 'IN_PROGRESS',
            totalAreaProposedHa: p.totalAreaProposedHa,
            totalAreaNotifiedHa: p.totalAreaNotifiedHa,
            totalAreaAcquiredHa: p.totalAreaAcquiredHa,
            estimatedBudgetCr: p.estimatedBudgetCr,
            compensationAssessedCr: p.compensationAssessedCr,
            compensationDisbursedCr: p.compensationDisbursedCr,
            affectedFamilies: p.affectedFamilies,
            slaDaysRemaining: p.slaDaysRemaining,
            riskLevel: (p.riskLevel as any) || 'medium',
            delayPredictedDays: p.delayPredictedDays,
            recommendedAction: p.recommendedAction || 'Proceed with planned survey',
            targetCompletionDate: p.targetCompletionDate.toISOString(),
            startDate: p.startDate.toISOString(),
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          };
        }
      } catch (err) {
        this.logger.warn(`Prisma getById failed: ${(err as Error).message}`);
      }
    }

    const project = this.dataStore.getProjectById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID or Code "${id}" not found`);
    }
    return project;
  }

  async create(data: Partial<ProjectDto>, actorId: string, actorName: string): Promise<ProjectDto> {
    const project = this.dataStore.createProject(data);
    this.dataStore.addAuditLog(actorId, actorName, 'CREATE', 'PROJECT', project.id, `Created acquisition project ${project.name}`);

    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const state = await this.prisma.state.findFirst({
          where: { OR: [{ code: project.stateCode }, { name: project.state }] },
        });
        const district = await this.prisma.district.findFirst({
          where: { name: { contains: project.district, mode: 'insensitive' } },
        });
        if (state && district) {
          await this.prisma.project.create({
            data: {
              id: project.id,
              projectCode: project.projectCode,
              name: project.name,
              description: project.description,
              type: project.type,
              ministry: project.ministry,
              requiringBody: project.requiringBody,
              stateId: state.id,
              districtId: district.id,
              stage: project.stage,
              stageCode: project.stageCode,
              status: project.status,
              totalAreaProposedHa: project.totalAreaProposedHa,
              totalAreaNotifiedHa: project.totalAreaNotifiedHa,
              totalAreaAcquiredHa: project.totalAreaAcquiredHa || 0,
              estimatedBudgetCr: project.estimatedBudgetCr,
              compensationAssessedCr: project.compensationAssessedCr || 0,
              compensationDisbursedCr: project.compensationDisbursedCr || 0,
              affectedFamilies: project.affectedFamilies || 0,
              slaDaysRemaining: project.slaDaysRemaining || 90,
              riskLevel: project.riskLevel || 'low',
              delayPredictedDays: project.delayPredictedDays || 0,
              recommendedAction: project.recommendedAction,
              targetCompletionDate: new Date(project.targetCompletionDate || Date.now() + 365 * 86400000),
              startDate: new Date(project.startDate || Date.now()),
            },
          });
        }
        await this.prisma.auditLog.create({
          data: {
            actorId,
            actorName,
            actorRole: 'OFFICER',
            action: 'CREATE',
            entityType: 'PROJECT',
            entityId: project.id,
            remarks: `Created acquisition project ${project.name}`,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed to persist project to DB: ${(err as Error).message}`);
      }
    }

    return project;
  }

  async getHealth(id: string) {
    const project = await this.getById(id);
    const score = project.riskLevel === 'critical' ? 42
      : project.riskLevel === 'high' ? 64
      : project.riskLevel === 'medium' ? 82 : 94;

    return {
      projectId: project.id,
      projectCode: project.projectCode,
      name: project.name,
      healthScore: score,
      slaDaysRemaining: project.slaDaysRemaining,
      riskLevel: project.riskLevel,
      delayPredictedDays: project.delayPredictedDays,
      recommendedAction: project.recommendedAction,
      breakdown: {
        slaCompliance: project.slaDaysRemaining > 0 ? 92 : 45,
        landAcquiredPercentage: Math.round((project.totalAreaAcquiredHa / project.totalAreaProposedHa) * 100),
        compensationDisbursedPercentage: Math.round((project.compensationDisbursedCr / (project.compensationAssessedCr || 1)) * 100),
        publicGrievancesUnresolved: project.riskLevel === 'critical' ? 8 : 2,
      },
    };
  }
}
