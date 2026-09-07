import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Optional,
} from '@nestjs/common';
import { DataStoreService } from '../../common/data-store/data-store.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { ActionCentreResponse, WorkflowActionDto, TransitionDto, ProjectStage } from '@bhumitra/types';

// RFCTLARR 2013 Statutory Stage Transition State Machine
export const STATUTORY_STAGE_SEQUENCE: Record<ProjectStage, ProjectStage[]> = {
  SIA: ['SEC_11_PRELIMINARY'],
  SEC_11_PRELIMINARY: ['SEC_15_HEARING'],
  SEC_15_HEARING: ['SEC_19_DECLARATION'],
  SEC_19_DECLARATION: ['VALUATION'],
  VALUATION: ['SEC_23_AWARD'],
  SEC_23_AWARD: ['COMPENSATION_DISBURSED'],
  COMPENSATION_DISBURSED: ['R_AND_R', 'SEC_38_POSSESSION'],
  R_AND_R: ['SEC_38_POSSESSION'],
  SEC_38_POSSESSION: ['COMPLETED'],
  COMPLETED: [],
};

// Required roles for critical statutory gating
export const STAGE_ROLE_GATES: Partial<Record<ProjectStage, string[]>> = {
  SEC_19_DECLARATION: ['DISTRICT_COLLECTOR', 'JOINT_SECRETARY', 'SUPER_ADMIN'],
  SEC_23_AWARD: ['DISTRICT_COLLECTOR', 'CALA', 'SUPER_ADMIN'],
  COMPENSATION_DISBURSED: ['DISTRICT_COLLECTOR', 'CALA', 'COMPENSATION_OFFICER', 'SUPER_ADMIN'],
  SEC_38_POSSESSION: ['DISTRICT_COLLECTOR', 'SUPER_ADMIN'],
};

@Injectable()
export class WorkflowService {
  constructor(
    private readonly dataStore: DataStoreService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  getActionCentre(role?: string): ActionCentreResponse {
    return this.dataStore.getActionCentre(role);
  }

  completeAction(id: string, remarks?: string): WorkflowActionDto {
    const action = this.dataStore.completeAction(id, remarks);
    if (!action) {
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }
    return action;
  }

  async transition(
    data: TransitionDto,
    actorId: string,
    actorName: string,
    actorRole?: string,
  ) {
    let project = this.dataStore.getProjectById(data.projectId);
    let currentStage = (project?.stageCode || data.fromStage) as ProjectStage;

    if (this.prisma && this.prisma.isDbConnected) {
      const dbProject = await this.prisma.project.findUnique({
        where: { id: data.projectId },
      });
      if (dbProject) {
        currentStage = (dbProject.stageCode || data.fromStage) as ProjectStage;
      }
    }

    if (!project && (!this.prisma || !this.prisma.isDbConnected)) {
      throw new NotFoundException(`Project "${data.projectId}" not found`);
    }

    // 1. Validate state machine transition
    const allowedNextStages = STATUTORY_STAGE_SEQUENCE[currentStage] || [];
    if (!allowedNextStages.includes(data.toStage)) {
      throw new BadRequestException(
        `Invalid statutory stage transition: Cannot advance project from "${currentStage}" to "${data.toStage}". Allowed transitions: [${allowedNextStages.join(', ')}]`,
      );
    }

    // 2. Role-gate validation
    const requiredRoles = STAGE_ROLE_GATES[data.toStage];
    if (requiredRoles && actorRole && !requiredRoles.includes(actorRole) && actorRole !== 'SUPER_ADMIN') {
      throw new ForbiddenException(
        `Unauthorized workflow transition: Stage "${data.toStage}" requires one of the following roles: [${requiredRoles.join(', ')}]. Current officer role: "${actorRole}".`,
      );
    }

    // 3. Business rule check: Cannot move to POSSESSION if compensation disbursed < 80%
    if (data.toStage === 'SEC_38_POSSESSION' && project) {
      const disbursedRatio = project.compensationDisbursedCr / (project.compensationAssessedCr || 1);
      if (disbursedRatio < 0.8) {
        throw new BadRequestException(
          `Statutory possession condition unsatisfied: RFCTLARR 2013 mandates substantial compensation disbursal prior to possession handover. Current disbursal is only ${(disbursedRatio * 100).toFixed(1)}%.`,
        );
      }
    }

    // 4. Update in Prisma if connected
    if (this.prisma && this.prisma.isDbConnected) {
      await this.prisma.project.update({
        where: { id: data.projectId },
        data: { stageCode: data.toStage, stage: data.toStage.replace(/_/g, ' ') },
      });

      await this.prisma.auditLog.create({
        data: {
          actorId,
          actorName,
          actorRole: actorRole || 'OFFICER',
          action: 'TRANSITION',
          entityType: 'PROJECT',
          entityId: data.projectId,
          remarks: `Stage advanced from ${currentStage} to ${data.toStage}. Reason: ${data.remarks || 'Statutory progression'}`,
        },
      });
    }

    // 5. Update in memory store
    if (project) {
      project.stageCode = data.toStage;
      project.stage = `${data.toStage.replace(/_/g, ' ')}`;
    }

    this.dataStore.addAuditLog(
      actorId,
      actorName,
      'TRANSITION',
      'PROJECT',
      data.projectId,
      `Advanced stage from ${currentStage} to ${data.toStage}. Remarks: ${data.remarks || 'Statutory progression'}`,
    );

    return {
      success: true,
      projectId: data.projectId,
      previousStage: currentStage,
      currentStage: data.toStage,
      message: `Project successfully advanced to statutory stage: ${data.toStage}`,
    };
  }
}
