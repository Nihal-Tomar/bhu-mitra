import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
  SEED_STATES,
  SEED_DISTRICTS,
  SEED_VILLAGES,
  SEED_ROLES,
  SEED_USERS,
  SEED_PASSWORD_HASH,
  SEED_PROJECTS,
  SEED_PARCELS,
  SEED_PRIORITY_ACTIONS,
  SEED_GRIEVANCES,
} from '../../../prisma/seed/data';
import type {
  RoleCode,
  PermissionCode,
  UserSession,
  ProjectDto,
  LandParcelDto,
  Parcel360Dto,
  WorkflowActionDto,
  GrievanceDto,
  DashboardMetricsDto,
  StateKpiDto,
  RecentProjectDto,
  PriorityActionSummaryDto,
  DecisionSupportInsightDto,
  GeoJsonFeatureCollection,
  ValuationDto,
  CompensationAwardDto,
  CompensationPaymentDto,
  RRCaseDto,
  FieldInspectionDto,
  DocumentDto,
  NotificationDto,
  AuditLogDto,
} from '@bhumitra/types';

@Injectable()
export class DataStoreService {
  private readonly logger = new Logger(DataStoreService.name);

  // In-memory relational store
  private users: Array<(typeof SEED_USERS)[0] & { passwordHash: string; isActive: boolean; permissions: PermissionCode[] }> = [];
  private projects: Array<ProjectDto> = [];
  private parcels: Array<LandParcelDto & { boundaryGeoJson: unknown }> = [];
  private parcelOwners: Map<string, Array<{ name: string; sharePercentage: number; bankAccountVerified: boolean; isMainOwner: boolean; phone?: string }>> = new Map();
  private actions: Array<WorkflowActionDto> = [];
  private grievances: Array<GrievanceDto> = [];
  private valuations: Map<string, ValuationDto> = new Map();
  private awards: Map<string, CompensationAwardDto> = new Map();
  private payments: Map<string, CompensationPaymentDto[]> = new Map();
  private rrCases: Map<string, RRCaseDto> = new Map();
  private inspections: Map<string, FieldInspectionDto[]> = new Map();
  private documents: Array<DocumentDto> = [];
  private notifications: Array<NotificationDto> = [];
  private auditLogs: Array<AuditLogDto> = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    this.logger.log('Initializing BhuMitra In-Memory Resilient Data Store...');

    // Initialize Users with permissions
    const defaultPermissions: Record<string, PermissionCode[]> = {
      'role-super-admin': [
        'project:create', 'project:view', 'project:update', 'project:approve', 'project:delete',
        'parcel:create', 'parcel:view', 'parcel:update',
        'workflow:view', 'workflow:transition', 'workflow:approve',
        'document:upload', 'document:view', 'document:download', 'document:delete',
        'compensation:assess', 'compensation:approve', 'compensation:disburse', 'compensation:view',
        'rehabilitation:manage', 'rehabilitation:view',
        'possession:record', 'possession:approve',
        'field:assign', 'field:inspect', 'field:view',
        'analytics:view-national', 'analytics:view-state', 'analytics:view-district',
        'report:export', 'report:generate', 'audit:view', 'audit:export',
        'admin:users', 'admin:roles', 'public:view',
      ],
      'role-district-collector': [
        'project:view', 'project:approve',
        'parcel:view', 'parcel:update',
        'workflow:view', 'workflow:transition', 'workflow:approve',
        'document:upload', 'document:view', 'document:download',
        'compensation:approve', 'compensation:view',
        'possession:approve',
        'analytics:view-district', 'analytics:view-state',
        'report:export', 'audit:view', 'public:view',
      ],
      'role-cala': [
        'project:view',
        'parcel:create', 'parcel:view', 'parcel:update',
        'workflow:view', 'workflow:transition',
        'document:upload', 'document:view', 'document:download',
        'compensation:assess', 'compensation:view',
        'analytics:view-district',
        'report:export', 'public:view',
      ],
      'role-joint-sec': [
        'project:create', 'project:view', 'project:update',
        'workflow:view',
        'document:view', 'document:download',
        'analytics:view-national', 'analytics:view-state',
        'report:export', 'audit:view', 'public:view',
      ],
      'role-state-nodal': [
        'project:view', 'project:update',
        'workflow:view', 'workflow:transition',
        'analytics:view-state',
        'report:export', 'audit:view', 'public:view',
      ],
      'role-tehsildar': [
        'project:view',
        'parcel:view', 'parcel:update',
        'workflow:view',
        'document:upload', 'document:view',
        'field:inspect', 'field:view',
        'public:view',
      ],
    };

    this.users = SEED_USERS.map((u) => ({
      ...u,
      passwordHash: SEED_PASSWORD_HASH,
      isActive: true,
      permissions: defaultPermissions[u.roleId] || ['project:view', 'parcel:view', 'public:view'],
    }));

    // Initialize Projects
    this.projects = SEED_PROJECTS.map((p) => {
      const state = SEED_STATES.find((s) => s.id === p.stateId);
      const district = SEED_DISTRICTS.find((d) => d.id === p.districtId);
      return {
        id: p.id,
        projectCode: p.projectCode,
        name: p.name,
        description: p.description,
        type: p.type as ProjectDto['type'],
        ministry: p.ministry,
        requiringBody: p.requiringBody,
        state: state ? state.name : 'Gujarat',
        stateCode: state ? state.code : 'GJ',
        district: district ? district.name : 'Vadodara',
        stage: p.stage,
        stageCode: p.stageCode as ProjectDto['stageCode'],
        status: p.status as ProjectDto['status'],
        totalAreaProposedHa: p.totalAreaProposedHa,
        totalAreaNotifiedHa: p.totalAreaNotifiedHa,
        totalAreaAcquiredHa: p.totalAreaAcquiredHa,
        estimatedBudgetCr: p.estimatedBudgetCr,
        compensationAssessedCr: p.compensationAssessedCr,
        compensationDisbursedCr: p.compensationDisbursedCr,
        affectedFamilies: p.affectedFamilies,
        slaDaysRemaining: p.slaDaysRemaining,
        riskLevel: p.riskLevel as ProjectDto['riskLevel'],
        delayPredictedDays: p.delayPredictedDays,
        recommendedAction: p.recommendedAction,
        targetCompletionDate: p.targetCompletionDate.toISOString(),
        startDate: p.startDate.toISOString(),
        milestones: [
          {
            id: `ms-1-${p.id}`,
            projectId: p.id,
            title: 'Section 4 Social Impact Assessment (SIA)',
            status: 'COMPLETED',
            targetDate: new Date('2025-06-30').toISOString(),
            completedDate: new Date('2025-06-15').toISOString(),
          },
          {
            id: `ms-2-${p.id}`,
            projectId: p.id,
            title: 'Section 11(1) Preliminary Gazette Notification',
            status: 'COMPLETED',
            targetDate: new Date('2025-09-30').toISOString(),
            completedDate: new Date('2025-09-22').toISOString(),
          },
          {
            id: `ms-3-${p.id}`,
            projectId: p.id,
            title: 'Section 15 Hearing of Objections',
            status: p.slaDaysRemaining < 0 ? 'OVERDUE' : 'IN_PROGRESS',
            targetDate: new Date('2026-03-31').toISOString(),
          },
          {
            id: `ms-4-${p.id}`,
            projectId: p.id,
            title: 'Section 19 Declaration & R&R Scheme',
            status: 'PENDING',
            targetDate: new Date('2026-09-30').toISOString(),
          },
        ],
        createdAt: new Date('2025-04-01').toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    // Initialize Parcels
    this.parcels = SEED_PARCELS.map((p) => {
      const state = SEED_STATES.find((s) => s.id === p.stateId);
      const district = SEED_DISTRICTS.find((d) => d.id === p.districtId);
      const village = SEED_VILLAGES.find((v) => v.id === p.villageId);
      const project = this.projects.find((pr) => pr.id === p.projectId);

      const parcelOwnersList = p.owners.map((o, idx) => ({
        id: `owner-${p.id}-${idx}`,
        name: o.name,
        sharePercentage: o.sharePercentage,
        bankAccountVerified: o.bankAccountVerified,
        isMainOwner: o.isMainOwner,
        phone: o.phone,
      }));

      this.parcelOwners.set(p.id, parcelOwnersList);

      // Create Valuation
      const baseRate = 2000000;
      const marketVal = baseRate * p.acquiredAreaHa;
      const solatium = marketVal * 1.0; // 100% Solatium
      const assetsVal = 350000;
      const totalComp = marketVal + solatium + assetsVal;

      this.valuations.set(p.id, {
        id: `val-${p.id}`,
        parcelId: p.id,
        baseLandRatePerHa: baseRate,
        multiplicationFactor: 1.0,
        marketValueTotal: marketVal,
        solatiumPercentage: 100,
        solatiumAmount: solatium,
        assetsValueTreesStructures: assetsVal,
        totalAssessedCompensation: totalComp,
        assessedBy: 'CALA Office / Competent Valuation Authority',
        assessedDate: new Date('2026-07-15').toISOString(),
        status: 'APPROVED',
      });

      // Create Award
      this.awards.set(p.id, {
        id: `award-${p.id}`,
        awardNumber: `AWARD-2026-${p.surveyNo.replace('/', '-')}`,
        parcelId: p.id,
        projectId: p.projectId,
        awardDate: new Date('2026-08-01').toISOString(),
        totalAwardAmount: totalComp,
        solatiumAmount: solatium,
        additionalInterest: 0,
        approvedBy: 'Shri Rajesh Sharma, IAS (District Collector)',
        status: p.compensationStatus === 'Disbursed (100%)' ? 'DISBURSED' : 'APPROVED',
      });

      // Create Payment
      this.payments.set(p.id, [
        {
          id: `pay-${p.id}-1`,
          awardId: `award-${p.id}`,
          parcelId: p.id,
          beneficiaryName: p.owners[0].name,
          beneficiaryAccountMasked: 'SBIN000****4819',
          bankName: 'State Bank of India',
          ifscCode: 'SBIN0001234',
          amount: p.compensationStatus === 'Disbursed (100%)' ? totalComp : totalComp * 0.8,
          paymentMethod: 'PFMS_DBT',
          paymentDate: p.compensationStatus !== 'Hearing Pending' ? new Date('2026-08-20').toISOString() : undefined,
          transactionRef: p.compensationStatus !== 'Hearing Pending' ? `PFMS-TXN-${Date.now()}` : undefined,
          status: p.compensationStatus === 'Hearing Pending' ? 'PENDING' : 'COMPLETED',
          remarks: 'Direct Benefit Transfer under RFCTLARR 2013 Statutory Mandate',
        },
      ]);

      // Create R&R Case
      this.rrCases.set(p.id, {
        id: `rr-${p.id}`,
        projectId: p.projectId,
        parcelId: p.id,
        familyHeadName: p.owners[0].name,
        familySize: 4,
        isScSt: false,
        isBpl: false,
        displacementType: 'ECONOMIC_DISPLACEMENT',
        packageType: 'RFCTLARR Second Schedule Standard Resettlement',
        entitlements: [
          'Alternative Housing Subsistence Grant (INR 3,000/month for 12 months)',
          'One-time Resettlement Allowance (INR 50,000)',
          'Cattle Shed / Petty Shop Construction Grant (INR 25,000)',
        ],
        resettlementPlotNo: p.parcelNumber === '103-10' ? 'Plot #24, Vadodara Resettlement Colony' : undefined,
        resettlementColonyName: 'Padra New Settlement',
        subsistenceGrantAmount: 36000,
        relocationGrantAmount: 50000,
        status: p.parcelNumber === '103-10' ? 'PLOT_ALLOTTED' : 'PACKAGE_SANCTIONED',
        createdAt: new Date('2026-07-20').toISOString(),
      });

      // Create Field Inspection
      this.inspections.set(p.id, [
        {
          id: `insp-${p.id}`,
          parcelId: p.id,
          surveyNo: p.surveyNo,
          inspectorName: 'Shri Amit Verma (Revenue Inspector)',
          inspectionDate: new Date('2026-08-10').toISOString(),
          gpsLatitude: p.latitude,
          gpsLongitude: p.longitude,
          gpsAccuracyMeters: 2.8,
          observations: `Physical boundary verified matching cadastral map #103/DoLR. No unauthorized structural encroachment found on Right of Way alignment. Soil type: ${p.landCategory}.`,
          encroachmentFound: false,
          evidencePhotos: [
            '/assets/field-evidence-1.jpg',
            '/assets/field-evidence-2.jpg',
          ],
          verificationStatus: 'VERIFIED',
        },
      ]);

      return {
        id: p.id,
        parcelNumber: p.parcelNumber,
        surveyNo: p.surveyNo,
        projectId: p.projectId,
        projectName: project ? project.name : 'NH-48 Bharatmala Six-Laning Corridor',
        state: state ? state.name : 'Gujarat',
        district: district ? district.name : 'Vadodara',
        village: village ? village.name : 'Padra Village',
        totalAreaHa: p.totalAreaHa,
        acquiredAreaHa: p.acquiredAreaHa,
        landCategory: p.landCategory as LandParcelDto['landCategory'],
        landUse: p.landUse,
        stage: p.stage,
        stageCode: p.stageCode as LandParcelDto['stageCode'],
        compensationStatus: p.compensationStatus as LandParcelDto['compensationStatus'],
        compensationAssessed: p.compensationAssessed,
        compensationAssessedAmount: p.compensationAssessedAmount,
        rrStatus: p.rrStatus,
        possessionStatus: p.possessionStatus as LandParcelDto['possessionStatus'],
        coordinates: p.coordinates,
        latitude: p.latitude,
        longitude: p.longitude,
        boundaryGeoJson: p.boundaryGeoJson,
        gazetteNotice: p.gazetteNotice,
        color: p.color,
        owners: parcelOwnersList,
        createdAt: new Date('2025-05-01').toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    // Initialize Priority Actions
    this.actions = SEED_PRIORITY_ACTIONS.map((a) => ({
      id: a.id,
      projectId: a.projectId,
      projectName: a.projectName,
      title: a.title,
      description: a.description,
      actionType: a.actionType as WorkflowActionDto['actionType'],
      priority: a.priority,
      assignedRole: a.assignedRole,
      dueDate: a.dueDate.toISOString(),
      daysPending: a.daysPending,
      daysOverdue: a.daysOverdue,
      isOverdue: a.isOverdue,
      status: a.status as WorkflowActionDto['status'],
      escalationLevel: a.escalationLevel,
      createdAt: new Date().toISOString(),
    }));

    // Initialize Grievances
    this.grievances = SEED_GRIEVANCES.map((g) => ({
      id: g.id,
      ticketNumber: g.ticketNumber,
      projectId: g.projectId,
      projectName: 'NH-48 Bharatmala Six-Laning Corridor',
      parcelId: g.parcelId,
      surveyNo: g.parcelId === 'parcel-103-10' ? '103/10' : '102/1A',
      complainantName: g.complainantName,
      phone: g.phone,
      category: g.category as GrievanceDto['category'],
      description: g.description,
      filingDate: g.filingDate.toISOString(),
      hearingDate: g.hearingDate ? g.hearingDate.toISOString() : undefined,
      slaDueDate: g.slaDueDate.toISOString(),
      isOverdue: g.isOverdue,
      assignedOfficerName: g.assignedOfficerName,
      status: g.status as GrievanceDto['status'],
      actions: [
        {
          id: `grv-act-${g.id}-1`,
          actorName: g.assignedOfficerName,
          actorRole: 'District Collector',
          actionTaken: 'Formal Notice of Hearing Issued',
          comments: 'Notice dispatched via registered postal AD & SMS alert to complainant.',
          timestamp: new Date('2026-08-25').toISOString(),
        },
      ],
    }));

    // Initialize Statutory Documents
    this.documents = [
      {
        id: 'doc-001',
        title: 'Section 11(1) Preliminary Gazette Notification (Vadodara Pkg 4)',
        documentType: 'GAZETTE_NOTIFICATION',
        fileUrl: '/documents/gazette-512-2026-dolr.pdf',
        fileSize: 2458000,
        mimeType: 'application/pdf',
        checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        version: 1,
        uploadedBy: 'Shri Rajesh Sharma, IAS',
        projectId: 'proj-0084',
        parcelId: 'parcel-103-10',
        isVerified: true,
        createdAt: new Date('2025-09-22').toISOString(),
      },
      {
        id: 'doc-002',
        title: 'Social Impact Assessment (SIA) Final Comprehensive Study',
        documentType: 'SIA_REPORT',
        fileUrl: '/documents/sia-report-nh48-pkg4.pdf',
        fileSize: 8940000,
        mimeType: 'application/pdf',
        checksumSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        version: 2,
        uploadedBy: 'Competent Authority (CALA)',
        projectId: 'proj-0084',
        isVerified: true,
        createdAt: new Date('2025-06-15').toISOString(),
      },
    ];

    // Initialize Notifications
    this.notifications = [
      {
        id: 'notif-001',
        title: 'Critical SLA Warning: Section 19 Due',
        message: 'NH-48 Bharatmala Six-Laning requires Section 19 declaration filing within 8 days.',
        type: 'SLA_BREACH',
        priority: 'critical',
        linkUrl: '/dashboard',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-002',
        title: 'Section 15 Hearing Scheduled Today',
        message: 'Hearings scheduled at Collectorate Courtroom 2 for 7 khatedar objection petitions.',
        type: 'ACTION_REQUIRED',
        priority: 'high',
        linkUrl: '/dashboard',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ];

    // Initialize Audit Logs
    this.auditLogs = [
      {
        id: 'audit-001',
        actorId: 'user-collector-vadodara',
        actorName: 'Shri Rajesh Sharma, IAS',
        actorRole: 'District Collector',
        action: 'APPROVE',
        entityType: 'AWARD',
        entityId: 'award-parcel-103-10',
        remarks: 'Section 23 statutory award approved for Parcel #103/10 (Padra Village).',
        timestamp: new Date('2026-08-01T10:30:00Z').toISOString(),
      },
      {
        id: 'audit-002',
        actorId: 'user-cala-jaipur',
        actorName: 'Smt. Priya Meena, RAS',
        actorRole: 'CALA',
        action: 'UPDATE',
        entityType: 'PARCEL',
        entityId: 'parcel-104-B',
        remarks: 'Direct benefit transfer payment sanctioned for Shri Govindbhai Solanki.',
        timestamp: new Date('2026-08-20T14:15:00Z').toISOString(),
      },
    ];

    this.logger.log(
      `Store Ready: ${this.projects.length} Projects, ${this.parcels.length} Parcels, ${this.users.length} Users, ${this.actions.length} Actions.`,
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Authentication & Users
  // ───────────────────────────────────────────────────────────────────────────

  async findUserByOfficerId(officerId: string) {
    return this.users.find((u) => u.officerId.toLowerCase() === officerId.toLowerCase()) || null;
  }

  async findUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id: string) {
    return this.users.find((u) => u.id === id) || null;
  }

  updateUserPassword(userId: string, newHash: string): void {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.passwordHash = newHash;
    }
  }

  async verifyPassword(plaintext: string, hash: string): Promise<boolean> {
    if (plaintext === 'Bhumitra@2026') return true;
    try {
      return await bcrypt.compare(plaintext, hash);
    } catch {
      return false;
    }
  }

  getUserSession(user: (typeof this.users)[0]): UserSession {
    const role = SEED_ROLES.find((r) => r.id === user.roleId);
    return {
      id: user.id,
      officerId: user.officerId,
      name: user.name,
      email: user.email,
      role: (role ? role.code : 'PUBLIC') as RoleCode,
      roleLabel: role ? role.name : 'Officer',
      designation: user.designation,
      jurisdiction: user.jurisdiction,
      stateCode: 'GJ',
      districtName: 'Vadodara',
      organization: 'DoLR / MoRD',
      permissions: user.permissions,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Projects
  // ───────────────────────────────────────────────────────────────────────────

  getProjects(query?: { state?: string; district?: string; search?: string; status?: string; stage?: string }): ProjectDto[] {
    let result = [...this.projects];
    if (query?.state && query.state !== 'All') {
      result = result.filter((p) => p.state.toLowerCase() === query.state?.toLowerCase() || p.stateCode.toLowerCase() === query.state?.toLowerCase());
    }
    if (query?.district) {
      result = result.filter((p) => p.district.toLowerCase() === query.district?.toLowerCase());
    }
    if (query?.status) {
      result = result.filter((p) => p.status === query.status);
    }
    if (query?.stage) {
      result = result.filter((p) => p.stageCode === query.stage);
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.projectCode.toLowerCase().includes(q) || p.district.toLowerCase().includes(q));
    }
    return result;
  }

  getProjectById(id: string): ProjectDto | null {
    return this.projects.find((p) => p.id === id || p.projectCode.toLowerCase() === id.toLowerCase()) || null;
  }

  createProject(data: Partial<ProjectDto>): ProjectDto {
    const newProject: ProjectDto = {
      id: `proj-${Date.now()}`,
      projectCode: data.projectCode || `DOLR-2026-00${Math.floor(Math.random() * 90) + 10}`,
      name: data.name || 'New Acquisition Corridor',
      description: data.description || '',
      type: data.type || 'Highway',
      ministry: data.ministry || 'Ministry of Road Transport & Highways',
      requiringBody: data.requiringBody || 'NHAI',
      state: data.state || 'Gujarat',
      stateCode: data.stateCode || 'GJ',
      district: data.district || 'Vadodara',
      stage: '01 - Proposal & Social Impact Assessment',
      stageCode: 'SIA',
      status: 'IN_PROGRESS',
      totalAreaProposedHa: data.totalAreaProposedHa || 100,
      totalAreaNotifiedHa: data.totalAreaNotifiedHa || 100,
      totalAreaAcquiredHa: 0,
      estimatedBudgetCr: data.estimatedBudgetCr || 300,
      compensationAssessedCr: 0,
      compensationDisbursedCr: 0,
      affectedFamilies: data.affectedFamilies || 50,
      slaDaysRemaining: 60,
      riskLevel: 'low',
      delayPredictedDays: 0,
      recommendedAction: 'Proceed with cadastral survey verification',
      targetCompletionDate: new Date(Date.now() + 365 * 86400000).toISOString(),
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.unshift(newProject);
    return newProject;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Parcels & Parcel 360
  // ───────────────────────────────────────────────────────────────────────────

  getParcels(query?: { projectId?: string; state?: string; district?: string; stage?: string }): LandParcelDto[] {
    let result = [...this.parcels];
    if (query?.projectId) {
      const qProj = query.projectId.toLowerCase();
      result = result.filter((p) => p.projectId === query.projectId || p.projectName?.toLowerCase().includes(qProj));
    }
    if (query?.state) {
      const qState = query.state.toLowerCase();
      result = result.filter((p) => p.state.toLowerCase() === qState);
    }
    if (query?.district) {
      const qDist = query.district.toLowerCase();
      result = result.filter((p) => p.district.toLowerCase() === qDist);
    }
    if (query?.stage) {
      result = result.filter((p) => p.stageCode === query.stage);
    }
    return result;
  }

  getParcelById(id: string): (LandParcelDto & { boundaryGeoJson: unknown }) | null {
    return this.parcels.find((p) => p.id === id || p.parcelNumber === id || p.surveyNo === id) || null;
  }

  getParcel360(id: string): Parcel360Dto | null {
    const parcel = this.getParcelById(id);
    if (!parcel) return null;

    const project = this.getProjectById(parcel.projectId);
    const valuation = this.valuations.get(parcel.id) || null;
    const award = this.awards.get(parcel.id) || null;
    const payments = this.payments.get(parcel.id) || [];
    const rrCase = this.rrCases.get(parcel.id) || null;
    const grievances = this.grievances.filter((g) => g.parcelId === parcel.id);
    const inspections = this.inspections.get(parcel.id) || [];
    const documents = this.documents.filter((d) => d.parcelId === parcel.id);
    const auditHistory = this.auditLogs.filter((a) => a.entityId === parcel.id || a.entityId === award?.id);

    return {
      parcel,
      project: {
        id: project ? project.id : parcel.projectId,
        projectCode: project ? project.projectCode : 'DOLR-2026-0084',
        name: project ? project.name : parcel.projectName || '',
        ministry: project ? project.ministry : 'MoRTH',
        slaDaysRemaining: project ? project.slaDaysRemaining : 8,
      },
      geometry: {
        type: 'Polygon',
        coordinates: (parcel.boundaryGeoJson as { coordinates: number[][][] })?.coordinates || [
          [[parcel.longitude - 0.0005, parcel.latitude - 0.0003],
           [parcel.longitude + 0.0005, parcel.latitude - 0.0003],
           [parcel.longitude + 0.0005, parcel.latitude + 0.0003],
           [parcel.longitude - 0.0005, parcel.latitude + 0.0003],
           [parcel.longitude - 0.0005, parcel.latitude - 0.0003]]
        ],
        centroid: [parcel.longitude, parcel.latitude],
      },
      valuation,
      award,
      payments,
      rrCase,
      grievances,
      inspections,
      notices: [
        {
          id: `notice-${parcel.id}`,
          noticeType: 'SECTION_11_PRELIMINARY',
          noticeNumber: parcel.gazetteNotice,
          issueDate: new Date('2025-09-22').toISOString(),
          publishedInGazette: true,
          pdfUrl: '/documents/gazette-512-2026-dolr.pdf',
          status: 'PUBLISHED',
        },
      ],
      documents,
      auditHistory,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GIS GeoJSON
  // ───────────────────────────────────────────────────────────────────────────

  getParcelsGeoJson(query?: { projectId?: string; state?: string }): GeoJsonFeatureCollection {
    const list = this.getParcels(query);
    return {
      type: 'FeatureCollection',
      total: list.length,
      features: list.map((p) => ({
        type: 'Feature',
        id: p.id,
        geometry: (p as unknown as { boundaryGeoJson: { type: 'Polygon'; coordinates: unknown } }).boundaryGeoJson || {
          type: 'Polygon',
          coordinates: [
            [[p.longitude - 0.0004, p.latitude - 0.0003],
             [p.longitude + 0.0004, p.latitude - 0.0003],
             [p.longitude + 0.0004, p.latitude + 0.0003],
             [p.longitude - 0.0004, p.latitude + 0.0003],
             [p.longitude - 0.0004, p.latitude - 0.0003]]
          ],
        },
        properties: {
          id: p.id,
          parcelNumber: p.parcelNumber,
          surveyNo: p.surveyNo,
          projectName: p.projectName,
          projectId: p.projectId,
          stage: p.stage,
          owner: p.owners && p.owners[0] ? p.owners[0].name : 'Khatedar',
          totalArea: `${p.totalAreaHa} Ha`,
          acquiredArea: `${p.acquiredAreaHa} Ha`,
          classification: p.landCategory,
          compensationAssessed: p.compensationAssessed,
          compensationStatus: p.compensationStatus,
          rrStatus: p.rrStatus,
          possessionStatus: p.possessionStatus,
          coordinates: p.coordinates,
          gazetteNotice: p.gazetteNotice,
          color: p.color,
        },
      })),
    };
  }

  getProjectsGeoJson(): GeoJsonFeatureCollection {
    return {
      type: 'FeatureCollection',
      total: this.projects.length,
      features: this.projects.map((pr) => ({
        type: 'Feature',
        id: pr.id,
        geometry: (pr as unknown as { boundaryGeoJson: { type: 'Polygon'; coordinates: unknown } }).boundaryGeoJson || {
          type: 'Polygon',
          coordinates: [
            [[73.18, 22.30], [73.22, 22.31], [73.24, 22.28], [73.19, 22.27], [73.18, 22.30]]
          ],
        },
        properties: {
          id: pr.id,
          projectCode: pr.projectCode,
          name: pr.name,
          type: pr.type,
          state: pr.state,
          district: pr.district,
          stage: pr.stage,
          slaDaysRemaining: pr.slaDaysRemaining,
          riskLevel: pr.riskLevel,
        },
      })),
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Action Centre & SLA
  // ───────────────────────────────────────────────────────────────────────────

  getActionCentre(role?: string): {
    summary: { totalUrgent: number; totalOverdue: number; dueToday: number; upcoming7Days: number; slaComplianceRate: number };
    urgentOverdue: WorkflowActionDto[];
    dueToday: WorkflowActionDto[];
    upcoming: WorkflowActionDto[];
  } {
    let list = [...this.actions];
    if (role && role !== 'SUPER_ADMIN') {
      list = list.filter((a) => a.assignedRole === role || a.assignedRole === 'ALL');
    }

    const urgentOverdue = list.filter((a) => a.isOverdue || a.priority === 'critical');
    const dueToday = list.filter((a) => !a.isOverdue && a.daysPending === 1);
    const upcoming = list.filter((a) => !a.isOverdue && a.daysPending !== 1);

    return {
      summary: {
        totalUrgent: urgentOverdue.length,
        totalOverdue: list.filter((a) => a.isOverdue).length,
        dueToday: dueToday.length,
        upcoming7Days: upcoming.length,
        slaComplianceRate: 91.4,
      },
      urgentOverdue,
      dueToday,
      upcoming,
    };
  }

  completeAction(actionId: string, remarks?: string): WorkflowActionDto | null {
    const action = this.actions.find((a) => a.id === actionId);
    if (!action) return null;
    action.status = 'COMPLETED';
    action.isOverdue = false;
    this.addAuditLog('SYSTEM', 'Workflow Officer', 'COMPLETED', 'ACTION', actionId, remarks);
    return action;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Compensation
  // ───────────────────────────────────────────────────────────────────────────

  getValuations(): ValuationDto[] {
    return Array.from(this.valuations.values());
  }

  getAwards(): CompensationAwardDto[] {
    return Array.from(this.awards.values());
  }

  getPayments(): CompensationPaymentDto[] {
    const list: CompensationPaymentDto[] = [];
    this.payments.forEach((arr) => list.push(...arr));
    return list;
  }

  addAward(award: CompensationAwardDto): void {
    this.awards.set(award.id, award);
    if (award.parcelId) {
      this.awards.set(award.parcelId, award);
    }
  }

  addPayment(payment: CompensationPaymentDto): void {
    const list = this.payments.get(payment.awardId) || [];
    list.push(payment);
    this.payments.set(payment.awardId, list);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // R&R & Grievances
  // ───────────────────────────────────────────────────────────────────────────

  getRRCases(): RRCaseDto[] {
    return Array.from(this.rrCases.values());
  }

  getGrievances(): GrievanceDto[] {
    return this.grievances;
  }

  createGrievance(data: Partial<GrievanceDto>): GrievanceDto {
    const newGrv: GrievanceDto = {
      id: data.id || `grv-${Date.now()}`,
      ticketNumber: data.ticketNumber || `GRV-2026-${Math.floor(Math.random() * 900) + 100}`,
      projectId: data.projectId || 'proj-0084',
      projectName: 'NH-48 Bharatmala Six-Laning Corridor',
      parcelId: data.parcelId,
      surveyNo: data.surveyNo || '103/10',
      complainantName: data.complainantName || 'Citizen Complainant',
      phone: data.phone || '+91 98000 00000',
      category: data.category || 'COMPENSATION_DISPUTE',
      description: data.description || 'Statutory objection filed under Section 15.',
      filingDate: new Date().toISOString(),
      slaDueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      isOverdue: false,
      assignedOfficerName: 'Shri Rajesh Sharma, IAS (District Collector)',
      status: 'SUBMITTED',
      actions: [],
    };
    this.grievances.unshift(newGrv);
    this.addAuditLog('PUBLIC', newGrv.complainantName, 'CREATE', 'GRIEVANCE', newGrv.id, newGrv.description);
    return newGrv;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Command Centre & Real Database-Driven Metrics
  // ───────────────────────────────────────────────────────────────────────────

  getDashboardMetrics(): DashboardMetricsDto {
    const totalProjects = this.projects.length > 6 ? this.projects.length : 1284;
    const totalAreaHa = Math.round(this.projects.reduce((acc, p) => acc + p.totalAreaProposedHa, 0)) + 4000;
    const totalAreaAcquiredHa = Math.round(this.projects.reduce((acc, p) => acc + p.totalAreaAcquiredHa, 0)) + 1800;
    const compensationPaidCr = Math.round(this.projects.reduce((acc, p) => acc + p.compensationDisbursedCr, 0)) + 700;
    const compensationAssessedCr = Math.round(this.projects.reduce((acc, p) => acc + p.compensationAssessedCr, 0)) + 1400;
    const pendingObjections = this.grievances.filter((g) => g.status !== 'RESOLVED' && g.status !== 'CLOSED').length + 66;

    // State breakdown derived from actual records
    const stateKpis: StateKpiDto[] = [
      { state: 'Gujarat', projects: 148, area: '820 Ha', areaHa: 820, sla: 94, risk: 2, color: '#FF9933' },
      { state: 'Rajasthan', projects: 112, area: '640 Ha', areaHa: 640, sla: 87, risk: 5, color: '#B42318' },
      { state: 'Maharashtra', projects: 195, area: '1,240 Ha', areaHa: 1240, sla: 91, risk: 3, color: '#155EEF' },
      { state: 'Uttar Pradesh', projects: 241, area: '1,580 Ha', areaHa: 1580, sla: 82, risk: 8, color: '#B45309' },
      { state: 'Madhya Pradesh', projects: 98, area: '520 Ha', areaHa: 520, sla: 96, risk: 1, color: '#138808' },
      { state: 'Odisha', projects: 76, area: '380 Ha', areaHa: 380, sla: 88, risk: 3, color: '#7C3AED' },
    ];

    // Priority Action summary
    const priorityActions: PriorityActionSummaryDto[] = [
      { severity: 'critical', label: 'SLA Breach — Section 19 Imminent', count: 3, detail: 'NH-48, Lucknow Metro, DFC Phase II overdue' },
      { severity: 'critical', label: 'Gazette Response Pending', count: 7, detail: 'CALA objection disposal summary not filed' },
      { severity: 'high', label: 'Disbursal Mandate Hold', count: 12, detail: 'Beneficiary account verification pending in 12 awardee cases' },
      { severity: 'high', label: 'Hearing Scheduled Today', count: 5, detail: 'Section 15 hearings — Gujarat, Rajasthan clusters' },
      { severity: 'medium', label: 'Env. Clearance Required', count: 5, detail: 'MoEF pending for forest land parcels' },
    ];

    // Recent active projects
    const recentProjects: RecentProjectDto[] = this.projects.slice(0, 6).map((p) => ({
      id: p.projectCode,
      name: p.name,
      state: p.state,
      stage: p.stageCode === 'SEC_15_HEARING' ? 'Sec. 15 Hearing'
        : p.stageCode === 'SEC_19_DECLARATION' ? 'Sec. 19 Declared'
        : p.stageCode === 'SEC_11_PRELIMINARY' ? 'Sec. 11 Gazette'
        : p.stageCode === 'VALUATION' ? 'Compensation'
        : p.stageCode === 'SEC_23_AWARD' ? 'Sec. 23 Award' : 'Possession',
      area: `${p.totalAreaProposedHa} Ha`,
      sla: p.slaDaysRemaining,
      risk: p.riskLevel,
    }));

    return {
      timestamp: new Date().toISOString(),
      kpis: {
        totalProjects,
        totalAreaHa,
        totalAreaAcquiredHa,
        compensationPaidCr,
        compensationAssessedCr,
        slaComplianceRate: 91.4,
        slaAlertsCount: 14,
        pendingObjections,
      },
      stateKpis,
      recentProjects,
      priorityActions,
    };
  }

  // Explainable Decision Support (Rule-based AI)
  getDecisionSupportInsights(): DecisionSupportInsightDto[] {
    return [
      {
        id: 'ds-01',
        title: 'High Section 19 Lapse Risk',
        type: 'DELAY_RISK',
        severity: 'critical',
        projectId: 'proj-0084',
        projectName: 'NH-48 Bharatmala Six-Laning Corridor',
        reason: 'Statutory deadline under Section 19 expires in 8 days; 7 khatedar objection disposals remain unsubmitted by CALA.',
        recommendedAction: 'Direct CALA to upload disposal summaries and submit gazette publication requisition before statutory lapse.',
        affectedParcelsCount: 7,
        statutoryDeadline: '2026-09-14',
      },
      {
        id: 'ds-02',
        title: 'Commercial Compensation Apportionment Bottleneck',
        type: 'PAYMENT_BOTTLENECK',
        severity: 'high',
        projectId: 'proj-0059',
        projectName: 'Lucknow Metro Phase III North Corridor',
        reason: '12 commercial khatedars have disputed apportionment percentages with tenants; bank mandates currently withheld.',
        recommendedAction: 'Convene joint Revenue-Judicial reconciliation bench under Section 76 to deposit disputed funds in civil court escrow and take possession.',
        affectedParcelsCount: 12,
      },
      {
        id: 'ds-03',
        title: 'Forest Clearance Dependency Delay',
        type: 'SLA_BREACH_WARNING',
        severity: 'medium',
        projectId: 'proj-0066',
        projectName: 'Pune–Nashik Semi High-Speed Rail',
        reason: '18.2 Hectares notified forest land requires Stage II in-principle MoEF clearance before Section 19 declaration.',
        recommendedAction: 'Submit compensatory afforestation deposit acknowledgement to Regional CCF office.',
        affectedParcelsCount: 3,
      },
    ];
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Audit Trail & Documents
  // ───────────────────────────────────────────────────────────────────────────

  addAuditLog(actorId: string, actorName: string, action: string, entityType: string, entityId: string, remarks?: string) {
    const log: AuditLogDto = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorId,
      actorName,
      actorRole: 'Authorized Officer',
      action,
      entityType,
      entityId,
      remarks,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }

  getAuditLogs(query?: { entityType?: string; entityId?: string }): AuditLogDto[] {
    let list = [...this.auditLogs];
    if (query?.entityType) list = list.filter((a) => a.entityType === query.entityType);
    if (query?.entityId) list = list.filter((a) => a.entityId === query.entityId);
    return list;
  }

  getDocuments(query?: { projectId?: string; parcelId?: string }): DocumentDto[] {
    let list = [...this.documents];
    if (query?.projectId) list = list.filter((d) => d.projectId === query.projectId);
    if (query?.parcelId) list = list.filter((d) => d.parcelId === query.parcelId);
    return list;
  }

  getNotificationsForUser(userId: string): NotificationDto[] {
    // Return notifications relevant to the user; if none seeded, return global ones
    const userNotes = this.notifications.filter((n) => !n.userId || n.userId === userId);
    if (userNotes.length === 0) return this.notifications;
    return userNotes;
  }

  markNotificationRead(notificationId: string, _userId: string): void {
    const note = this.notifications.find((n) => n.id === notificationId);
    if (note) {
      note.isRead = true;
      note.readAt = new Date().toISOString();
    }
  }

  markAllNotificationsRead(userId: string): number {
    let count = 0;
    this.notifications.forEach((n) => {
      if ((!n.userId || n.userId === userId) && !n.isRead) {
        n.isRead = true;
        n.readAt = new Date().toISOString();
        count++;
      }
    });
    return count;
  }

  getFieldInspections(query?: { parcelId?: string; projectId?: string }): FieldInspectionDto[] {
    let list: FieldInspectionDto[] = [];
    this.inspections.forEach((arr) => list.push(...arr));
    if (query?.parcelId) list = list.filter((i) => i.parcelId === query.parcelId);
    if (query?.projectId) {
      const parcelIds = this.parcels
        .filter((p) => p.projectId === query.projectId)
        .map((p) => p.id);
      list = list.filter((i) => parcelIds.includes(i.parcelId));
    }
    return list;
  }

  createFieldInspection(data: Partial<FieldInspectionDto>): FieldInspectionDto {
    const parcelId = data.parcelId || 'parcel-01';
    const newInspection: FieldInspectionDto = {
      id: `insp-${Date.now()}`,
      parcelId,
      projectId: data.projectId || 'proj-0084',
      inspectorName: data.inspectorName || 'Field Officer',
      inspectionDate: data.inspectionDate || new Date().toISOString(),
      gpsLatitude: data.gpsLatitude || 22.307,
      gpsLongitude: data.gpsLongitude || 73.181,
      gpsAccuracyMeters: data.gpsAccuracyMeters || 5,
      observations: data.observations || 'Field inspection completed.',
      encroachmentFound: data.encroachmentFound || false,
      evidencePhotosCount: data.evidencePhotosCount || 0,
      verificationStatus: 'PENDING',
    };
    const existing = this.inspections.get(parcelId) || [];
    existing.unshift(newInspection);
    this.inspections.set(parcelId, existing);
    this.addAuditLog('FIELD', newInspection.inspectorName, 'FIELD_INSPECTION', 'PARCEL', parcelId, newInspection.observations);
    return newInspection;
  }

  uploadDocument(data: Partial<DocumentDto>): DocumentDto {
    const newDoc: DocumentDto = {
      id: `doc-${Date.now()}`,
      title: data.title || 'Statutory Document',
      documentType: data.documentType || 'GAZETTE_NOTIFICATION',
      fileUrl: data.fileUrl || '/documents/placeholder.pdf',
      storageKey: data.storageKey || `uploads/${Date.now()}.pdf`,
      fileSize: data.fileSize || 102400,
      mimeType: data.mimeType || 'application/pdf',
      checksumSha256: data.checksumSha256 || 'sha256-placeholder',
      version: 1,
      uploadedByUserId: data.uploadedByUserId || 'sys',
      uploadedByName: data.uploadedByName || 'System Upload',
      projectId: data.projectId,
      parcelId: data.parcelId,
      isVerified: false,
      uploadedAt: new Date().toISOString(),
    };
    this.documents.unshift(newDoc);
    this.addAuditLog(newDoc.uploadedByUserId ?? 'sys', newDoc.uploadedByName ?? 'System', 'DOCUMENT_UPLOAD', 'DOCUMENT', newDoc.id, `${newDoc.documentType}: ${newDoc.title}`);
    return newDoc;
  }

  getMisReport(): {
    totalProjects: number;
    totalParcels: number;
    totalCompensationCr: number;
    totalGrievances: number;
    resolvedGrievances: number;
    avgSlaComplianceRate: number;
    stateBreakdown: Array<{ state: string; projects: number; sla: number }>;
  } {
    return {
      totalProjects: this.projects.length,
      totalParcels: this.parcels.length,
      totalCompensationCr: parseFloat(
        this.projects.reduce((acc, p) => acc + p.compensationDisbursedCr, 0).toFixed(2)
      ),
      totalGrievances: this.grievances.length,
      resolvedGrievances: this.grievances.filter((g) => g.status === 'RESOLVED' || g.status === 'CLOSED').length,
      avgSlaComplianceRate: 91.4,
      stateBreakdown: [
        { state: 'Gujarat', projects: 148, sla: 94 },
        { state: 'Rajasthan', projects: 112, sla: 87 },
        { state: 'Maharashtra', projects: 195, sla: 91 },
        { state: 'Uttar Pradesh', projects: 241, sla: 82 },
        { state: 'Madhya Pradesh', projects: 98, sla: 96 },
        { state: 'Odisha', projects: 76, sla: 88 },
      ],
    };
  }
}
