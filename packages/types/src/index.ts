/**
 * @bhumitra/types — Shared Type Definitions
 * National Land Acquisition Intelligence & Management Platform
 * Department of Land Resources (DoLR), Ministry of Rural Development
 * Smart India Hackathon 2026 — Problem Statement 26016
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. API Response Envelope & Common Utilities
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data: T;
  meta?: ApiMeta;
  error?: never;
}

export interface ApiErrorResponse {
  success: false;
  data?: never;
  error: ApiError;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  timestamp?: string;
  [key: string]: unknown;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface ServiceHealth {
  status: HealthStatus;
  latencyMs?: number;
  message?: string;
}

export interface HealthCheckResponse {
  status: HealthStatus;
  timestamp: string;
  version: string;
  services: {
    database?: ServiceHealth;
    redis?: ServiceHealth;
    storage?: ServiceHealth;
    [key: string]: ServiceHealth | undefined;
  };
}

export const DEMO_MODE_LABEL = 'DEMONSTRATION DATA — NOT REAL GOVERNMENT DATA' as const;

// ─────────────────────────────────────────────────────────────────────────────
// 2. Identity & Access Control (RBAC)
// ─────────────────────────────────────────────────────────────────────────────

export type RoleCode =
  | 'SUPER_ADMIN'
  | 'CENTRAL_MINISTRY_ADMIN'
  | 'CENTRAL_MINISTRY_VIEWER'
  | 'STATE_NODAL_OFFICER'
  | 'DISTRICT_COLLECTOR'
  | 'LAND_ACQUISITION_OFFICER'
  | 'CALA'
  | 'REQUIRING_BODY_OFFICER'
  | 'COMPENSATION_OFFICER'
  | 'RR_OFFICER'
  | 'FIELD_OFFICER'
  | 'TEHSILDAR'
  | 'AUDITOR'
  | 'EXECUTIVE_VIEWER'
  | 'PUBLIC';

export type PermissionCode =
  | 'project:create'
  | 'project:view'
  | 'project:update'
  | 'project:approve'
  | 'project:delete'
  | 'parcel:create'
  | 'parcel:view'
  | 'parcel:update'
  | 'workflow:view'
  | 'workflow:transition'
  | 'workflow:approve'
  | 'document:upload'
  | 'document:view'
  | 'document:download'
  | 'document:delete'
  | 'compensation:assess'
  | 'compensation:approve'
  | 'compensation:disburse'
  | 'compensation:view'
  | 'rehabilitation:manage'
  | 'rehabilitation:view'
  | 'possession:record'
  | 'possession:approve'
  | 'field:assign'
  | 'field:inspect'
  | 'field:view'
  | 'analytics:view-national'
  | 'analytics:view-state'
  | 'analytics:view-district'
  | 'report:export'
  | 'report:generate'
  | 'audit:view'
  | 'audit:export'
  | 'admin:users'
  | 'admin:roles'
  | 'public:view';

export interface UserSession {
  id: string;
  officerId: string;
  name: string;
  email: string;
  role: RoleCode;
  roleLabel: string;
  designation: string;
  jurisdiction: string;
  stateCode?: string;
  districtName?: string;
  organization?: string;
  permissions: PermissionCode[];
}

export interface LoginDto {
  userId?: string;
  email?: string;
  password?: string;
  role?: string;
  captchaToken?: string;
  authMode?: 'credentials' | 'sso';
  ssoAadhaar?: string;
  ssoOtp?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: UserSession;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Project Management
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectStatus = 'DRAFT' | 'IN_PROGRESS' | 'DELAYED' | 'AT_RISK' | 'COMPLETED';

export type ProjectStage =
  | 'SIA'
  | 'SEC_11_PRELIMINARY'
  | 'SEC_15_HEARING'
  | 'SEC_19_DECLARATION'
  | 'VALUATION'
  | 'SEC_23_AWARD'
  | 'COMPENSATION_DISBURSED'
  | 'R_AND_R'
  | 'SEC_38_POSSESSION'
  | 'COMPLETED';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ProjectMilestoneDto {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  targetDate: string;
  completedDate?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  stage?: string;
}

export interface ProjectStakeholderDto {
  id: string;
  name: string;
  role: string;
  organization: string;
  email?: string;
  phone?: string;
}

export interface ProjectDto {
  id: string;
  projectCode: string;
  name: string;
  description?: string;
  type: 'Highway' | 'Rail' | 'Metro' | 'Energy' | 'Smart City' | 'Airport' | 'Industrial';
  ministry: string;
  requiringBody: string;
  state: string;
  stateCode: string;
  district: string;
  stage: string;
  stageCode: ProjectStage;
  status: ProjectStatus;
  totalAreaProposedHa: number;
  totalAreaNotifiedHa: number;
  totalAreaAcquiredHa: number;
  estimatedBudgetCr: number;
  compensationAssessedCr: number;
  compensationDisbursedCr: number;
  affectedFamilies: number;
  slaDaysRemaining: number;
  riskLevel: RiskLevel;
  delayPredictedDays: number;
  recommendedAction: string;
  targetCompletionDate: string;
  startDate: string;
  milestones?: ProjectMilestoneDto[];
  stakeholders?: ProjectStakeholderDto[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFilterQuery extends PaginationQuery {
  state?: string;
  district?: string;
  stage?: string;
  risk?: string;
  status?: string;
  ministry?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Land Parcels & Spatial (PostGIS / GIS)
// ─────────────────────────────────────────────────────────────────────────────

export type LandCategory =
  | 'Agricultural (Irrigated)'
  | 'Agricultural (Dry Crop)'
  | 'Commercial'
  | 'Residential'
  | 'Forest Land'
  | 'Community Gauchar'
  | 'Government Wasteland';

export interface ParcelOwnerDto {
  id: string;
  name: string;
  sharePercentage: number;
  bankAccountVerified: boolean;
  phone?: string;
  isMainOwner: boolean;
}

export interface LandParcelDto {
  id: string;
  parcelNumber: string;
  surveyNo: string;
  projectId: string;
  projectName?: string;
  state: string;
  district: string;
  tehsil?: string;
  village: string;
  totalAreaHa: number;
  acquiredAreaHa: number;
  landCategory: LandCategory;
  landUse?: string;
  stage: string;
  stageCode: ProjectStage;
  compensationStatus: 'Disbursed (100%)' | 'Partially Paid (80%)' | 'Award In Calculation' | 'Hearing Pending';
  compensationAssessed: string;
  compensationAssessedAmount: number;
  rrStatus: string;
  possessionStatus: 'Possession Taken' | 'Handover Scheduled' | 'Pending Compensation' | 'Pending R&R';
  coordinates: string;
  latitude: number;
  longitude: number;
  gazetteNotice: string;
  color: string;
  owners?: ParcelOwnerDto[];
  createdAt: string;
  updatedAt: string;
}

export interface Parcel360Dto {
  parcel: LandParcelDto;
  project: {
    id: string;
    projectCode: string;
    name: string;
    ministry: string;
    slaDaysRemaining: number;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
    centroid: [number, number];
  };
  valuation: ValuationDto | null;
  award: CompensationAwardDto | null;
  payments: CompensationPaymentDto[];
  rrCase: RRCaseDto | null;
  grievances: GrievanceDto[];
  inspections: FieldInspectionDto[];
  notices: AcquisitionNoticeDto[];
  documents: DocumentDto[];
  auditHistory: AuditLogDto[];
}

export interface AcquisitionNoticeDto {
  id: string;
  noticeType: string;
  noticeNumber: string;
  issueDate: string;
  gazetteDate?: string;
  publishedInGazette: boolean;
  pdfUrl?: string;
  status: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. GIS GeoJSON Models
// ─────────────────────────────────────────────────────────────────────────────

export interface GeoJsonGeometry {
  type: 'Point' | 'MultiPoint' | 'LineString' | 'MultiLineString' | 'Polygon' | 'MultiPolygon';
  coordinates: unknown;
}

export interface GeoJsonFeature<P = Record<string, unknown>> {
  type: 'Feature';
  id: string;
  geometry: GeoJsonGeometry;
  properties: P;
}

export interface GeoJsonFeatureCollection<P = Record<string, unknown>> {
  type: 'FeatureCollection';
  features: GeoJsonFeature<P>[];
  total?: number;
  bbox?: [number, number, number, number];
}

export interface SpatialQueryDto {
  bbox?: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  lat?: number;
  lon?: number;
  radiusKm?: number;
  projectId?: string;
  state?: string;
  stage?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Workflow, Action Centre & SLA
// ─────────────────────────────────────────────────────────────────────────────

export type ActionPriority = 'low' | 'medium' | 'high' | 'critical';

export interface WorkflowActionDto {
  id: string;
  caseId?: string;
  projectId: string;
  projectName: string;
  parcelId?: string;
  parcelSurveyNo?: string;
  title: string;
  description: string;
  actionType:
    | 'SLA_BREACH_RESOLUTION'
    | 'GAZETTE_RESPONSE'
    | 'OBJECTION_HEARING'
    | 'VALUATION_APPROVAL'
    | 'DISBURSAL_MANDATE_HOLD'
    | 'POSSESSION_HANDOVER'
    | 'ENV_CLEARANCE';
  priority: ActionPriority;
  assignedRole: string;
  dueDate: string;
  daysPending: number;
  daysOverdue: number;
  isOverdue: boolean;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ESCALATED';
  escalationLevel: number;
  createdAt: string;
}

export interface ActionCentreResponse {
  summary: {
    totalUrgent: number;
    totalOverdue: number;
    dueToday: number;
    upcoming7Days: number;
    slaComplianceRate: number;
  };
  urgentOverdue: WorkflowActionDto[];
  dueToday: WorkflowActionDto[];
  upcoming: WorkflowActionDto[];
}

export interface TransitionDto {
  caseId?: string;
  projectId: string;
  parcelId?: string;
  fromStage: ProjectStage;
  toStage: ProjectStage;
  remarks: string;
  documentIds?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Compensation & Valuation
// ─────────────────────────────────────────────────────────────────────────────

export interface ValuationDto {
  id: string;
  parcelId: string;
  baseLandRatePerHa: number;
  multiplicationFactor: number;
  marketValueTotal: number;
  solatiumPercentage: number;
  solatiumAmount: number;
  assetsValueTreesStructures: number;
  totalAssessedCompensation: number;
  assessedBy: string;
  assessedDate: string;
  status: 'DRAFT' | 'RECOMMENDED' | 'APPROVED';
}

export interface CompensationAwardDto {
  id: string;
  awardNumber: string;
  parcelId: string;
  projectId: string;
  awardDate: string;
  totalAwardAmount: number;
  solatiumAmount: number;
  additionalInterest: number;
  approvedBy: string;
  status: 'APPROVED' | 'DISBURSED' | 'CONTESTED';
}

export interface CompensationPaymentDto {
  id: string;
  awardId: string;
  parcelId: string;
  beneficiaryName: string;
  beneficiaryAccountMasked: string;
  bankName: string;
  ifscCode: string;
  amount: number;
  paymentMethod: 'PFMS_DBT' | 'TREASURY_CHALLAN' | 'ESCROW';
  paymentDate?: string;
  transactionRef?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'ON_HOLD';
  remarks?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Rehabilitation & Resettlement (R&R)
// ─────────────────────────────────────────────────────────────────────────────

export interface RRBeneficiaryDto {
  id: string;
  name: string;
  relationship: string;
  age: number;
  gender: string;
}

export interface RRCaseDto {
  id: string;
  projectId: string;
  parcelId: string;
  familyHeadName: string;
  familySize: number;
  isScSt: boolean;
  isBpl: boolean;
  displacementType: 'PHYSICAL_DISPLACEMENT' | 'ECONOMIC_DISPLACEMENT' | 'BOTH';
  packageType: string;
  entitlements: string[];
  resettlementPlotNo?: string;
  resettlementColonyName?: string;
  subsistenceGrantAmount: number;
  relocationGrantAmount: number;
  status: 'ELIGIBLE' | 'PACKAGE_SANCTIONED' | 'PLOT_ALLOTTED' | 'DISBURSED' | 'COMPLETED';
  beneficiaries?: RRBeneficiaryDto[];
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. Grievance Management
// ─────────────────────────────────────────────────────────────────────────────

export type GrievanceCategory =
  | 'COMPENSATION_DISPUTE'
  | 'MEASUREMENT_ERROR'
  | 'OWNERSHIP_CLAIM'
  | 'R_AND_R_DENIAL'
  | 'DELAY_IN_PAYMENT'
  | 'PROCEDURAL_LAPSE';

export interface GrievanceActionDto {
  id: string;
  actorName: string;
  actorRole: string;
  actionTaken: string;
  comments: string;
  timestamp: string;
}

export interface GrievanceDto {
  id: string;
  ticketNumber: string;
  projectId: string;
  projectName?: string;
  parcelId?: string;
  surveyNo?: string;
  complainantName: string;
  phone?: string;
  category: GrievanceCategory;
  description: string;
  filingDate: string;
  hearingDate?: string;
  slaDueDate: string;
  isOverdue: boolean;
  assignedOfficerName: string;
  status: 'SUBMITTED' | 'UNDER_INVESTIGATION' | 'HEARING_SCHEDULED' | 'RESOLVED' | 'REJECTED' | 'CLOSED';
  resolutionNotes?: string;
  resolutionDate?: string;
  actions?: GrievanceActionDto[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. Field Operations
// ─────────────────────────────────────────────────────────────────────────────

export interface FieldTaskDto {
  id: string;
  projectId: string;
  parcelId: string;
  taskType: 'BOUNDARY_SURVEY' | 'TREE_VALUATION' | 'STRUCTURE_ASSESSMENT' | 'POSSESSION_HANDOVER';
  assignedOfficerName: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface FieldInspectionDto {
  id: string;
  taskId?: string;
  parcelId: string;
  projectId?: string;
  surveyNo?: string;
  inspectorName: string;
  inspectionDate: string;
  gpsLatitude: number;
  gpsLongitude: number;
  gpsAccuracyMeters: number;
  observations: string;
  encroachmentFound: boolean;
  evidencePhotos?: string[];
  evidencePhotosCount?: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'DISCREPANCY_NOTED' | 'RE_SURVEY_REQUIRED';
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. Documents & Notifications
// ─────────────────────────────────────────────────────────────────────────────

export interface DocumentDto {
  id: string;
  title: string;
  documentType:
    | 'GAZETTE_NOTIFICATION'
    | 'SIA_REPORT'
    | 'KHASRA_MAP'
    | 'VALUATION_CERTIFICATE'
    | 'AWARD_SHEET'
    | 'PAYMENT_RECEIPT'
    | 'FIELD_PHOTO';
  fileUrl: string;
  storageKey?: string;
  fileSize: number;
  mimeType: string;
  checksumSha256: string;
  version: number;
  /** @deprecated use uploadedByUserId + uploadedByName */
  uploadedBy?: string;
  uploadedByUserId?: string;
  uploadedByName?: string;
  projectId?: string;
  parcelId?: string;
  isVerified: boolean;
  uploadedAt?: string;
  createdAt?: string;
}

export interface NotificationDto {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'SLA_BREACH' | 'ACTION_REQUIRED' | 'STATUS_UPDATE' | 'COMPENSATION_READY' | 'GRIEVANCE_FILED' | 'SLA_ALERT' | 'COMPLIANCE' | 'SYSTEM' | 'APPROVAL_REQUIRED';
  priority: ActionPriority | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  entityType?: string;
  entityId?: string;
  linkUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. Audit Trail
// ─────────────────────────────────────────────────────────────────────────────

export interface AuditLogDto {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  previousState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
  ipAddress?: string;
  remarks?: string;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. National Command Centre & Analytics
// ─────────────────────────────────────────────────────────────────────────────

export interface StateKpiDto {
  state: string;
  projects: number;
  area: string;
  areaHa: number;
  sla: number;
  risk: number;
  color: string;
}

export interface RecentProjectDto {
  id: string;
  name: string;
  state: string;
  stage: string;
  area: string;
  sla: number;
  risk: RiskLevel;
}

export interface PriorityActionSummaryDto {
  severity: 'critical' | 'high' | 'medium';
  label: string;
  count: number;
  detail: string;
}

export interface DashboardMetricsDto {
  timestamp: string;
  kpis: {
    totalProjects: number;
    totalAreaHa: number;
    totalAreaAcquiredHa: number;
    compensationPaidCr: number;
    compensationAssessedCr: number;
    slaComplianceRate: number;
    slaAlertsCount: number;
    pendingObjections: number;
  };
  stateKpis: StateKpiDto[];
  recentProjects: RecentProjectDto[];
  priorityActions: PriorityActionSummaryDto[];
}

export interface DecisionSupportInsightDto {
  id: string;
  title: string;
  type: 'DELAY_RISK' | 'SLA_BREACH_WARNING' | 'PAYMENT_BOTTLENECK' | 'GRIEVANCE_CLUSTER';
  severity: 'critical' | 'high' | 'medium';
  projectId: string;
  projectName: string;
  reason: string;
  recommendedAction: string;
  affectedParcelsCount?: number;
  statutoryDeadline?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. Bhu-Mitra AI Assistant & Command Intelligence Types
// ─────────────────────────────────────────────────────────────────────────────

export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'hinglish'
  | 'mr'
  | 'bn'
  | 'ta'
  | 'te'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa';

export type AiChatRole = 'user' | 'assistant' | 'system';

export type AiActionType =
  | 'NAVIGATE'
  | 'GIS_FILTER'
  | 'OPEN_PROJECT'
  | 'OPEN_PARCEL'
  | 'OPEN_DOCUMENT'
  | 'OPEN_COMPENSATION'
  | 'GENERATE_REPORT';

export interface AiAction {
  label: string;
  actionType: AiActionType;
  payload: Record<string, unknown>;
}

export interface AiMetric {
  label: string;
  value: string | number;
  change?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export interface AiRiskAssessment {
  score: number; // 0 - 100
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: string[];
}

export interface AiBottleneck {
  stage: string;
  issue: string;
  affectedCount: number;
  severity: 'critical' | 'high' | 'medium';
}

export interface AiConversationContext {
  selectedProjectId?: string;
  selectedProjectCode?: string;
  selectedProjectName?: string;
  lastProjects?: Array<{
    id: string;
    projectCode: string;
    name: string;
    state: string;
    riskLevel: string;
    status: string;
  }>;
  activeFilters?: {
    state?: string;
    sector?: string;
    status?: string;
    stage?: string;
  };
  contextLabel?: string;
}

export type VoiceInteractionState =
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'DETECTING_LANG'
  | 'SEARCHING'
  | 'PREPARING'
  | 'SPEAKING'
  | 'ERROR';

export interface AiStructuredResponse {
  title: string;
  summary: string;
  language: SupportedLanguage;
  detectedIntent?: string;
  spokenSummary?: string;
  inputSource?: 'text' | 'voice';
  speakResponse?: boolean;
  projects?: ProjectDto[];
  metrics?: AiMetric[];
  badges?: Array<{ text: string; color: string }>;
  risk?: AiRiskAssessment;
  bottlenecks?: AiBottleneck[];
  priorities?: Array<{ label: string; count: number; detail: string; severity: 'critical' | 'high' | 'medium' }>;
  table?: { columns: string[]; rows: Array<Array<string | number>> };
  facts?: string[];
  analysis?: string[];
  recommendations?: string[];
  actions?: AiAction[];
  sources?: string[];
  disclaimer?: string;
  conversationContext?: AiConversationContext;
}

export interface AiMessage {
  id: string;
  role: AiChatRole;
  content: string;
  structuredResponse?: AiStructuredResponse;
  timestamp: string;
}

export interface AiContext {
  currentPage: string;
  currentModule: string;
  projectId?: string;
  projectCode?: string;
  parcelId?: string;
  surveyNo?: string;
  selectedDistrict?: string;
  selectedVillage?: string;
  userRole?: string;
  jurisdiction?: string;
  language?: SupportedLanguage;
  conversationContext?: AiConversationContext;
}

export interface AiQueryDto {
  message: string;
  context?: Partial<AiContext>;
  conversationId?: string;
  language?: SupportedLanguage;
  history?: Array<{ role: AiChatRole; content: string }>;
  attachment?: { name: string; type: string; content: string };
  conversationContext?: AiConversationContext;
  inputSource?: 'text' | 'voice';
}

export interface AiConversationSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AiMessage[];
  context?: AiConversationContext;
}



