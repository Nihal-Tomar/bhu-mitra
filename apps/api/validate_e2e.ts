/**
 * BhuMitra Comprehensive System-Level E2E Validation & SIH Readiness Test Suite
 */
import { PrismaClient } from '@prisma/client';

const API_BASE = 'http://localhost:3001/api/v1';

interface TestResult {
  category: string;
  testName: string;
  status: 'PASS' | 'FAIL';
  details: string;
}

const results: TestResult[] = [];

function record(category: string, testName: string, passed: boolean, details: string) {
  const status = passed ? 'PASS' : 'FAIL';
  results.push({ category, testName, status, details });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${category}] ${testName}: ${details}`);
}

async function api(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  let json: any = null;
  const text = await res.text();
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  const data = json && typeof json === 'object' && 'data' in json ? json.data : json;
  return { status: res.status, ok: res.ok, raw: json, data };
}

async function run() {
  console.log('================================================================');
  console.log('  BHUMITRA — FINAL END-TO-END VALIDATION & VERIFICATION PASS');
  console.log('================================================================\n');

  // Direct database client for independent verification
  const prisma = new PrismaClient({
    datasources: {
      db: { url: 'postgresql://bhumitra:bhumitra_secure_dev@127.0.0.1:54329/bhumitra?schema=public' },
    },
  });
  await prisma.$connect();

  // ───────────────────────────────────────────────────────────────────────────
  // 1. HEALTH & DATABASE CONNECTIVITY
  // ───────────────────────────────────────────────────────────────────────────
  console.log('--- 1. Health & Database Connectivity ---');
  const healthRes = await api('/health');
  const healthData = healthRes.data?.data || healthRes.data;
  record(
    'HEALTH',
    'Health Check Endpoint',
    healthRes.status === 200 && healthData?.status === 'healthy',
    `Status ${healthRes.status}, DB: ${healthData?.services?.database?.status} (${healthData?.services?.database?.details})`,
  );

  const dbPing = await prisma.$queryRaw<any[]>`SELECT current_database(), version()`;
  record(
    'DATABASE',
    'Direct PostgreSQL Query',
    dbPing.length > 0,
    `Connected to DB: ${dbPing[0]?.current_database}, version: ${String(dbPing[0]?.version).substring(0, 30)}...`,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // 2. AUTHENTICATION TEST MATRIX
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- 2. Authentication Test Matrix ---');
  
  // Valid Logins for Seeded Roles
  const rolesToTest = [
    { name: 'District Collector', email: 'rajesh.sharma@ias.gov.in', role: 'DISTRICT_COLLECTOR' },
    { name: 'CALA Officer', email: 'priya.meena@ras.gov.in', role: 'CALA' },
    { name: 'Joint Secretary (DoLR)', email: 'alok.kumar@nic.in', role: 'JOINT_SECRETARY' },
    { name: 'State Nodal Officer', email: 'sunil.patil@mahagov.in', role: 'STATE_NODAL_OFFICER' },
    { name: 'Tehsildar / SDO', email: 'amit.verma@uprevenue.gov.in', role: 'TEHSILDAR' },
    { name: 'Platform Admin', email: 'admin@bhumitra.gov.in', role: 'SUPER_ADMIN' },
  ];

  const tokens: Record<string, string> = {};

  for (const officer of rolesToTest) {
    const loginRes = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: officer.email, password: 'Bhumitra@2026' }),
    });
    const token = loginRes.data?.accessToken;
    if (token) tokens[officer.role] = token;
    record(
      'AUTH',
      `Login Valid (${officer.name})`,
      loginRes.status === 200 && !!token,
      `Token issued: ${token ? token.substring(0, 20) + '...' : 'NONE'}, Role: ${loginRes.data?.user?.role}`,
    );
  }

  // Current User Endpoint (/auth/me)
  const meRes = await api('/auth/me', {
    headers: { Authorization: `Bearer ${tokens['DISTRICT_COLLECTOR']}` },
  });
  record(
    'AUTH',
    'Get Current User Profile (/auth/me)',
    meRes.status === 200 && meRes.data?.officerId === 'GJ-DM-VD-0042',
    `Officer: ${meRes.data?.name}, District: ${meRes.data?.districtName || meRes.data?.jurisdiction}`,
  );

  // Invalid Logins
  const wrongPasswordRes = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'rajesh.sharma@ias.gov.in', password: 'WrongPassword123' }),
  });
  record(
    'AUTH',
    'Reject Invalid Password',
    wrongPasswordRes.status === 401,
    `Status ${wrongPasswordRes.status} (Expected 401)`,
  );

  const unknownUserRes = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'nonexistent.officer@gov.in', password: 'Bhumitra@2026' }),
  });
  record(
    'AUTH',
    'Reject Unknown User',
    unknownUserRes.status === 401,
    `Status ${unknownUserRes.status} (Expected 401)`,
  );

  const missingCredsRes = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({}),
  });
  record(
    'AUTH',
    'Reject Missing Credentials',
    missingCredsRes.status === 400,
    `Status ${missingCredsRes.status} (Expected 400)`,
  );

  // Token Tests
  const noTokenRes = await api('/auth/me');
  record(
    'AUTH',
    'Reject Request Without Token',
    noTokenRes.status === 401,
    `Status ${noTokenRes.status} (Expected 401)`,
  );

  const invalidTokenRes = await api('/auth/me', {
    headers: { Authorization: 'Bearer this-is-a-completely-bogus-token' },
  });
  record(
    'AUTH',
    'Reject Invalid Token',
    invalidTokenRes.status === 401,
    `Status ${invalidTokenRes.status} (Expected 401)`,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // 3. RBAC & JURISDICTION SECURITY
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- 3. RBAC & Jurisdiction Security ---');

  // Permitted Role: Collector issuing award
  const collectorAwardRes = await api('/compensation/awards', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens['DISTRICT_COLLECTOR']}` },
    body: JSON.stringify({
      parcelId: 'parcel-103-10',
      projectId: 'proj-0084',
      totalAwardAmount: 4850000,
      solatiumAmount: 2425000,
      additionalInterest: 582000,
    }),
  });
  record(
    'RBAC',
    'Permitted Action: District Collector Award Issue',
    collectorAwardRes.status === 201,
    `Status ${collectorAwardRes.status}, Award ID: ${collectorAwardRes.data?.id}`,
  );

  // Forbidden Role: Tehsildar attempting to issue award
  const tehsildarAwardRes = await api('/compensation/awards', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens['TEHSILDAR']}` },
    body: JSON.stringify({
      parcelId: 'parcel-103-10',
      projectId: 'proj-0084',
      totalAwardAmount: 5000000,
    }),
  });
  record(
    'RBAC',
    'Forbidden Action: Tehsildar Attempting Award Issue',
    tehsildarAwardRes.status === 403,
    `Status ${tehsildarAwardRes.status} (Expected 403 Forbidden)`,
  );

  // Forbidden Role: Tehsildar attempting to execute disbursement
  const tehsildarDisburseRes = await api('/compensation/disbursements', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens['TEHSILDAR']}` },
    body: JSON.stringify({
      awardId: collectorAwardRes.data?.id || 'awd-1',
      beneficiaryName: 'Shri Ramchandra Patil',
      accountNumberMasked: '••••••••4556',
      ifsc: 'SBIN0001234',
      amount: 1000000,
    }),
  });
  record(
    'RBAC',
    'Forbidden Action: Tehsildar Attempting Disbursement',
    tehsildarDisburseRes.status === 403,
    `Status ${tehsildarDisburseRes.status} (Expected 403 Forbidden)`,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // 4. IDOR / HORIZONTAL PRIVILEGE ESCALATION
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- 4. IDOR & Horizontal Privilege Escalation ---');

  // Vadodara Collector attempting to transition Lucknow Metro (outside jurisdiction)
  const idorTransitionRes = await api('/workflow/transition', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens['DISTRICT_COLLECTOR']}` },
    body: JSON.stringify({
      projectId: 'proj-0059', // Lucknow Metro Phase III (UP)
      fromStage: 'SEC_11_PRELIMINARY',
      toStage: 'SEC_15_HEARING',
      remarks: 'Attempting unauthorized cross-district transition',
    }),
  });
  record(
    'SECURITY_IDOR',
    'Cross-Jurisdiction Project Transition Rejected',
    idorTransitionRes.status === 403,
    `Status ${idorTransitionRes.status} (Expected 403 Forbidden)`,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // 5. ACQUISITION WORKFLOW E2E & NEGATIVE WORKFLOW TESTS
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- 5. Acquisition Workflow & State Machine ---');

  // Negative test: Invalid transition jump (SIA directly to POSSESSION)
  const invalidJumpRes = await api('/workflow/transition', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens['SUPER_ADMIN']}` },
    body: JSON.stringify({
      projectId: 'proj-0084',
      fromStage: 'SIA',
      toStage: 'SEC_38_POSSESSION',
      remarks: 'Invalid illegal jump',
    }),
  });
  record(
    'WORKFLOW',
    'Reject Invalid Statutory Jump (SIA -> POSSESSION)',
    invalidJumpRes.status === 400,
    `Status ${invalidJumpRes.status} (Expected 400 Bad Request)`,
  );

  // Negative test: Backward transition (AWARD back to SIA)
  const backwardJumpRes = await api('/workflow/transition', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens['SUPER_ADMIN']}` },
    body: JSON.stringify({
      projectId: 'proj-0084',
      fromStage: 'SEC_23_AWARD',
      toStage: 'SIA',
      remarks: 'Invalid backward jump',
    }),
  });
  record(
    'WORKFLOW',
    'Reject Backward Transition (AWARD -> SIA)',
    backwardJumpRes.status === 400,
    `Status ${backwardJumpRes.status} (Expected 400 Bad Request)`,
  );

  // Ensure proj-0084 is in SEC_15_HEARING stage for idempotent test execution
  await prisma.project.update({
    where: { id: 'proj-0084' },
    data: { stageCode: 'SEC_15_HEARING', stage: '05 - Section 15 Objection Hearing Completed' },
  });

  // Valid Transition: Advance proj-0084 from SEC_15_HEARING to SEC_19_DECLARATION
  const validTransitionRes = await api('/workflow/transition', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens['DISTRICT_COLLECTOR']}` },
    body: JSON.stringify({
      projectId: 'proj-0084',
      fromStage: 'SEC_15_HEARING',
      toStage: 'SEC_19_DECLARATION',
      remarks: 'Public objection hearings completed without unaddressed claims.',
    }),
  });
  record(
    'WORKFLOW',
    'Valid Transition (SEC_15_HEARING -> SEC_19_DECLARATION)',
    validTransitionRes.status === 201 && validTransitionRes.data?.success,
    `Stage: ${validTransitionRes.data?.currentStage}`,
  );

  // Verify transition is persisted in PostgreSQL
  const dbProjectAfterTransition = await prisma.project.findUnique({ where: { id: 'proj-0084' } });
  record(
    'WORKFLOW',
    'Workflow State Persisted to Database',
    dbProjectAfterTransition?.stageCode === 'SEC_19_DECLARATION',
    `DB stageCode: ${dbProjectAfterTransition?.stageCode}`,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // 6. FINANCIAL CALCULATIONS, INVARIANTS & DUPLICATE DISBURSEMENT
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- 6. Financial Calculations & Invariants ---');

  // Statutory Calculation Engine test
  const calcRes = await api('/compensation/calculate', {
    method: 'POST',
    body: JSON.stringify({
      landAreaHa: 1.5,
      baseMarketRatePerHa: 2000000,
      isRural: true,
      ruralMultiplierFactor: 1.5,
      assetsValueTreesStructures: 500000,
      monthsFromSec11ToAward: 12,
    }),
  });
  const calcData = calcRes.data;
  // Base: 1.5 * 2,000,000 = 3,000,000. Multiplier 1.5 -> Market Value = 4,500,000.
  // Solatium 100% -> 4,500,000. Interest: 12% for 1 yr on 4.5M = 540,000. Assets = 500,000.
  // Total = 4,500,000 + 4,500,000 + 540,000 + 500,000 = 10,040,000
  const expectedTotal = 10040000;
  record(
    'FINANCE',
    'Statutory RFCTLARR Calculation Engine',
    (calcRes.status === 200 || calcRes.status === 201) && (calcData?.totalCompensation === expectedTotal || calcData?.totalAwardAmount === expectedTotal),
    `Calculated Total: ₹${(calcData?.totalCompensation || calcData?.totalAwardAmount)?.toLocaleString('en-IN')} (Expected: ₹${expectedTotal.toLocaleString('en-IN')})`,
  );

  // Financial Invariant: Attempt disbursement greater than sanctioned award
  const awardId = collectorAwardRes.data?.id;
  const exceedDisburseRes = await api('/compensation/disbursements', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens['DISTRICT_COLLECTOR']}` },
    body: JSON.stringify({
      awardId,
      beneficiaryName: 'Shri Ramchandra Patil',
      accountNumberMasked: '••••••••4556',
      ifsc: 'SBIN0001234',
      amount: 999999999, // Exceeds award
      utrNumber: `SBIN${Date.now()}_OVERFLOW`,
    }),
  });
  record(
    'FINANCE',
    'Invariant: Reject Disbursement Exceeding Sanctioned Award',
    exceedDisburseRes.status === 400,
    `Status ${exceedDisburseRes.status} (Expected 400 Bad Request)`,
  );

  // Valid Disbursement Execution
  const testUtr = `SBIN${Date.now()}_VALID`;
  const validDisburseRes = await api('/compensation/disbursements', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens['DISTRICT_COLLECTOR']}` },
    body: JSON.stringify({
      awardId,
      beneficiaryName: 'Shri Ramchandra Patil',
      accountNumberMasked: '••••••••4556',
      ifsc: 'SBIN0001234',
      amount: 1000000,
      utrNumber: testUtr,
    }),
  });
  record(
    'FINANCE',
    'Execute Valid DBT Disbursement',
    validDisburseRes.status === 201,
    `Status ${validDisburseRes.status}, Payment ID: ${validDisburseRes.data?.id}`,
  );

  // Duplicate Disbursement Protection: Attempt payment with identical UTR
  const dupDisburseRes = await api('/compensation/disbursements', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens['DISTRICT_COLLECTOR']}` },
    body: JSON.stringify({
      awardId,
      beneficiaryName: 'Shri Ramchandra Patil',
      accountNumberMasked: '••••••••4556',
      ifsc: 'SBIN0001234',
      amount: 1000000,
      utrNumber: testUtr, // Duplicate UTR
    }),
  });
  record(
    'FINANCE',
    'Duplicate Disbursement Protection (Duplicate UTR Rejected)',
    dupDisburseRes.status === 409,
    `Status ${dupDisburseRes.status} (Expected 409 Conflict)`,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // 7. GIS & SPATIAL QUERIES
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- 7. GIS & Spatial Queries ---');
  const gisParcelsRes = await api('/gis/parcels');
  const fc = gisParcelsRes.data;
  const hasPolygon = fc?.features?.length > 0 && fc.features[0].geometry?.type === 'Polygon';
  record(
    'GIS',
    'GeoJSON Cadastral Boundary Fetch',
    gisParcelsRes.status === 200 && hasPolygon,
    `Features returned: ${fc?.features?.length}, Type: ${fc?.features[0]?.geometry?.type}`,
  );

  const gisLayersRes = await api('/gis/layers');
  record(
    'GIS',
    'Statutory GIS Layers Metadata',
    gisLayersRes.status === 200 && gisLayersRes.data?.length >= 4,
    `Layers count: ${gisLayersRes.data?.length}`,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // 8. GRIEVANCE MANAGEMENT & SLA
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- 8. Grievance Management & SLA ---');
  const citizenGrievanceRes = await api('/grievances', {
    method: 'POST',
    body: JSON.stringify({
      projectId: 'proj-0084',
      parcelId: 'parcel-103-10',
      complainantName: 'Smt. Anandi Ben Patel',
      phone: '+91 98989 12121',
      category: 'COMPENSATION_DISPUTE',
      description: 'Requesting clarification on solatium entitlement under RFCTLARR First Schedule.',
    }),
  });
  const createdGrv = citizenGrievanceRes.data;
  record(
    'GRIEVANCES',
    'Citizen Grievance Submission',
    citizenGrievanceRes.status === 201 && !!createdGrv?.ticketNumber,
    `Ticket: ${createdGrv?.ticketNumber}, SLA Due: ${createdGrv?.slaDueDate}`,
  );

  // Fetch created grievance
  const getGrvRes = await api(`/grievances/${createdGrv?.ticketNumber}`);
  record(
    'GRIEVANCES',
    'Retrieve Grievance by Ticket Number',
    getGrvRes.status === 200 && getGrvRes.data?.ticketNumber === createdGrv?.ticketNumber,
    `Status: ${getGrvRes.data?.status}, Complainant: ${getGrvRes.data?.complainantName}`,
  );

  // Update grievance status
  const updateGrvRes = await api(`/grievances/${createdGrv?.id}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${tokens['DISTRICT_COLLECTOR']}` },
    body: JSON.stringify({
      status: 'UNDER_INVESTIGATION',
      remarks: 'Assigned to Sub-Divisional Officer for field hearing',
    }),
  });
  record(
    'GRIEVANCES',
    'Officer Grievance Status Update',
    updateGrvRes.status === 200 && updateGrvRes.data?.status === 'UNDER_INVESTIGATION',
    `Updated status: ${updateGrvRes.data?.status}`,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // 9. AUDIT TRAIL VERIFICATION
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- 9. Audit Trail Verification ---');
  const auditLogsRes = await api('/audit/logs?limit=10', {
    headers: { Authorization: `Bearer ${tokens['SUPER_ADMIN']}` },
  });
  const auditLogs = auditLogsRes.data?.items || auditLogsRes.data;
  record(
    'AUDIT',
    'Audit Trail Logging',
    auditLogsRes.status === 200 && Array.isArray(auditLogs) && auditLogs.length > 0,
    `Logged events count: ${auditLogs?.length}, Latest action: ${auditLogs[0]?.action} on ${auditLogs[0]?.entityType}`,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // 10. DATABASE PERSISTENCE PROOF: Create Project & Query from DB
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- 10. Database Persistence Proof ---');
  const testProjectCode = `DOLR-TEST-${Date.now()}`;
  const createProjectRes = await api('/projects', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens['SUPER_ADMIN']}` },
    body: JSON.stringify({
      projectCode: testProjectCode,
      name: 'Vadodara Ring Road Expansion Phase IV',
      description: 'Test project for persistent database validation',
      type: 'Highway',
      ministry: 'MoRTH',
      requiringBody: 'NHAI',
      state: 'Gujarat',
      stateCode: 'GJ',
      district: 'Vadodara',
      stage: '01 - Social Impact Assessment (SIA) Initiated',
      stageCode: 'SIA',
      status: 'IN_PROGRESS',
      totalAreaProposedHa: 50.0,
      totalAreaNotifiedHa: 45.0,
      estimatedBudgetCr: 120.0,
      affectedFamilies: 25,
      slaDaysRemaining: 180,
    }),
  });
  const createdProject = createProjectRes.data;
  record(
    'PERSISTENCE',
    'Create Project via API',
    createProjectRes.status === 201 && !!createdProject?.id,
    `Created Project: ${createdProject?.name} (Code: ${createdProject?.projectCode})`,
  );

  // Check directly in PostgreSQL database table
  const dbVerifiedProject = await prisma.project.findFirst({
    where: { projectCode: testProjectCode },
  });
  record(
    'PERSISTENCE',
    'Verify Record Exists in PostgreSQL Table',
    !!dbVerifiedProject && dbVerifiedProject.projectCode === testProjectCode,
    `Database row found: ID=${dbVerifiedProject?.id}, Name=${dbVerifiedProject?.name}`,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n================================================================');
  console.log('  VALIDATION SUMMARY');
  console.log('================================================================');
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`Total Checks Executed: ${results.length}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);

  await prisma.$disconnect();

  if (failed > 0) {
    console.error('\n❌ Some validation checks failed. See above.');
    process.exit(1);
  } else {
    console.log('\n✨ ALL SYSTEM-LEVEL VALIDATION CHECKS PASSED PERFECTLY!');
    process.exit(0);
  }
}

run().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
