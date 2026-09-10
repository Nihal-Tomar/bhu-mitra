/**
 * BhuMitra — National Land Acquisition Intelligence & Management Platform
 * Domain Data Specification — National Land Acquisition Management System
 * 
 * NOTE: All quantitative metrics, project details, and statutory records 
 * contained herein represent ILLUSTRATIVE MODEL / TELEMETRY DATA.
 */

import { EXPANDED_SECTOR_PROJECTS } from './sectorProjectsData';
export * from './projectLifecycleData';

export const DEMO_DATA_DISCLAIMER = 'National Land Acquisition Management System — Model Telemetry Dataset' as const;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AcquisitionStatItem {
  id: string;
  value: string;
  label: string;
  subtext: string;
  icon: 'projects' | 'area' | 'finance' | 'families';
}

export interface GovernancePillar {
  id: string;
  title: string;
  icon: 'shield' | 'leaf' | 'people' | 'chakra';
  description: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  color: string;
  bgCircle: string;
  icon: string;
  href: string;
  description: string;
}

export interface LifecycleStage {
  step: string;
  title: string;
  code: string;
  description: string;
  authority: string;
  statutorySLA: string;
  keyAction: string;
  documents: string[];
  status: 'Completed' | 'In Progress' | 'Pending' | 'Critical';
}

export interface AcquisitionProject {
  id: string;
  name: string;
  type: 'Highways' | 'Railways' | 'Renewable Energy' | 'Urban Infra' | 'Industrial Corridor';
  ministry: string;
  state: string;
  district: string;
  stage: string;
  stageProgress: number; // 0 to 100
  landProposedHa: number;
  landNotifiedHa: number;
  landAcquiredHa: number;
  compensationAssessedCr: number;
  compensationDisbursedCr: number;
  affectedFamilies: number;
  displacedFamilies: number;
  slaDaysRemaining: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  delayPredictedDays: number;
  riskFactors: string[];
  recommendedAction: string;
  // Extended metadata for national sector tracking & reporting
  projectLocation?: string;
  implementingAgency?: string;
  landRemainingHa?: number;
  status?: string;
  acquisitionStatus?: string;
  compensationStatus?: string;
  startDate?: string;
  expectedCompletionDate?: string;
  estimatedCostCr?: number;
  dataSource?: string;
  lastUpdated?: string;
  statutorySection?: string;
}

export interface StakeholderWorkspace {
  id: string;
  role: string;
  badge: string;
  title: string;
  description: string;
  primaryKPIs: { label: string; value: string }[];
  keyCapabilities: string[];
  actionLabel: string;
  actionHref: string;
}

export interface AcquisitionAlert {
  id: string;
  severity: 'Critical' | 'Warning' | 'Normal';
  category: 'Statutory SLA' | 'Compensation' | 'R&R' | 'Possession' | 'Objection Hearing';
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  timestamp: string;
  actionRequired: string;
}

export interface StatutoryDocument {
  id: string;
  docNumber: string;
  title: string;
  category: 'Proposal' | 'Gazette Notice' | 'Hearing Record' | 'Award' | 'Compensation DBT' | 'R&R Order' | 'Possession';
  projectId: string;
  projectName: string;
  issuingAuthority: string;
  publishedDate: string;
  fileSize: string;
  verificationHash: string; // SHA-256 prototype string
  status: 'Legally Effective' | 'Under Scrutiny' | 'Public Scrutiny Open';
}

export interface AcquisitionUpdate {
  id: string;
  date: string;
  category: 'Gazette Notice' | 'Award Declared' | 'DBT Compensation' | 'R&R Progress' | 'Statutory Milestone';
  headline: string;
  summary: string;
  gazetteRef: string;
  state: string;
}

export interface AcquisitionFAQ {
  category: 'Acquisition Process' | 'Objections & Hearings' | 'Compensation & DBT' | 'R&R Entitlements';
  question: string;
  answer: string;
}

// ── 1. Hero Acquisition KPIs ──────────────────────────────────────────────────

export const HERO_STATS: AcquisitionStatItem[] = [
  {
    id: 'kpi-projects',
    value: '1,284',
    label: 'Projects Monitored',
    subtext: 'Across 28 States & 8 UTs',
    icon: 'projects',
  },
  {
    id: 'kpi-notified',
    value: '48,500 Ha',
    label: 'Land Under Acquisition',
    subtext: '86% geo-referenced GIS',
    icon: 'area',
  },
  {
    id: 'kpi-compensation',
    value: '₹14,850 Cr',
    label: 'Compensation Disbursed',
    subtext: 'Direct PFMS transfer (Demo)',
    icon: 'finance',
  },
  {
    id: 'kpi-families',
    value: '84,200',
    label: 'Families Protected',
    subtext: 'Mandatory R&R safeguards',
    icon: 'families',
  },
];

export const GOVERNANCE_PILLARS: GovernancePillar[] = [
  {
    id: 'gov-transparent',
    title: 'End-to-End Digital Workflow',
    icon: 'shield',
    description: 'Statutory milestone tracking from online proposal to legal possession under RFCTLARR Act 2013.',
  },
  {
    id: 'gov-sustainable',
    title: 'GIS Intelligence & Corridors',
    icon: 'leaf',
    description: 'High-precision cadastral overlays, multi-crop land restriction checks, and linear corridor mapping.',
  },
  {
    id: 'gov-community',
    title: 'Fair Compensation & R&R',
    icon: 'people',
    description: '100% Solatium calculation, direct bank disbursement, and comprehensive rehabilitation packages.',
  },
  {
    id: 'gov-digital',
    title: 'Early Warning & Decision Support',
    icon: 'chakra',
    description: 'AI delay risk prediction, bottleneck alerts, and executive dashboards for Collectors and Ministries.',
  },
];

// ── 2. Quick Actions ──────────────────────────────────────────────────────────

export const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'act-dashboard',
    title: 'National Dashboard',
    color: '#0D6606',
    bgCircle: '#138808',
    icon: 'dashboard',
    href: '#dashboard',
    description: 'Real-time project counts, state comparison rankings, land area progress, and compensation metrics.',
  },
  {
    id: 'act-lifecycle',
    title: '9-Stage Lifecycle',
    color: '#0284C7',
    bgCircle: '#0EA5E9',
    icon: 'workflow',
    href: '#lifecycle',
    description: 'End-to-end statutory tracking: Proposal → Scrutiny → Gazette → Award → Compensation → Possession.',
  },
  {
    id: 'act-gis',
    title: 'Acquisition GIS Map',
    color: '#D97706',
    bgCircle: '#F59E0B',
    icon: 'map-pin',
    href: '#gis-map',
    description: 'Interactive map with proposed corridors, notified parcels, compensation status, and R&R areas.',
  },
  {
    id: 'act-risk',
    title: 'Risk & Delay Intelligence',
    color: '#B42318',
    bgCircle: '#EF4444',
    icon: 'alert-triangle',
    href: '#intelligence',
    description: 'Smart bottleneck detection, predictive SLA slippage calculation, and proactive collector action items.',
  },
  {
    id: 'act-stakeholders',
    title: 'Stakeholder Workspaces',
    color: '#6D28D9',
    bgCircle: '#8B5CF6',
    icon: 'users',
    href: '#stakeholders',
    description: 'Dedicated portals for Central Ministries, District Collectors (CALA), Field Officers, and Affected Families.',
  },
  {
    id: 'act-transparency',
    title: 'Citizen Transparency',
    color: '#0F766E',
    bgCircle: '#14B8A6',
    icon: 'file-text',
    href: '#transparency',
    description: 'Track individual survey numbers, inspect Gazette Section 11 notices, calculate compensation, and file hearings.',
  },
];

// ── 3. Central 9-Stage Acquisition Lifecycle ──────────────────────────────────

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    step: '01',
    title: 'Proposal Submission',
    code: 'STAGE-PROP',
    description: 'Online indent submitted by Requiring Body (NHAI, Railways, State Govt) with alignment coordinates and minimum land rationale.',
    authority: 'Requiring Body / Project Proponent',
    statutorySLA: '15 Days',
    keyAction: 'Verification of preliminary alignment & multi-crop restriction audit',
    documents: ['Form A Indent', 'Project DPR', 'Preliminary Cadastral Alignment'],
    status: 'Completed',
  },
  {
    step: '02',
    title: 'Administrative Scrutiny',
    code: 'STAGE-SCRUT',
    description: 'District Collector examines project scope, verifies existing revenue records, and checks forest/tribal land protections.',
    authority: 'Revenue Department / District Collector',
    statutorySLA: '30 Days',
    keyAction: 'Feasibility scrutiny & Social Impact Assessment (SIA) initiation',
    documents: ['Scrutiny Checklist', 'FRA Compliance Certificate', 'SIA Terms of Reference'],
    status: 'Completed',
  },
  {
    step: '03',
    title: 'Authority Approval',
    code: 'STAGE-APPR',
    description: 'Competent Authority reviews SIA report, ensures public hearing inputs, and issues formal acquisition sanction.',
    authority: 'State Govt / Central Competent Authority',
    statutorySLA: '45 Days',
    keyAction: 'Formal sanction of project boundary and preliminary budget authorization',
    documents: ['SIA Evaluation Report', 'Expert Committee Sanction', 'Budget Escrow Order'],
    status: 'Completed',
  },
  {
    step: '04',
    title: 'Preliminary Notification',
    code: 'SEC-11-NOTIF',
    description: 'Publication of Section 11(1) notification in Official Gazette, two daily newspapers, and Gram Sabha notice boards.',
    authority: 'Collector / Competent Authority (CALA)',
    statutorySLA: '30 Days',
    keyAction: 'Public gazette publication & freezing of unauthorized land transactions',
    documents: ['Gazette Sec. 11(1)', 'Newspaper Clippings', 'Gram Sabha Publication Record'],
    status: 'In Progress',
  },
  {
    step: '05',
    title: 'Objections & Award Declaration',
    code: 'SEC-19-23',
    description: 'Hearings conducted under Section 15 for landowner objections, followed by Section 19 declaration and Section 23 inquiry.',
    authority: 'Competent Authority for Land Acquisition',
    statutorySLA: '60 Days',
    keyAction: 'Objection hearing roster disposal & final award valuation determination',
    documents: ['Hearing Proceedings', 'Sec. 19 Declaration', 'Draft Section 23 Award'],
    status: 'In Progress',
  },
  {
    step: '06',
    title: 'Compensation Disbursement',
    code: 'SEC-30-COMP',
    description: 'Calculation of market value multiplier, 100% Solatium (bonus), 12% interest, and direct bank transfer to verified titleholders.',
    authority: 'CALA / Treasury / PFMS Integration',
    statutorySLA: '30 Days',
    keyAction: 'Direct biometric/account validation & electronic escrow disbursement',
    documents: ['Award Statement', 'Title Verification Dossier', 'Payment Disbursement Advice'],
    status: 'Pending',
  },
  {
    step: '07',
    title: 'Rehabilitation & Resettlement',
    code: 'SEC-31-RR',
    description: 'Execution of approved R&R scheme: housing allotment for displaced families, subsistence grants, and livelihood training.',
    authority: 'Administrator for Rehabilitation & Resettlement',
    statutorySLA: '90 Days',
    keyAction: 'Infrastructure delivery at resettlement colony & entitlement fulfillment',
    documents: ['R&R Scheme Plan', 'Entitlement Passbook', 'Plot/House Allotment Letter'],
    status: 'Pending',
  },
  {
    step: '08',
    title: 'Legal Possession Taken',
    code: 'SEC-38-POSS',
    description: 'Physical handover and encumbrance-free possession taken under Section 38 ONLY after 100% compensation & R&R are executed.',
    authority: 'Collector / Authorized Revenue Officer',
    statutorySLA: '15 Days',
    keyAction: 'Joint site inspection, boundary beaconing, and official handover memo',
    documents: ['Possession Panchnama', 'Joint Inspection Report', 'Handover Certificate'],
    status: 'Pending',
  },
  {
    step: '09',
    title: 'Project Revenue Closure',
    code: 'STAGE-CLOSE',
    description: 'Formal mutation of acquired land into Government/Requiring Body records, closure of acquisition ledger, and statutory audit archive.',
    authority: 'Tehsildar / Sub-Registrar / Nodal Auditor',
    statutorySLA: '30 Days',
    keyAction: 'Revenue record mutation, RoR endorsement, and permanent archival',
    documents: ['Final Mutation Order', 'Updated Record of Rights', 'Statutory Audit Clearance'],
    status: 'Pending',
  },
];

// ── 4. Sample Acquisition Projects ────────────────────────────────────────────

// ── 4. Sample Acquisition Projects ────────────────────────────────────────────

export const BASE_DEMO_PROJECTS: AcquisitionProject[] = [
  {
    id: 'DOLR-2026-0084',
    name: 'NH-48 Bharatmala Six-Laning Corridor',
    type: 'Highways',
    ministry: 'Ministry of Road Transport & Highways / NHAI',
    implementingAgency: 'National Highways Authority of India (NHAI)',
    state: 'Gujarat',
    district: 'Vadodara & Bharuch',
    projectLocation: 'Vadodara to Bharuch Section, NH-48',
    stage: '05 - Section 15 Objection Hearings',
    stageProgress: 52,
    landProposedHa: 142.5,
    landNotifiedHa: 138.2,
    landAcquiredHa: 68.4,
    landRemainingHa: 74.1,
    compensationAssessedCr: 284.5,
    compensationDisbursedCr: 142.0,
    affectedFamilies: 1240,
    displacedFamilies: 180,
    slaDaysRemaining: 8,
    riskLevel: 'High',
    delayPredictedDays: 22,
    status: 'Under Construction',
    acquisitionStatus: 'Sec. 15 Objection Hearings',
    compensationStatus: '50% Disbursed',
    startDate: '2023-01-15',
    expectedCompletionDate: '2026-12-31',
    estimatedCostCr: 2150,
    dataSource: 'Demo / Sample Data',
    riskFactors: [
      '23 land parcels in Karjan tehsil have pending Section 15 objections',
      'R&R resettlement layout pending approval from State Town Planning authority',
      'Statutory 12-month limit between Sec. 11 and Sec. 19 expiring in 48 days',
    ],
    recommendedAction: 'Convene joint hearing by District Collector for Karjan cluster by 12 Sep; expedite town planning NOC.',
  },
  {
    id: 'DOLR-2026-0071',
    name: 'Western Dedicated Freight Corridor (Phase 2)',
    type: 'Railways',
    ministry: 'Ministry of Railways / DFCCIL',
    implementingAgency: 'Dedicated Freight Corridor Corporation of India (DFCCIL)',
    state: 'Rajasthan',
    district: 'Alwar & Jaipur',
    projectLocation: 'Rewari to Madar Section via Alwar & Jaipur',
    stage: '05 - Section 19 Declaration Published',
    stageProgress: 64,
    landProposedHa: 310.0,
    landNotifiedHa: 304.5,
    landAcquiredHa: 195.0,
    landRemainingHa: 115.0,
    compensationAssessedCr: 540.0,
    compensationDisbursedCr: 380.5,
    affectedFamilies: 2180,
    displacedFamilies: 320,
    slaDaysRemaining: 24,
    riskLevel: 'Medium',
    delayPredictedDays: 9,
    status: 'Under Construction',
    acquisitionStatus: 'Sec. 19 Declared & Award Inquiry',
    compensationStatus: '70.5% Disbursed',
    startDate: '2021-08-01',
    expectedCompletionDate: '2026-11-30',
    estimatedCostCr: 4850,
    dataSource: 'Demo / Sample Data',
    riskFactors: [
      '14 court injunction appeals regarding tree/well valuation multipliers',
      'Escrow fund top-up of ₹45 Cr required from implementing agency',
    ],
    recommendedAction: 'Disburse undisputed compensation parcels; deposit contested amounts with Land Acquisition Authority.',
  },
  {
    id: 'DOLR-2026-0066',
    name: 'Pune–Nashik Semi-High Speed Rail Corridor',
    type: 'Railways',
    ministry: 'Maharashtra Rail Infrastructure Dev. Corp.',
    implementingAgency: 'Maharashtra Rail Infrastructure Development Corp. (MahaRail)',
    state: 'Maharashtra',
    district: 'Pune & Ahmednagar',
    projectLocation: 'Pune–Nashik Semi-High Speed Alignment',
    stage: '04 - Section 11 Gazette Notification',
    stageProgress: 42,
    landProposedHa: 218.7,
    landNotifiedHa: 218.7,
    landAcquiredHa: 45.2,
    landRemainingHa: 173.5,
    compensationAssessedCr: 412.0,
    compensationDisbursedCr: 88.0,
    affectedFamilies: 1840,
    displacedFamilies: 140,
    slaDaysRemaining: 45,
    riskLevel: 'Low',
    delayPredictedDays: 0,
    status: 'Land Acquisition Active',
    acquisitionStatus: 'Section 11 Gazette Issued',
    compensationStatus: '21.4% Disbursed',
    startDate: '2023-05-10',
    expectedCompletionDate: '2027-12-31',
    estimatedCostCr: 3600,
    dataSource: 'Demo / Sample Data',
    riskFactors: [
      'Cadastral drone survey 100% completed',
      'Gram Sabha resolutions obtained in 41 out of 44 villages',
    ],
    recommendedAction: 'Proceed with scheduled Section 15 objection calendar; initiate biometric Aadhaar e-verification.',
  },
  {
    id: 'DOLR-2026-0059',
    name: 'Lucknow Metro Extension Line 3',
    type: 'Urban Infra',
    ministry: 'Ministry of Housing & Urban Affairs / UPMRC',
    implementingAgency: 'Uttar Pradesh Metro Rail Corporation (UPMRC)',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    projectLocation: 'Munshipulia to Lucknow Airport Line 3',
    stage: '06 - Compensation Disbursement',
    stageProgress: 72,
    landProposedHa: 64.2,
    landNotifiedHa: 64.2,
    landAcquiredHa: 48.0,
    landRemainingHa: 16.2,
    compensationAssessedCr: 195.0,
    compensationDisbursedCr: 128.5,
    affectedFamilies: 620,
    displacedFamilies: 95,
    slaDaysRemaining: -3,
    riskLevel: 'Critical',
    delayPredictedDays: 34,
    status: 'Under Construction',
    acquisitionStatus: 'Compensation & Tenant Rehabilitation',
    compensationStatus: '65.9% Disbursed',
    startDate: '2022-02-15',
    expectedCompletionDate: '2026-09-30',
    estimatedCostCr: 2200,
    dataSource: 'Demo / Sample Data',
    riskFactors: [
      'SLA breached by 3 days for commercial tenant rehabilitation determination',
      'Bank IFSC mismatch for 38 commercial shopkeeper families',
    ],
    recommendedAction: 'Direct Municipal Corporation to complete alternative commercial market site allocation within 7 days.',
  },
  {
    id: 'DOLR-2026-0048',
    name: 'Rewa Ultra Mega Solar Park Corridor',
    type: 'Renewable Energy',
    ministry: 'Ministry of New & Renewable Energy / RUMSL',
    implementingAgency: 'Rewa Ultra Mega Solar Limited (RUMSL)',
    state: 'Madhya Pradesh',
    district: 'Rewa',
    projectLocation: 'Gurh Tehsil Solar Array Zone, Rewa',
    stage: '08 - Possession & Handover',
    stageProgress: 94,
    landProposedHa: 480.0,
    landNotifiedHa: 480.0,
    landAcquiredHa: 476.5,
    landRemainingHa: 3.5,
    compensationAssessedCr: 320.0,
    compensationDisbursedCr: 318.2,
    affectedFamilies: 890,
    displacedFamilies: 0, // Zero displacement, barren non-irrigated land
    slaDaysRemaining: 18,
    riskLevel: 'Low',
    delayPredictedDays: 0,
    status: 'Near Completion',
    acquisitionStatus: 'Possession 99.2% Completed',
    compensationStatus: '99.4% Disbursed',
    startDate: '2021-03-01',
    expectedCompletionDate: '2025-10-31',
    estimatedCostCr: 1750,
    dataSource: 'Demo / Sample Data',
    riskFactors: [
      'Possession completed for 99.2% of proposed solar array area',
      'Final mutation in revenue record underway in Tehsil office',
    ],
    recommendedAction: 'Issue final Section 38 completion memo and archive project audit trail.',
  },
];

export const SAMPLE_PROJECTS: AcquisitionProject[] = [
  ...BASE_DEMO_PROJECTS,
  ...EXPANDED_SECTOR_PROJECTS,
];

export const ACQUISITION_PROJECTS = SAMPLE_PROJECTS;

// ── 5. Stakeholder Workspaces ─────────────────────────────────────────────────

export const STAKEHOLDER_ROLES: StakeholderWorkspace[] = [
  {
    id: 'role-ministry',
    role: 'Central Ministry (DoLR / MoRD)',
    badge: 'National Oversight',
    title: 'Policy, Inter-State Benchmarking & Budget Allocation',
    description: 'Executive oversight on infrastructure acquisition pipelines across all 36 States and UTs with real-time statutory SLA adherence tracking.',
    primaryKPIs: [
      { label: 'Total Projects', value: '1,284' },
      { label: 'Land Notified', value: '48,500 Ha' },
      { label: 'SLA Adherence', value: '91.8%' },
    ],
    keyCapabilities: [
      'Comparative state performance & delay heatmaps',
      'National budget escrow & DBT disbursement telemetry',
      'Statutory compliance audits under RFCTLARR Act 2013',
    ],
    actionLabel: 'Access National Command Console',
    actionHref: '/dashboard',
  },
  {
    id: 'role-collector',
    role: 'District Collector / CALA',
    badge: 'Statutory Authority',
    title: 'Competent Authority for Land Acquisition & Awards',
    description: 'Administer statutory hearings, resolve Section 15 citizen objections, compute fair compensation awards, and sanction possession certificates.',
    primaryKPIs: [
      { label: 'Active Projects', value: '18' },
      { label: 'Pending Hearings', value: '23' },
      { label: 'Awards Sanctioned', value: '₹284 Cr' },
    ],
    keyCapabilities: [
      'Digital hearing roster and objection disposal management',
      'Automated award valuation engine (Market value + 100% Solatium)',
      'Escrow fund release to genuine land titleholders',
    ],
    actionLabel: 'Open Collector Workspace',
    actionHref: '/dashboard',
  },
  {
    id: 'role-requiring',
    role: 'Requiring Body (NHAI / IRCON / State PWD)',
    badge: 'Project Proponent',
    title: 'Proposal Indent, Escrow Funding & Possession Tracker',
    description: 'Submit online acquisition proposals, track corridor alignment approvals, deposit compensation escrow funds, and receive encumbrance-free land.',
    primaryKPIs: [
      { label: 'Proposals Filed', value: '34' },
      { label: 'Possession Taken', value: '68.4%' },
      { label: 'Deposit Deposited', value: '₹620 Cr' },
    ],
    keyCapabilities: [
      'CAD / KML linear alignment upload and parcel auto-clipping',
      'Milestone-based compensation deposit reconciliation',
      'Real-time physical handover and panchnama tracking',
    ],
    actionLabel: 'Submit / Track Proposal',
    actionHref: '#lifecycle',
  },
  {
    id: 'role-field',
    role: 'Field Survey & Verification Officer',
    badge: 'Ground Verification',
    title: 'DGPS Boundary Tagging & Asset Valuation',
    description: 'Mobile-enabled ground inspection to verify cadastral boundaries, enumerate trees/wells/structures, and capture biometric landowner consensus.',
    primaryKPIs: [
      { label: 'Parcels Tagged', value: '412' },
      { label: 'Structures Valued', value: '88' },
      { label: 'Accuracy', value: '±2 cm DGPS' },
    ],
    keyCapabilities: [
      'Mobile offline geo-tagging with drone orthomosaic overlay',
      'Tree, crop, and building asset valuation matrices',
      'Gram Sabha public notice photograph geo-timestamping',
    ],
    actionLabel: 'View Field Survey Tools',
    actionHref: '#gis-map',
  },
  {
    id: 'role-citizen',
    role: 'Affected Landowner & Family',
    badge: 'Citizen Transparency',
    title: 'Transparent Entitlements, Hearing Status & Direct DBT',
    description: 'Inspect Gazette notifications for your village, verify land parcel records, calculate statutory compensation entitlement, and monitor DBT credit.',
    primaryKPIs: [
      { label: 'Fair Compensation', value: 'Up to 4x Rural' },
      { label: 'Solatium Bonus', value: '100%' },
      { label: 'R&R Safeguard', value: 'Mandatory' },
    ],
    keyCapabilities: [
      'Instant search by Khasra / Survey Number across notified projects',
      'Transparent compensation calculation sheet with multiplier breakdown',
      'Direct online objection submission for Section 15 public hearing',
    ],
    actionLabel: 'Check My Parcel Status',
    actionHref: '#transparency',
  },
];

// ── 6. Practical AI / Risk & Delay Intelligence ───────────────────────────────

export const RISK_ANALYSIS_SUMMARY = {
  highRiskProjectsCount: 14,
  mediumRiskProjectsCount: 38,
  lowRiskProjectsCount: 1232,
  averagePredictedDelayDays: 16.4,
  criticalStatutoryAlerts: 4,
};

// ── 7. Early Warning & SLA Alerts ─────────────────────────────────────────────

export const ACQUISITION_ALERTS: AcquisitionAlert[] = [
  {
    id: 'alt-001',
    severity: 'Critical',
    category: 'Statutory SLA',
    projectId: 'DOLR-2026-0059',
    projectName: 'Lucknow Metro Line 3 Extension',
    title: 'Commercial Tenant Rehabilitation SLA Breached (-3 Days)',
    description: 'Statutory deadline for commercial relocation scheme expired. Risk of civil writ petition delaying civil construction works.',
    timestamp: 'Today, 09:15 IST',
    actionRequired: 'Collector must notify alternative commercial market plots immediately.',
  },
  {
    id: 'alt-002',
    severity: 'Critical',
    category: 'Statutory SLA',
    projectId: 'DOLR-2026-0084',
    projectName: 'NH-48 Bharatmala Six-Laning',
    title: 'Section 19 Declaration Expiring in 48 Days',
    description: 'Under Section 19(7), declaration must be published within 12 months of Section 11 notification or proceedings lapse.',
    timestamp: 'Yesterday, 14:30 IST',
    actionRequired: 'Complete remaining 23 objection hearings within 10 days.',
  },
  {
    id: 'alt-003',
    severity: 'Warning',
    category: 'Compensation',
    projectId: 'DOLR-2026-0071',
    projectName: 'Western DFC Phase 2',
    title: 'Escrow Fund Deficit Alert (₹45 Cr Required)',
    description: 'Disbursement rate will exhaust currently deposited CALA escrow funds within 14 days.',
    timestamp: '03 Sep 2026',
    actionRequired: 'DFCCIL accounts branch notified to release tranche 3 deposit.',
  },
  {
    id: 'alt-004',
    severity: 'Normal',
    category: 'Possession',
    projectId: 'DOLR-2026-0048',
    projectName: 'Rewa Solar Park Corridor',
    title: 'Sector 4 Possession Taken (120 Ha)',
    description: 'Joint panchnama completed and signed with zero pending grievances. Land mutated to State Energy Dept.',
    timestamp: '02 Sep 2026',
    actionRequired: 'Project archived in revenue audit ledger.',
  },
];

// ── 8. Statutory Documents & Audit Trail ──────────────────────────────────────

export const STATUTORY_DOCUMENTS: StatutoryDocument[] = [
  {
    id: 'doc-01',
    docNumber: 'GAZ-2026-NH48-11',
    title: 'Preliminary Notification under Section 11(1) of RFCTLARR Act 2013',
    category: 'Gazette Notice',
    projectId: 'DOLR-2026-0084',
    projectName: 'NH-48 Bharatmala Six-Laning Corridor',
    issuingAuthority: 'Competent Authority & SDM, Vadodara',
    publishedDate: '12 Feb 2026',
    fileSize: '3.4 MB',
    verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'Legally Effective',
  },
  {
    id: 'doc-02',
    docNumber: 'AWD-2026-DFC-23',
    title: 'Final Compensation Award Determination under Section 23',
    category: 'Award',
    projectId: 'DOLR-2026-0071',
    projectName: 'Western Dedicated Freight Corridor',
    issuingAuthority: 'District Collector, Jaipur',
    publishedDate: '18 Jul 2026',
    fileSize: '5.8 MB',
    verificationHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    status: 'Legally Effective',
  },
  {
    id: 'doc-03',
    docNumber: 'RR-2026-PNR-31',
    title: 'Rehabilitation & Resettlement Scheme under Section 31',
    category: 'R&R Order',
    projectId: 'DOLR-2026-0066',
    projectName: 'Pune–Nashik Semi-High Speed Rail',
    issuingAuthority: 'Administrator R&R, Govt. of Maharashtra',
    publishedDate: '29 Aug 2026',
    fileSize: '4.1 MB',
    verificationHash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    status: 'Public Scrutiny Open',
  },
  {
    id: 'doc-04',
    docNumber: 'POS-2026-RWA-38',
    title: 'Statutory Possession Certificate & Handover Panchnama',
    category: 'Possession',
    projectId: 'DOLR-2026-0048',
    projectName: 'Rewa Ultra Mega Solar Park Corridor',
    issuingAuthority: 'Competent Authority, Rewa District',
    publishedDate: '01 Sep 2026',
    fileSize: '2.2 MB',
    verificationHash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    status: 'Legally Effective',
  },
];

// ── 9. Latest Acquisition Gazette Notices & Updates ───────────────────────────

export const LATEST_UPDATES: AcquisitionUpdate[] = [
  {
    id: 'news-1',
    date: '04 Sep 2026',
    category: 'Gazette Notice',
    headline: 'Section 11(1) Preliminary Gazette Notification Published for NH-48 Six-Laning Package 4',
    summary: 'Department of Land Resources notifies 142.5 Hectares across 16 villages in Vadodara and Bharuch. 60-day window for Section 15 public objections is now open.',
    gazetteRef: 'Gazette Extra. No. 512/2026-DoLR',
    state: 'Gujarat',
  },
  {
    id: 'news-2',
    date: '02 Sep 2026',
    category: 'DBT Compensation',
    headline: '₹142 Cr Direct Compensation Credited to 640 Khatedars via PFMS Escrow Channel',
    summary: 'Electronic milestone disbursement completed for Western Dedicated Freight Corridor beneficiaries in Jaipur district with zero intermediary delay.',
    gazetteRef: 'CALA/JP/DFC/AWD-71',
    state: 'Rajasthan',
  },
  {
    id: 'news-3',
    date: '28 Aug 2026',
    category: 'R&R Progress',
    headline: 'Model Resettlement Colony Inaugurated for Pune–Nashik Rail Affected Families',
    summary: 'State R&R Administrator hands over 140 pucca housing units with community water supply, solar electrification, and pucca access roads.',
    gazetteRef: 'R&R/MahaRail/PNR-18',
    state: 'Maharashtra',
  },
  {
    id: 'news-4',
    date: '24 Aug 2026',
    category: 'Statutory Milestone',
    headline: 'AI-Assisted Delay Risk Heatmap Deployed across 320 Active National Highway Projects',
    summary: 'Machine learning decision support alerts District Collectors 30 days prior to Section 19 statutory lapse deadlines to protect public infrastructure timelines.',
    gazetteRef: 'DoLR/AI-MON/2026/08',
    state: 'National',
  },
];

// ── 10. Acquisition Transparency FAQs ─────────────────────────────────────────

export const FAQ_LIST: AcquisitionFAQ[] = [
  {
    category: 'Acquisition Process',
    question: 'What are the statutory stages of land acquisition under the RFCTLARR Act 2013?',
    answer: 'The statutory lifecycle consists of 9 stages: 1) Online Proposal by Requiring Body, 2) Administrative Scrutiny & SIA, 3) Authority Approval, 4) Section 11 Preliminary Notification in Gazette & newspapers, 5) Section 15 Objection Hearings, 6) Section 19 Final Declaration & Section 23 Award, 7) Direct Electronic Compensation Disbursement, 8) Rehabilitation & Resettlement (R&R) execution, and 9) Section 38 Encumbrance-Free Possession and Revenue Mutation.',
  },
  {
    category: 'Compensation & DBT',
    question: 'How is compensation calculated for rural and urban agricultural land?',
    answer: 'Under Section 26 to 30 of the 2013 Act, compensation is determined by taking the base market value (higher of stamp circle rate or average sale deeds), multiplying by a factor of 1.25x to 2.0x in rural areas (1.0x in urban), adding the assessed value of standing crops, trees, and buildings, and then applying an additional 100% Solatium (statutory bonus) plus 12% annual interest from notification date to award date.',
  },
  {
    category: 'Objections & Hearings',
    question: 'How can an affected landowner file an objection under Section 15?',
    answer: 'Within 60 days of the Section 11 Gazette publication, any person interested in the land may file an objection with the District Collector / CALA regarding: public purpose justification, suitability of the land, feasibility of alternative alignments, or area discrepancies. Bhu-Mitra allows landowners to track hearing dates and upload objections directly through their village CSC kiosk or the transparency portal.',
  },
  {
    category: 'R&R Entitlements',
    question: 'When can the Government take physical possession of acquired land?',
    answer: 'Under Section 38 of the RFCTLARR Act 2013, the Collector cannot take possession of acquired land until full monetary compensation has been paid or deposited, and rehabilitation and resettlement entitlements (such as alternative housing and subsistence grants for displaced families) have been substantially fulfilled.',
  },
];
