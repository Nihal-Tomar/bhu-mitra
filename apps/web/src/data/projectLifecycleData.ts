/**
 * BhuMitra — Project-Specific Statutory Lifecycle & Parcel Dossier Dataset
 * Smart India Hackathon 2026 — Problem Statement SIH26016
 *
 * Implements the relational link:
 * PROJECT -> ACQUISITION LIFECYCLE -> STATUTORY STAGE -> LAND PARCEL -> LANDOWNER / AFFECTED FAMILY -> COMPENSATION -> R&R -> POSSESSION -> REVENUE CLOSURE
 */

export interface ProjectLifecycleStage {
  step: string;
  code: string;
  title: string;
  legalSection: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Delayed';
  startDate: string;
  completionDate?: string;
  expectedDate?: string;
  authority: string;
  statutorySLA: string;
  slaDaysRemaining: number;
  isOverdue: boolean;
  documents: string[];
  affectedParcels: number;
  clearedParcels: number;
  affectedFamilies: number;
  compensationAssessedCr: number;
  compensationDisbursedCr: number;
  pendingCompensationCr: number;
  rrCompletionPct: number;
  possessionHa: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  delayPredictedDays: number;
  criticalPendingAction: string;
  delayReason?: string;
  auditTrail: { date: string; action: string; actor: string }[];
}

export interface ParcelDossier {
  id: string;
  surveyNo: string;
  projectId: string;
  projectName: string;
  state: string;
  district: string;
  village: string;
  totalAreaHa: number;
  acquiredAreaHa: number;
  classification: string;
  currentStage: string;
  stageStep: string;
  owner: string;
  ownerPhone: string;
  coOwners: string[];
  sec11Notice: { date: string; gazetteNo: string; status: string };
  sec19Declaration: { date: string; gazetteNo: string; status: string };
  objectionStatus: { filed: boolean; hearingDate?: string; outcome?: string };
  award: {
    baseRatePerHa: number;
    marketMultiplier: number;
    assetValue: number;
    solatium100Pct: number;
    interest12Pct: number;
    totalCompensation: number;
    disbursedAmount: number;
    pendingAmount: number;
    disbursalStatus: 'Disbursed (100%)' | 'Partially Paid (80%)' | 'Escrow Pending Hearing' | 'Hearing Pending' | 'Award In Calculation';
    pfmsUtr?: string;
  };
  rr: {
    affectedFamily: string;
    familyMembers: number;
    eligibility: string;
    colonyAllotted?: string;
    plotNo?: string;
    subsistenceGrantStatus: string;
    livelihoodAssistance: string;
  };
  possession: {
    status: 'Possession Taken' | 'Handover Scheduled' | 'Pending Compensation' | 'Pending R&R';
    possessionDate?: string;
    panchnamaRef?: string;
  };
  documents: { name: string; type: string; date: string; ref: string }[];
  audit: {
    lastUpdated: string;
    updatedBy: string;
    designation: string;
    changeHistory: { date: string; change: string; by: string }[];
  };
  color: string;
  coordinates: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface ProjectLifecycleProfile {
  projectId: string;
  projectName: string;
  corridorName: string;
  state: string;
  district: string;
  currentStageStep: string;
  currentStageName: string;
  totalParcels: number;
  clearedParcels: number;
  landRequiredHa: number;
  landNotifiedHa: number;
  landAwardedHa: number;
  landPossessedHa: number;
  compensationAssessedCr: number;
  compensationDisbursedCr: number;
  pendingCompensationCr: number;
  affectedFamilies: number;
  displacedFamilies: number;
  rehabilitatedFamilies: number;
  rrCompletionPct: number;
  highRiskParcels: number;
  overallProgress: number;
  stages: ProjectLifecycleStage[];
  parcels: ParcelDossier[];
}

// ── Master Project Lifecycle Profiles ──────────────────────────────────────────

export const PROJECT_LIFECYCLE_PROFILES: Record<string, ProjectLifecycleProfile> = {
  'DOLR-2026-0084': {
    projectId: 'DOLR-2026-0084',
    projectName: 'NH-48 Bharatmala Six-Laning Corridor',
    corridorName: 'Vadodara–Bharuch Highway Alignment (Package 4)',
    state: 'Gujarat',
    district: 'Vadodara & Bharuch',
    currentStageStep: '05',
    currentStageName: 'Section 15 Objection Hearings & Section 19 Preparation',
    totalParcels: 428,
    clearedParcels: 312,
    landRequiredHa: 142.5,
    landNotifiedHa: 138.2,
    landAwardedHa: 89.4,
    landPossessedHa: 68.4,
    compensationAssessedCr: 284.5,
    compensationDisbursedCr: 142.0,
    pendingCompensationCr: 142.5,
    affectedFamilies: 1240,
    displacedFamilies: 180,
    rehabilitatedFamilies: 128,
    rrCompletionPct: 71,
    highRiskParcels: 23,
    overallProgress: 52,
    stages: [
      {
        step: '01',
        code: 'PRP-01',
        title: 'Project Proposal & Alignment Indent',
        legalSection: 'Section 4(1) - Preliminary Proposal & RoW Boundary',
        status: 'Completed',
        startDate: '2023-01-15',
        completionDate: '2023-02-10',
        authority: 'National Highways Authority of India (NHAI)',
        statutorySLA: '15 Days',
        slaDaysRemaining: 0,
        isOverdue: false,
        documents: ['NHAI Form A Indent', 'Detailed Project Report (DPR)', 'Proposed RoW GIS Polygon'],
        affectedParcels: 428,
        clearedParcels: 428,
        affectedFamilies: 1240,
        compensationAssessedCr: 0,
        compensationDisbursedCr: 0,
        pendingCompensationCr: 0,
        rrCompletionPct: 0,
        possessionHa: 0,
        riskLevel: 'Low',
        delayPredictedDays: 0,
        criticalPendingAction: 'Completed: Multi-crop land restriction check satisfied; Alignment verified.',
        auditTrail: [
          { date: '2023-01-15', action: 'Online Proposal Indent Submitted by NHAI Project Director', actor: 'NHAI Vadodara PIU' },
          { date: '2023-02-10', action: 'Alignment Approved by Central Ministry Review Committee', actor: 'MoRTH Highways Committee' },
        ],
      },
      {
        step: '02',
        code: 'SIA-02',
        title: 'Administrative Scrutiny & SIA Study',
        legalSection: 'Section 4 to 8 - Social Impact Assessment & Public Hearing',
        status: 'Completed',
        startDate: '2023-02-15',
        completionDate: '2023-06-20',
        authority: 'District Collector (Vadodara) & State SIA Unit',
        statutorySLA: '180 Days',
        slaDaysRemaining: 0,
        isOverdue: false,
        documents: ['SIA Terms of Reference', 'Gram Sabha Public Consultation Minutes', 'Expert Committee SIA Appraisal'],
        affectedParcels: 428,
        clearedParcels: 428,
        affectedFamilies: 1240,
        compensationAssessedCr: 0,
        compensationDisbursedCr: 0,
        pendingCompensationCr: 0,
        rrCompletionPct: 15,
        possessionHa: 0,
        riskLevel: 'Low',
        delayPredictedDays: 0,
        criticalPendingAction: 'Completed: Expert committee approved SIA recommendations with tribal protections.',
        auditTrail: [
          { date: '2023-03-01', action: 'SIA Agency Notified under Section 4(1)', actor: 'District Collector, Vadodara' },
          { date: '2023-06-20', action: 'SIA Report Appraised & Published on Public Portal', actor: 'State SIA Directorate' },
        ],
      },
      {
        step: '03',
        code: 'NOT-03',
        title: 'Section 11(1) Preliminary Notification',
        legalSection: 'Section 11(1) - Official Gazette Publication & Transaction Freeze',
        status: 'Completed',
        startDate: '2023-07-05',
        completionDate: '2023-07-28',
        authority: 'Competent Authority for Land Acquisition (CALA)',
        statutorySLA: '30 Days',
        slaDaysRemaining: 0,
        isOverdue: false,
        documents: ['Gazette Extra. No. 512/2026-DoLR', 'Newspaper Notices (Gujarat Samachar & Divya Bhaskar)', 'Panchayat Notice Board Affidavits'],
        affectedParcels: 428,
        clearedParcels: 428,
        affectedFamilies: 1240,
        compensationAssessedCr: 284.5,
        compensationDisbursedCr: 0,
        pendingCompensationCr: 284.5,
        rrCompletionPct: 20,
        possessionHa: 0,
        riskLevel: 'Low',
        delayPredictedDays: 0,
        criticalPendingAction: 'Completed: Sub-Registrar transactions frozen across notified survey numbers.',
        auditTrail: [
          { date: '2023-07-05', action: 'Section 11(1) Gazette Notification Published in State Extra. Gazette', actor: 'CALA / SDO Vadodara' },
          { date: '2023-07-28', action: 'Public notices posted in all 14 affected Gram Panchayats', actor: 'Revenue Inspectors' },
        ],
      },
      {
        step: '04',
        code: 'OBJ-04',
        title: 'Section 15 Objections Adjudication',
        legalSection: 'Section 15(1) & 15(2) - 60-day Landowner Hearing Window',
        status: 'Completed',
        startDate: '2023-08-01',
        completionDate: '2023-11-15',
        authority: 'District Collector / Competent Authority',
        statutorySLA: '60 Days',
        slaDaysRemaining: 0,
        isOverdue: false,
        documents: ['Objection Register (Form 4)', 'CALA Section 15 Hearing Minutes', 'Valuation Multiplier Appeal Findings'],
        affectedParcels: 428,
        clearedParcels: 405,
        affectedFamilies: 1240,
        compensationAssessedCr: 284.5,
        compensationDisbursedCr: 0,
        pendingCompensationCr: 284.5,
        rrCompletionPct: 35,
        possessionHa: 0,
        riskLevel: 'Medium',
        delayPredictedDays: 0,
        criticalPendingAction: 'Completed: 405 out of 428 objections disposed; 23 remanded for multiplier review.',
        auditTrail: [
          { date: '2023-08-15', action: 'Public Hearing Sessions conducted at Padra and Karjan Taluka', actor: 'CALA Hearing Officer' },
          { date: '2023-11-15', action: 'Collector submitted Section 15(2) report to State Government', actor: 'District Collector' },
        ],
      },
      {
        step: '05',
        code: 'DEC-05',
        title: 'Section 19 Declaration & R&R Summary',
        legalSection: 'Section 19(1) - Declaration of Resettlement Area & Award Mandate',
        status: 'In Progress',
        startDate: '2024-01-10',
        expectedDate: '2024-06-30',
        authority: 'State Revenue Department & District Collector',
        statutorySLA: '12 Months from Sec. 11(1)',
        slaDaysRemaining: 8,
        isOverdue: false,
        documents: ['Section 19 Draft Declaration', 'Approved R&R Scheme Summary', 'Collector Statutory Certificate'],
        affectedParcels: 428,
        clearedParcels: 312,
        affectedFamilies: 1240,
        compensationAssessedCr: 284.5,
        compensationDisbursedCr: 142.0,
        pendingCompensationCr: 142.5,
        rrCompletionPct: 52,
        possessionHa: 0,
        riskLevel: 'High',
        delayPredictedDays: 18,
        criticalPendingAction: 'Statutory 12-month window under Section 19(7) expiring in 8 days. Collector final gazette sign-off required.',
        delayReason: 'Pending agricultural cluster multiplier revision in 23 Karjan taluka parcels.',
        auditTrail: [
          { date: '2024-01-10', action: 'Draft Section 19 declaration submitted by CALA', actor: 'SDO Vadodara' },
          { date: '2024-05-18', action: 'State Revenue Secretary review on R&R colony layout', actor: 'Revenue Dept Gandhinagar' },
        ],
      },
      {
        step: '06',
        code: 'AWD-06',
        title: 'Section 23 Award & Direct Compensation',
        legalSection: 'Section 23, 26-30 - Market Value Multiplier, 100% Solatium & DBT',
        status: 'In Progress',
        startDate: '2024-03-01',
        expectedDate: '2024-08-30',
        authority: 'CALA / Treasury / PFMS Direct Escrow',
        statutorySLA: '12 Months from Sec. 19',
        slaDaysRemaining: 45,
        isOverdue: false,
        documents: ['Section 23 Master Award Schedule', 'PFMS Electronic Transfer Mandates', '100% Solatium Calculation Sheets'],
        affectedParcels: 428,
        clearedParcels: 214,
        affectedFamilies: 1240,
        compensationAssessedCr: 284.5,
        compensationDisbursedCr: 142.0,
        pendingCompensationCr: 142.5,
        rrCompletionPct: 71,
        possessionHa: 0,
        riskLevel: 'Medium',
        delayPredictedDays: 12,
        criticalPendingAction: 'Disbursement of ₹142.5 Cr balance via PFMS to 620 verified bank accounts.',
        auditTrail: [
          { date: '2024-03-01', action: 'Interim Section 23 Award declared for 214 unencumbered parcels', actor: 'CALA Vadodara' },
          { date: '2024-04-12', action: '₹142.0 Cr credited directly to 620 Khatedars via PFMS', actor: 'State Treasury' },
        ],
      },
      {
        step: '07',
        code: 'R&R-07',
        title: 'Rehabilitation & Resettlement Scheme',
        legalSection: 'Section 31 & Second Schedule - Housing & Livelihood Grants',
        status: 'Pending',
        startDate: '2024-04-15',
        expectedDate: '2024-10-31',
        authority: 'Administrator for R&R & District Collector',
        statutorySLA: '90 Days',
        slaDaysRemaining: 72,
        isOverdue: false,
        documents: ['R&R Passbooks', 'Allotment Letters (Vikas Nagar Colony)', 'Subsistence Allowance Disbursal Roll'],
        affectedParcels: 428,
        clearedParcels: 128,
        affectedFamilies: 180,
        compensationAssessedCr: 18.5,
        compensationDisbursedCr: 13.2,
        pendingCompensationCr: 5.3,
        rrCompletionPct: 71,
        possessionHa: 0,
        riskLevel: 'Low',
        delayPredictedDays: 0,
        criticalPendingAction: 'Civil works completion for 52 remaining residential units at Vikas Nagar Colony.',
        auditTrail: [
          { date: '2024-04-15', action: 'R&R Administrator issued 128 housing allotment certificates', actor: 'R&R Administrator' },
        ],
      },
      {
        step: '08',
        code: 'POS-08',
        title: 'Section 38 Legal Possession & Handover',
        legalSection: 'Section 38 - Physical Possession Only Post-Compensation & R&R',
        status: 'Pending',
        startDate: '2024-07-01',
        expectedDate: '2024-11-30',
        authority: 'Collector / Authorized Revenue Officer & NHAI',
        statutorySLA: '15 Days post full award',
        slaDaysRemaining: 95,
        isOverdue: false,
        documents: ['Possession Panchnama', 'Joint Verification Certificate', 'NHAI Site Handover Memo'],
        affectedParcels: 428,
        clearedParcels: 185,
        affectedFamilies: 0,
        compensationAssessedCr: 0,
        compensationDisbursedCr: 0,
        pendingCompensationCr: 0,
        rrCompletionPct: 100,
        possessionHa: 68.4,
        riskLevel: 'Low',
        delayPredictedDays: 0,
        criticalPendingAction: 'Possession taken on 68.4 Ha encumbrance-free parcels; 74.1 Ha pending compensation completion.',
        auditTrail: [
          { date: '2024-07-01', action: 'Joint Panchnama completed for 68.4 Ha handover to NHAI', actor: 'Tehsildar Padra & NHAI Engineer' },
        ],
      },
      {
        step: '09',
        code: 'MUT-09',
        title: 'Revenue Mutation & Statutory Closure',
        legalSection: 'State Land Revenue Code & Section 38 - Official Record Mutation',
        status: 'Pending',
        startDate: '2024-09-01',
        expectedDate: '2025-01-31',
        authority: 'Tehsildar & Sub-Registrar',
        statutorySLA: '30 Days post possession',
        slaDaysRemaining: 150,
        isOverdue: false,
        documents: ['Final Mutation Register Extract', 'Government Record of Rights (RoR)', 'Permanent Audit Clearance'],
        affectedParcels: 428,
        clearedParcels: 110,
        affectedFamilies: 0,
        compensationAssessedCr: 0,
        compensationDisbursedCr: 0,
        pendingCompensationCr: 0,
        rrCompletionPct: 100,
        possessionHa: 32.0,
        riskLevel: 'Low',
        delayPredictedDays: 0,
        criticalPendingAction: 'Revenue entry update into Village Form 7/12 for national highway right-of-way.',
        auditTrail: [
          { date: '2024-09-01', action: 'Mutation proceedings initiated for Village Padra RoW', actor: 'Mamlatdar Office' },
        ],
      },
    ],
    parcels: [
      {
        id: '103-10',
        surveyNo: '103/10',
        projectId: 'DOLR-2026-0084',
        projectName: 'NH-48 Bharatmala Six-Laning Corridor',
        state: 'Gujarat',
        district: 'Vadodara',
        village: 'Padra Village',
        totalAreaHa: 1.42,
        acquiredAreaHa: 0.95,
        classification: 'Irrigated Agricultural (Double Crop Wheat/Cotton)',
        currentStage: '05 - Section 15 Objection Hearing Completed',
        stageStep: '05',
        owner: 'Shri Ramchandra Patil',
        ownerPhone: '+91 98251 44556',
        coOwners: ['Smt. Shobhaben Patil (20%)', 'Shri Dinesh Patil (20%)'],
        sec11Notice: {
          date: '2023-07-05',
          gazetteNo: 'Gazette Extra. No. 512/2026-DoLR',
          status: 'Published & Served',
        },
        sec19Declaration: {
          date: '2024-01-10',
          gazetteNo: 'Gazette Sec. 19 No. 88/2024',
          status: 'Draft Notified',
        },
        objectionStatus: {
          filed: true,
          hearingDate: '2023-09-12',
          outcome: 'Commercial multiplier appeal dismissed; 1.25x rural multiplier sustained.',
        },
        award: {
          baseRatePerHa: 1420000,
          marketMultiplier: 1.25,
          assetValue: 550000,
          solatium100Pct: 1775000,
          interest12Pct: 235000,
          totalCompensation: 4850000,
          disbursedAmount: 3880000,
          pendingAmount: 970000,
          disbursalStatus: 'Partially Paid (80%)',
          pfmsUtr: 'PFMS-2026-98124501',
        },
        rr: {
          affectedFamily: 'Ramchandra Patil Family',
          familyMembers: 6,
          eligibility: 'Eligible: Resettlement Plot #24 Allocated',
          colonyAllotted: 'Vikas Nagar Resettlement Colony, Padra',
          plotNo: 'Plot #24-B (200 sq.m)',
          subsistenceGrantStatus: 'Sanctioned & 1st Tranche Paid (₹50,000)',
          livelihoodAssistance: 'Dairy Skill Development Grant Sanctioned',
        },
        possession: {
          status: 'Pending Compensation',
          possessionDate: 'Scheduled 15 Oct 2026',
          panchnamaRef: 'Draft Panchnama Prepared',
        },
        documents: [
          { name: 'Section 11 Gazette Notice', type: 'PDF', date: '2023-07-05', ref: 'GAZ-512-GJ-0084' },
          { name: 'Section 15 Hearing Order', type: 'PDF', date: '2023-09-15', ref: 'CALA-ORD-103-10' },
          { name: 'Interim Compensation Advice', type: 'PFMS Slip', date: '2024-04-12', ref: 'PFMS-UTR-98124501' },
          { name: 'R&R Plot Allotment Letter', type: 'PDF', date: '2024-04-20', ref: 'RR-ALLOT-P24' },
        ],
        audit: {
          lastUpdated: '2026-09-08 14:32 IST',
          updatedBy: 'Shri Rajesh Sharma, IAS',
          designation: 'District Collector & Head CALA',
          changeHistory: [
            { date: '2023-07-05', change: 'Section 11 Preliminary Notification Tagged', by: 'Revenue Inspector' },
            { date: '2023-09-15', change: 'Section 15 Hearing Disposed', by: 'SDO / CALA' },
            { date: '2024-04-12', change: 'PFMS 80% Interim Disbursal Cleared', by: 'Treasury Officer' },
          ],
        },
        color: '#F59E0B',
        coordinates: "22°18'42.1\"N, 73°11'24.8\"E",
        riskLevel: 'Medium',
      },
      {
        id: '102-1A',
        surveyNo: '102/1A',
        projectId: 'DOLR-2026-0084',
        projectName: 'NH-48 Bharatmala Six-Laning Corridor',
        state: 'Gujarat',
        district: 'Vadodara',
        village: 'Padra Village',
        totalAreaHa: 0.88,
        acquiredAreaHa: 0.88,
        classification: 'Agricultural (Dry Crop Millet)',
        currentStage: '04 - Section 11(1) Preliminary Notified',
        stageStep: '04',
        owner: 'Smt. Kamlaben Rathod',
        ownerPhone: '+91 98252 66778',
        coOwners: ['Self (100% Sole Titleholder)'],
        sec11Notice: {
          date: '2023-07-05',
          gazetteNo: 'Gazette Extra. No. 512/2026-DoLR',
          status: 'Published & Served',
        },
        sec19Declaration: {
          date: 'Pending',
          gazetteNo: 'Awaiting Hearing Resolution',
          status: 'Pending',
        },
        objectionStatus: {
          filed: true,
          hearingDate: '2026-09-12',
          outcome: 'Hearing scheduled for R&R housing grant appeal under RFCTLARR Second Schedule.',
        },
        award: {
          baseRatePerHa: 1250000,
          marketMultiplier: 1.25,
          assetValue: 320000,
          solatium100Pct: 1562500,
          interest12Pct: 188000,
          totalCompensation: 3240000,
          disbursedAmount: 0,
          pendingAmount: 3240000,
          disbursalStatus: 'Hearing Pending',
          pfmsUtr: 'PFMS-HOLD-SEC15',
        },
        rr: {
          affectedFamily: 'Kamlaben Rathod Family',
          familyMembers: 4,
          eligibility: 'Alternative Dwelling Entitlement Applied (Full Displacement)',
          colonyAllotted: 'Under Review at Vikas Nagar Enclave',
          subsistenceGrantStatus: 'Pending Final Verification',
          livelihoodAssistance: 'One-time resettlement grant applied',
        },
        possession: {
          status: 'Pending Compensation',
          possessionDate: 'Awaiting Hearing Disposal',
        },
        documents: [
          { name: 'Section 11 Gazette Notice', type: 'PDF', date: '2023-07-05', ref: 'GAZ-512-GJ-0084' },
          { name: 'Section 15 Hearing Notice', type: 'Summons', date: '2026-08-20', ref: 'HRG-2026-0042' },
        ],
        audit: {
          lastUpdated: '2026-08-20 11:15 IST',
          updatedBy: 'Smt. Priya Meena, RAS',
          designation: 'Competent Authority (CALA)',
          changeHistory: [
            { date: '2023-07-05', change: 'Section 11 Preliminary Notification Tagged', by: 'Revenue Inspector' },
            { date: '2026-08-20', change: 'Objection filed under Section 15 for dwelling entitlement', by: 'Citizen Portal' },
          ],
        },
        color: '#EF4444',
        coordinates: "22°18'45.6\"N, 73°11'29.2\"E",
        riskLevel: 'High',
      },
      {
        id: '104-B',
        surveyNo: '104/B',
        projectId: 'DOLR-2026-0084',
        projectName: 'NH-48 Bharatmala Six-Laning Corridor',
        state: 'Gujarat',
        district: 'Vadodara',
        village: 'Karjan Gram',
        totalAreaHa: 2.10,
        acquiredAreaHa: 1.15,
        classification: 'Agricultural with Tube Well & Orchards',
        currentStage: '06 - Compensation Disbursed (Direct Transfer)',
        stageStep: '06',
        owner: 'Shri Govindbhai Solanki',
        ownerPhone: '+91 98253 88990',
        coOwners: ['Shri Bharat Solanki (50%)'],
        sec11Notice: {
          date: '2023-07-05',
          gazetteNo: 'Gazette Extra. No. 512/2026-DoLR',
          status: 'Published & Served',
        },
        sec19Declaration: {
          date: '2024-01-10',
          gazetteNo: 'Gazette Sec. 19 No. 88/2024',
          status: 'Published',
        },
        objectionStatus: {
          filed: false,
          outcome: 'No objections raised; consent award executed.',
        },
        award: {
          baseRatePerHa: 2840000,
          marketMultiplier: 1.25,
          assetValue: 840000,
          solatium100Pct: 3550000,
          interest12Pct: 460000,
          totalCompensation: 7680000,
          disbursedAmount: 7680000,
          pendingAmount: 0,
          disbursalStatus: 'Disbursed (100%)',
          pfmsUtr: 'PFMS-2026-98124502',
        },
        rr: {
          affectedFamily: 'Govindbhai Solanki Family',
          familyMembers: 5,
          eligibility: 'Self-Relocation Grant Sanctioned',
          subsistenceGrantStatus: '100% Paid (₹1,50,000)',
          livelihoodAssistance: 'Completed (Self-Relocation)',
        },
        possession: {
          status: 'Handover Scheduled',
          possessionDate: 'Scheduled 25 Sep 2026',
          panchnamaRef: 'Joint Notice Served',
        },
        documents: [
          { name: 'Section 11 Gazette Notice', type: 'PDF', date: '2023-07-05', ref: 'GAZ-512-GJ-0084' },
          { name: 'Section 19 Declaration', type: 'PDF', date: '2024-01-10', ref: 'GAZ-SEC19-88' },
          { name: 'Section 23 Consent Award', type: 'PDF', date: '2024-03-22', ref: 'AWD-SEC23-104B' },
          { name: 'PFMS Final Disbursal Slip', type: 'PFMS Slip', date: '2024-04-10', ref: 'PFMS-UTR-98124502' },
        ],
        audit: {
          lastUpdated: '2026-04-10 16:00 IST',
          updatedBy: 'Compensation Officer',
          designation: 'Accounts Officer (CALA Vadodara)',
          changeHistory: [
            { date: '2023-07-05', change: 'Section 11 Published', by: 'CALA' },
            { date: '2024-03-22', change: 'Award Passed', by: 'Collector' },
            { date: '2024-04-10', change: '100% Payment Credited via PFMS', by: 'Treasury' },
          ],
        },
        color: '#3B82F6',
        coordinates: "22°18'39.4\"N, 73°11'21.3\"E",
        riskLevel: 'Low',
      },
      {
        id: '105-C',
        surveyNo: '105/C',
        projectId: 'DOLR-2026-0084',
        projectName: 'NH-48 Bharatmala Six-Laning Corridor',
        state: 'Gujarat',
        district: 'Vadodara',
        village: 'Karjan Gram',
        totalAreaHa: 4.60,
        acquiredAreaHa: 2.40,
        classification: 'Community Gauchar (Grazing Land)',
        currentStage: '08 - Section 38 Possession Completed',
        stageStep: '08',
        owner: 'Gram Panchayat Karjan Common Body',
        ownerPhone: '+91 98250 99881',
        coOwners: ['Gram Sabha Trustees'],
        sec11Notice: {
          date: '2023-07-05',
          gazetteNo: 'Gazette Extra. No. 512/2026-DoLR',
          status: 'Published & Served',
        },
        sec19Declaration: {
          date: '2024-01-10',
          gazetteNo: 'Gazette Sec. 19 No. 88/2024',
          status: 'Published',
        },
        objectionStatus: {
          filed: false,
          outcome: 'Panchayat Resolution 42/2023 consenting to compensatory grazing land.',
        },
        award: {
          baseRatePerHa: 2200000,
          marketMultiplier: 1.25,
          assetValue: 0,
          solatium100Pct: 5500000,
          interest12Pct: 700000,
          totalCompensation: 11200000,
          disbursedAmount: 11200000,
          pendingAmount: 0,
          disbursalStatus: 'Disbursed (100%)',
          pfmsUtr: 'PFMS-2026-PANCHAYAT-01',
        },
        rr: {
          affectedFamily: 'Karjan Gram Panchayat Village Community',
          familyMembers: 0,
          eligibility: 'Compensatory Grazing Land Allotted in Village 043 (3.0 Ha)',
          colonyAllotted: 'Compensatory Village Pasture Allotment',
          subsistenceGrantStatus: 'Escrow Deposited to Panchayat Fund',
          livelihoodAssistance: 'Not Applicable (Community Land)',
        },
        possession: {
          status: 'Possession Taken',
          possessionDate: '2024-07-01',
          panchnamaRef: 'Panchnama No. VAD-SEC38-042',
        },
        documents: [
          { name: 'Section 11 Gazette Notice', type: 'PDF', date: '2023-07-05', ref: 'GAZ-512-GJ-0084' },
          { name: 'Gram Sabha Resolution', type: 'Resolution', date: '2023-08-10', ref: 'RES-KARJAN-42' },
          { name: 'Section 38 Possession Certificate', type: 'Certificate', date: '2024-07-01', ref: 'POSS-VAD-38-042' },
        ],
        audit: {
          lastUpdated: '2024-07-01 10:30 IST',
          updatedBy: 'Tehsildar Karjan',
          designation: 'Sub-Divisional Revenue Officer',
          changeHistory: [
            { date: '2023-07-05', change: 'Section 11 Notified', by: 'CALA' },
            { date: '2024-04-15', change: 'Panchayat Escrow Credited', by: 'Treasury' },
            { date: '2024-07-01', change: 'Section 38 Possession Executed', by: 'Tehsildar' },
          ],
        },
        color: '#10B981',
        coordinates: "22°18'35.0\"N, 73°11'15.0\"E",
        riskLevel: 'Low',
      },
    ],
  },
  'DOLR-2026-0071': {
    projectId: 'DOLR-2026-0071',
    projectName: 'Western Dedicated Freight Corridor (Phase 2)',
    corridorName: 'Rewari to Madar High-Capacity Freight Rail Section',
    state: 'Rajasthan',
    district: 'Alwar & Jaipur',
    currentStageStep: '05',
    currentStageName: 'Section 19 Declaration Published & Award Inquiry',
    totalParcels: 610,
    clearedParcels: 412,
    landRequiredHa: 310.0,
    landNotifiedHa: 304.5,
    landAwardedHa: 210.8,
    landPossessedHa: 195.0,
    compensationAssessedCr: 540.0,
    compensationDisbursedCr: 380.5,
    pendingCompensationCr: 159.5,
    affectedFamilies: 2180,
    displacedFamilies: 320,
    rehabilitatedFamilies: 280,
    rrCompletionPct: 88,
    highRiskParcels: 14,
    overallProgress: 64,
    stages: [
      {
        step: '01', code: 'PRP-01', title: 'Proposal & Rail Alignment', legalSection: 'Section 4(1)',
        status: 'Completed', startDate: '2021-08-01', completionDate: '2021-09-10', authority: 'DFCCIL / Ministry of Railways',
        statutorySLA: '15 Days', slaDaysRemaining: 0, isOverdue: false, documents: ['DFCCIL Indent', 'Rail Alignment DPR'],
        affectedParcels: 610, clearedParcels: 610, affectedFamilies: 2180, compensationAssessedCr: 0, compensationDisbursedCr: 0, pendingCompensationCr: 0, rrCompletionPct: 0, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'Completed: Rail corridor alignment confirmed.', auditTrail: []
      },
      {
        step: '02', code: 'SIA-02', title: 'Administrative Scrutiny & SIA', legalSection: 'Section 4-8',
        status: 'Completed', startDate: '2021-09-15', completionDate: '2022-02-10', authority: 'Collector Alwar / Jaipur',
        statutorySLA: '180 Days', slaDaysRemaining: 0, isOverdue: false, documents: ['SIA Report', 'Public Hearing Minutes'],
        affectedParcels: 610, clearedParcels: 610, affectedFamilies: 2180, compensationAssessedCr: 0, compensationDisbursedCr: 0, pendingCompensationCr: 0, rrCompletionPct: 20, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'Completed: SIA report cleared by Expert Committee.', auditTrail: []
      },
      {
        step: '03', code: 'NOT-03', title: 'Section 11(1) Preliminary Notice', legalSection: 'Section 11(1)',
        status: 'Completed', startDate: '2022-03-01', completionDate: '2022-03-25', authority: 'Competent Authority (Railways)',
        statutorySLA: '30 Days', slaDaysRemaining: 0, isOverdue: false, documents: ['Gazette Sec. 11 No. 301/2022'],
        affectedParcels: 610, clearedParcels: 610, affectedFamilies: 2180, compensationAssessedCr: 540.0, compensationDisbursedCr: 0, pendingCompensationCr: 540.0, rrCompletionPct: 25, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'Completed: Notified in Rajasthan Gazette.', auditTrail: []
      },
      {
        step: '04', code: 'OBJ-04', title: 'Section 15 Objections', legalSection: 'Section 15',
        status: 'Completed', startDate: '2022-04-01', completionDate: '2022-06-30', authority: 'Competent Authority (CALA)',
        statutorySLA: '60 Days', slaDaysRemaining: 0, isOverdue: false, documents: ['Objection Disposal Summary'],
        affectedParcels: 610, clearedParcels: 596, affectedFamilies: 2180, compensationAssessedCr: 540.0, compensationDisbursedCr: 0, pendingCompensationCr: 540.0, rrCompletionPct: 40, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'Completed: 596 objections settled.', auditTrail: []
      },
      {
        step: '05', code: 'DEC-05', title: 'Section 19 Declaration', legalSection: 'Section 19(1)',
        status: 'Completed', startDate: '2023-01-15', completionDate: '2023-02-28', authority: 'State Revenue Department',
        statutorySLA: '12 Months from Sec. 11', slaDaysRemaining: 0, isOverdue: false, documents: ['Gazette Sec. 19 No. 44/2023'],
        affectedParcels: 610, clearedParcels: 610, affectedFamilies: 2180, compensationAssessedCr: 540.0, compensationDisbursedCr: 0, pendingCompensationCr: 540.0, rrCompletionPct: 60, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'Completed: Gazette Sec. 19 published.', auditTrail: []
      },
      {
        step: '06', code: 'AWD-06', title: 'Section 23 Award & Compensation', legalSection: 'Section 23 & 30',
        status: 'In Progress', startDate: '2023-03-15', expectedDate: '2024-09-30', authority: 'CALA / DFCCIL Escrow',
        statutorySLA: '12 Months from Sec. 19', slaDaysRemaining: 24, isOverdue: false, documents: ['Award Statements', 'PFMS UTRs'],
        affectedParcels: 610, clearedParcels: 412, affectedFamilies: 2180, compensationAssessedCr: 540.0, compensationDisbursedCr: 380.5, pendingCompensationCr: 159.5, rrCompletionPct: 88, possessionHa: 0, riskLevel: 'Medium', delayPredictedDays: 9, criticalPendingAction: '14 court appeals pending regarding tree/well valuation multipliers in Kotputli tehsil.', auditTrail: []
      },
      {
        step: '07', code: 'R&R-07', title: 'R&R Implementation', legalSection: 'Section 31',
        status: 'In Progress', startDate: '2023-05-01', expectedDate: '2024-11-30', authority: 'Administrator R&R',
        statutorySLA: '90 Days', slaDaysRemaining: 30, isOverdue: false, documents: ['Kalyan Nagar Allotment Records'],
        affectedParcels: 610, clearedParcels: 280, affectedFamilies: 320, compensationAssessedCr: 32.0, compensationDisbursedCr: 28.5, pendingCompensationCr: 3.5, rrCompletionPct: 88, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: '280 of 320 displaced families relocated to Kalyan Nagar Resettlement Colony.', auditTrail: []
      },
      {
        step: '08', code: 'POS-08', title: 'Section 38 Possession', legalSection: 'Section 38',
        status: 'In Progress', startDate: '2023-08-01', expectedDate: '2024-12-31', authority: 'Collector / DFCCIL',
        statutorySLA: 'Post 100% Compensation', slaDaysRemaining: 60, isOverdue: false, documents: ['Handover Certificate 195 Ha'],
        affectedParcels: 610, clearedParcels: 412, affectedFamilies: 0, compensationAssessedCr: 0, compensationDisbursedCr: 0, pendingCompensationCr: 0, rrCompletionPct: 100, possessionHa: 195.0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: '195.0 Ha possessed and handed to DFCCIL contractors.', auditTrail: []
      },
      {
        step: '09', code: 'MUT-09', title: 'Revenue Mutation', legalSection: 'Land Revenue Code',
        status: 'Pending', startDate: '2024-01-01', expectedDate: '2025-06-30', authority: 'Tehsildar Kotputli & Behror',
        statutorySLA: '30 Days', slaDaysRemaining: 180, isOverdue: false, documents: ['Draft Mutation Rolls'],
        affectedParcels: 610, clearedParcels: 140, affectedFamilies: 0, compensationAssessedCr: 0, compensationDisbursedCr: 0, pendingCompensationCr: 0, rrCompletionPct: 100, possessionHa: 80.0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'Mutation underway for completed track sections.', auditTrail: []
      },
    ],
    parcels: [
      {
        id: '218-4',
        surveyNo: '218/4',
        projectId: 'DOLR-2026-0071',
        projectName: 'Western Dedicated Freight Corridor (Phase 2)',
        state: 'Rajasthan',
        district: 'Jaipur',
        village: 'Kotputli',
        totalAreaHa: 1.80,
        acquiredAreaHa: 1.80,
        classification: 'Agricultural (Irrigated Tube Well)',
        currentStage: '06 - Compensation Disbursed (100%)',
        stageStep: '06',
        owner: 'Smt. Sharda Devi Meena',
        ownerPhone: '+91 94140 11223',
        coOwners: ['Shri Jagdish Meena (Co-Sharer)'],
        sec11Notice: { date: '2022-03-01', gazetteNo: 'Gazette Sec. 11 No. 301/2022', status: 'Published & Served' },
        sec19Declaration: { date: '2023-01-15', gazetteNo: 'Gazette Sec. 19 No. 44/2023', status: 'Published' },
        objectionStatus: { filed: false, outcome: 'No dispute; award accepted.' },
        award: {
          baseRatePerHa: 3200000, marketMultiplier: 1.50, assetValue: 620000, solatium100Pct: 4800000,
          interest12Pct: 620000, totalCompensation: 10220000, disbursedAmount: 10220000, pendingAmount: 0,
          disbursalStatus: 'Disbursed (100%)', pfmsUtr: 'PFMS-2026-98124503'
        },
        rr: {
          affectedFamily: 'Sharda Devi Meena Family', familyMembers: 5,
          eligibility: 'Plot Allotted at Kalyan Nagar Resettlement Colony',
          colonyAllotted: 'Kalyan Nagar Resettlement Colony, Kotputli', plotNo: 'Plot #18',
          subsistenceGrantStatus: '100% Disbursed', livelihoodAssistance: 'Agricultural livelihood package'
        },
        possession: { status: 'Possession Taken', possessionDate: '2023-11-20', panchnamaRef: 'POSS-DFC-218-4' },
        documents: [
          { name: 'Section 11 Gazette Notice', type: 'PDF', date: '2022-03-01', ref: 'GAZ-301-RJ-2022' },
          { name: 'Award Statement Form 7', type: 'PDF', date: '2023-04-10', ref: 'AWD-DFC-218-4' },
          { name: 'PFMS Disbursal Advice', type: 'PFMS Slip', date: '2023-05-18', ref: 'PFMS-UTR-98124503' }
        ],
        audit: {
          lastUpdated: '2023-11-20 15:00 IST', updatedBy: 'CALA DFCCIL Jaipur', designation: 'Competent Authority',
          changeHistory: [{ date: '2023-11-20', change: 'Section 38 Possession memo signed', by: 'Tehsildar Kotputli' }]
        },
        color: '#10B981',
        coordinates: "27°42'12.4\"N, 76°11'45.0\"E",
        riskLevel: 'Low'
      }
    ]
  },
  'DOLR-2026-0066': {
    projectId: 'DOLR-2026-0066',
    projectName: 'Pune–Nashik Semi-High Speed Rail Corridor',
    corridorName: 'Pune–Nashik Semi-High Speed Alignment via Chakan & Sangamner',
    state: 'Maharashtra',
    district: 'Pune & Ahmednagar',
    currentStageStep: '04',
    currentStageName: 'Section 11 Gazette Notification & Section 15 Hearing Prep',
    totalParcels: 512,
    clearedParcels: 310,
    landRequiredHa: 218.7,
    landNotifiedHa: 218.7,
    landAwardedHa: 45.2,
    landPossessedHa: 45.2,
    compensationAssessedCr: 412.0,
    compensationDisbursedCr: 88.0,
    pendingCompensationCr: 324.0,
    affectedFamilies: 1840,
    displacedFamilies: 140,
    rehabilitatedFamilies: 42,
    rrCompletionPct: 42,
    highRiskParcels: 8,
    overallProgress: 42,
    stages: [
      {
        step: '01', code: 'PRP-01', title: 'Proposal & Semi-HSR Alignment', legalSection: 'Section 4(1)',
        status: 'Completed', startDate: '2023-05-10', completionDate: '2023-06-15', authority: 'MahaRail (MRIDC)',
        statutorySLA: '15 Days', slaDaysRemaining: 0, isOverdue: false, documents: ['MahaRail DPR', 'Alignment Survey'],
        affectedParcels: 512, clearedParcels: 512, affectedFamilies: 1840, compensationAssessedCr: 0, compensationDisbursedCr: 0, pendingCompensationCr: 0, rrCompletionPct: 0, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'Completed.', auditTrail: []
      },
      {
        step: '02', code: 'SIA-02', title: 'Administrative Scrutiny & SIA', legalSection: 'Section 4-8',
        status: 'Completed', startDate: '2023-07-01', completionDate: '2023-12-15', authority: 'Collector Pune',
        statutorySLA: '180 Days', slaDaysRemaining: 0, isOverdue: false, documents: ['SIA Report', 'Gokhale Institute Study'],
        affectedParcels: 512, clearedParcels: 512, affectedFamilies: 1840, compensationAssessedCr: 0, compensationDisbursedCr: 0, pendingCompensationCr: 0, rrCompletionPct: 15, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'Completed: SIA cleared for Chakan corridor.', auditTrail: []
      },
      {
        step: '03', code: 'NOT-03', title: 'Section 11(1) Preliminary Notice', legalSection: 'Section 11(1)',
        status: 'Completed', startDate: '2024-01-20', completionDate: '2024-02-15', authority: 'Collector Pune / MahaRail',
        statutorySLA: '30 Days', slaDaysRemaining: 0, isOverdue: false, documents: ['Maharashtra Gazette Sec 11 No. 102/2024'],
        affectedParcels: 512, clearedParcels: 512, affectedFamilies: 1840, compensationAssessedCr: 412.0, compensationDisbursedCr: 0, pendingCompensationCr: 412.0, rrCompletionPct: 20, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'Completed.', auditTrail: []
      },
      {
        step: '04', code: 'OBJ-04', title: 'Section 15 Hearings & Objections', legalSection: 'Section 15',
        status: 'In Progress', startDate: '2024-03-01', expectedDate: '2024-06-30', authority: 'SDO Haveli / Chakan',
        statutorySLA: '60 Days', slaDaysRemaining: 45, isOverdue: false, documents: ['Objection Register Haveli'],
        affectedParcels: 512, clearedParcels: 310, affectedFamilies: 1840, compensationAssessedCr: 412.0, compensationDisbursedCr: 88.0, pendingCompensationCr: 324.0, rrCompletionPct: 42, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'Scheduled Section 15 hearings ongoing in Haveli tehsil.', auditTrail: []
      },
      {
        step: '05', code: 'DEC-05', title: 'Section 19 Declaration', legalSection: 'Section 19(1)',
        status: 'Pending', startDate: '2024-07-01', expectedDate: '2024-10-31', authority: 'Revenue Dept Maharashtra',
        statutorySLA: '12 Months from Sec. 11', slaDaysRemaining: 180, isOverdue: false, documents: ['Draft Declaration'],
        affectedParcels: 512, clearedParcels: 0, affectedFamilies: 1840, compensationAssessedCr: 412.0, compensationDisbursedCr: 0, pendingCompensationCr: 412.0, rrCompletionPct: 45, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'To be notified after Section 15 conclusion.', auditTrail: []
      },
      {
        step: '06', code: 'AWD-06', title: 'Section 23 Award & Compensation', legalSection: 'Section 23',
        status: 'Pending', startDate: '2024-11-01', expectedDate: '2025-04-30', authority: 'CALA Pune',
        statutorySLA: '12 Months from Sec. 19', slaDaysRemaining: 240, isOverdue: false, documents: [],
        affectedParcels: 512, clearedParcels: 0, affectedFamilies: 1840, compensationAssessedCr: 412.0, compensationDisbursedCr: 0, pendingCompensationCr: 412.0, rrCompletionPct: 50, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'Valuation formulas in preparation.', auditTrail: []
      },
      {
        step: '07', code: 'R&R-07', title: 'R&R Implementation', legalSection: 'Section 31',
        status: 'Pending', startDate: '2025-01-01', expectedDate: '2025-06-30', authority: 'R&R Administrator',
        statutorySLA: '90 Days', slaDaysRemaining: 300, isOverdue: false, documents: [],
        affectedParcels: 512, clearedParcels: 0, affectedFamilies: 140, compensationAssessedCr: 14.0, compensationDisbursedCr: 0, pendingCompensationCr: 14.0, rrCompletionPct: 50, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'Shri Samarth Resettlement Enclave site layout under approval.', auditTrail: []
      },
      {
        step: '08', code: 'POS-08', title: 'Section 38 Possession', legalSection: 'Section 38',
        status: 'Pending', startDate: '2025-05-01', expectedDate: '2025-09-30', authority: 'Collector Pune',
        statutorySLA: '15 Days post award', slaDaysRemaining: 360, isOverdue: false, documents: [],
        affectedParcels: 512, clearedParcels: 0, affectedFamilies: 0, compensationAssessedCr: 0, compensationDisbursedCr: 0, pendingCompensationCr: 0, rrCompletionPct: 100, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'Awaiting award.', auditTrail: []
      },
      {
        step: '09', code: 'MUT-09', title: 'Revenue Mutation', legalSection: 'Maharashtra Land Revenue Code',
        status: 'Pending', startDate: '2025-08-01', expectedDate: '2025-12-31', authority: 'Tehsildar',
        statutorySLA: '30 Days', slaDaysRemaining: 400, isOverdue: false, documents: [],
        affectedParcels: 512, clearedParcels: 0, affectedFamilies: 0, compensationAssessedCr: 0, compensationDisbursedCr: 0, pendingCompensationCr: 0, rrCompletionPct: 100, possessionHa: 0, riskLevel: 'Low', delayPredictedDays: 0, criticalPendingAction: 'Pending possession.', auditTrail: []
      },
    ],
    parcels: []
  }
};

export function getProjectLifecycle(projectId: string): ProjectLifecycleProfile {
  if (PROJECT_LIFECYCLE_PROFILES[projectId]) {
    return PROJECT_LIFECYCLE_PROFILES[projectId];
  }
  return PROJECT_LIFECYCLE_PROFILES['DOLR-2026-0084'];
}
