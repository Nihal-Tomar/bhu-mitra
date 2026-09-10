import { Injectable, Logger } from '@nestjs/common';
import { ProjectsService } from '../../projects/projects.service';
import { ParcelsService } from '../../parcels/parcels.service';
import { AnalyticsService } from '../../analytics/analytics.service';
import { CompensationService } from '../../compensation/compensation.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { ReportsService } from '../../reports/reports.service';
import { DocumentsService } from '../../documents/documents.service';
import { GisService } from '../../gis/gis.service';
import type {
  ProjectDto,
  LandParcelDto,
  Parcel360Dto,
  UserSession,
} from '@bhumitra/types';

@Injectable()
export class AiToolsService {
  private readonly logger = new Logger(AiToolsService.name);

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly parcelsService: ParcelsService,
    private readonly analyticsService: AnalyticsService,
    private readonly compensationService: CompensationService,
    private readonly workflowService: WorkflowService,
    private readonly reportsService: ReportsService,
    private readonly documentsService: DocumentsService,
    private readonly gisService: GisService,
  ) {}

  /**
   * Search projects matching keywords or filter
   */
  async searchProjects(query: string, user?: UserSession): Promise<ProjectDto[]> {
    const res = await this.projectsService.getAll({ search: query, limit: 10 });
    let projects = res.items;

    // Filter by officer jurisdiction if restricted
    if (user && user.role !== 'SUPER_ADMIN' && user.role !== 'CENTRAL_MINISTRY_ADMIN' && user.stateCode) {
      projects = projects.filter(
        (p) => !p.stateCode || p.stateCode.toLowerCase() === user.stateCode!.toLowerCase(),
      );
    }
    return projects;
  }

  /**
   * Get single project details by ID or Code
   */
  async getProjectDetails(idOrCode: string, user?: UserSession): Promise<ProjectDto | null> {
    try {
      const project = await this.projectsService.getById(idOrCode);
      if (
        user &&
        user.role !== 'SUPER_ADMIN' &&
        user.role !== 'CENTRAL_MINISTRY_ADMIN' &&
        user.stateCode &&
        project.stateCode &&
        project.stateCode.toLowerCase() !== user.stateCode.toLowerCase()
      ) {
        this.logger.warn(`User ${user.id} denied access to project ${project.id} outside state`);
        return null;
      }
      return project;
    } catch {
      return null;
    }
  }

  /**
   * Get project health and calculated progress
   */
  async getProjectHealth(id: string) {
    try {
      return await this.projectsService.getHealth(id);
    } catch {
      return null;
    }
  }

  /**
   * Search land parcels matching query
   */
  async searchLandParcels(query: string, projectId?: string): Promise<LandParcelDto[]> {
    const list = await this.parcelsService.getAll({ search: query, projectId });
    return list.slice(0, 15);
  }

  /**
   * Get full 360 dossier for a specific parcel
   */
  async getParcel360(parcelIdOrSurvey: string): Promise<Parcel360Dto | null> {
    try {
      return await this.parcelsService.getParcel360(parcelIdOrSurvey);
    } catch {
      return null;
    }
  }

  /**
   * Get all delayed or high-risk projects
   */
  async getDelayedProjects(): Promise<ProjectDto[]> {
    const res = await this.projectsService.getAll({ limit: 50 });
    return res.items.filter(
      (p) =>
        p.status === 'DELAYED' ||
        p.riskLevel === 'critical' ||
        p.riskLevel === 'high' ||
        p.slaDaysRemaining <= 15 ||
        p.delayPredictedDays > 0,
    );
  }

  /**
   * Get recent projects sorted by updatedAt / createdAt descending
   */
  async getRecentProjects(limit = 5): Promise<ProjectDto[]> {
    const res = await this.projectsService.getAll({ limit: 50 });
    return [...res.items]
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  /**
   * Filter projects dynamically by state, sector, stage, delay, risk
   */
  async filterProjects(filters: {
    state?: string;
    stateCode?: string;
    sector?: string;
    stageCode?: string;
    isDelayed?: boolean;
    isCritical?: boolean;
    hasCompensationPending?: boolean;
  }): Promise<ProjectDto[]> {
    const res = await this.projectsService.getAll({ limit: 50 });
    let items = res.items;

    if (filters.state) {
      const target = filters.state.toLowerCase();
      items = items.filter(
        (p) =>
          p.state?.toLowerCase().includes(target) ||
          (filters.stateCode && p.stateCode?.toLowerCase() === filters.stateCode.toLowerCase()),
      );
    } else if (filters.stateCode) {
      items = items.filter((p) => p.stateCode?.toLowerCase() === filters.stateCode!.toLowerCase());
    }

    if (filters.sector) {
      const s = filters.sector.toLowerCase();
      items = items.filter((p) => p.type?.toLowerCase().includes(s));
    }

    if (filters.stageCode) {
      items = items.filter((p) => p.stageCode === filters.stageCode || p.stage?.includes(filters.stageCode!));
    }

    if (filters.isDelayed) {
      items = items.filter(
        (p) =>
          p.status === 'DELAYED' ||
          p.slaDaysRemaining < 0 ||
          p.riskLevel === 'critical' ||
          p.riskLevel === 'high' ||
          p.delayPredictedDays > 0,
      );
    }

    if (filters.isCritical) {
      items = items.filter((p) => p.riskLevel === 'critical' || p.riskLevel === 'high');
    }

    if (filters.hasCompensationPending) {
      items = items.filter((p) => (p.compensationAssessedCr || 0) > (p.compensationDisbursedCr || 0));
    }

    return items;
  }

  /**
   * Get single most critical project from database or candidate list
   */
  async getMostCriticalProject(candidates?: ProjectDto[]): Promise<ProjectDto | null> {
    const list = candidates && candidates.length > 0 ? candidates : (await this.projectsService.getAll({ limit: 50 })).items;
    if (list.length === 0) return null;

    // Sort by: critical > high > medium > low, then lowest slaDaysRemaining
    const riskWeight: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
    return [...list].sort((a, b) => {
      const weightA = riskWeight[a.riskLevel?.toLowerCase()] || 0;
      const weightB = riskWeight[b.riskLevel?.toLowerCase()] || 0;
      if (weightB !== weightA) return weightB - weightA;
      return a.slaDaysRemaining - b.slaDaysRemaining;
    })[0];
  }

  /**
   * Get projects with pending compensation
   */
  async getProjectsWithPendingCompensation(): Promise<ProjectDto[]> {
    const res = await this.projectsService.getAll({ limit: 50 });
    return res.items
      .filter((p) => (p.compensationAssessedCr || 0) > (p.compensationDisbursedCr || 0))
      .sort((a, b) => {
        const gapA = (a.compensationAssessedCr || 0) - (a.compensationDisbursedCr || 0);
        const gapB = (b.compensationAssessedCr || 0) - (b.compensationDisbursedCr || 0);
        return gapB - gapA;
      });
  }

  /**
   * Find project by name, code, or identifier
   */
  async findProjectByNameOrCode(query: string): Promise<ProjectDto | null> {
    const clean = query.trim().toLowerCase();
    const res = await this.projectsService.getAll({ limit: 50 });
    const direct = res.items.find(
      (p) =>
        p.id.toLowerCase() === clean ||
        p.projectCode.toLowerCase() === clean ||
        p.name.toLowerCase().includes(clean) ||
        clean.includes(p.projectCode.toLowerCase()),
    );
    if (direct) return direct;

    // Check aliases
    if (clean.includes('nh-48') || clean.includes('nh48') || clean.includes('bharatmala')) {
      return res.items.find((p) => p.id === 'proj-0084' || p.projectCode === 'DOLR-2026-0084') || null;
    }
    if (clean.includes('lucknow')) {
      return res.items.find((p) => p.id === 'proj-0059' || p.projectCode === 'DOLR-2026-0059') || null;
    }
    if (clean.includes('pune') || clean.includes('nashik')) {
      return res.items.find((p) => p.id === 'proj-0066' || p.projectCode === 'DOLR-2026-0066') || null;
    }
    if (clean.includes('bhopal')) {
      return res.items.find((p) => p.id === 'proj-0048' || p.projectCode === 'DOLR-2026-0048') || null;
    }
    if (clean.includes('dfc') || clean.includes('freight')) {
      return res.items.find((p) => p.id === 'proj-0071' || p.projectCode === 'DOLR-2026-0071') || null;
    }

    return null;
  }

  /**
   * Get high-level command dashboard metrics
   */
  async getDashboardMetrics() {
    return await this.analyticsService.getDashboard();
  }

  /**
   * Get decision support insights & rule-based predictions
   */
  getDecisionSupportInsights() {
    return this.analyticsService.getDecisionSupport();
  }

  /**
   * Get Compensation stats & summaries
   */
  async getCompensationSummary() {
    return await this.compensationService.getSummary();
  }

  /**
   * Get workflow priority actions
   */
  async getActionCentre(role?: string) {
    return await this.workflowService.getActionCentre(role);
  }

  /**
   * Get GIS FeatureCollection for projects or parcels
   */
  async getGisParcels(query?: { projectId?: string; state?: string }) {
    return await this.gisService.getParcelsGeoJson(query);
  }

  /**
   * Get documents related to a project or parcel
   */
  async getDocuments(query?: { projectId?: string; parcelId?: string }) {
    return await this.documentsService.getDocuments(query);
  }

  /**
   * Generate official MIS report
   */
  async generateMisReport() {
    return await this.reportsService.getMisReport();
  }
}

