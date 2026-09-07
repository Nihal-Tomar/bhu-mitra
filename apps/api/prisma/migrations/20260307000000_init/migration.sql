-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateTable
CREATE TABLE "states" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lgdCode" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "lgdCode" INTEGER,
    "stateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "villages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lgdCode" INTEGER,
    "districtId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "villages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "stateId" TEXT,
    "districtId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "roleId" TEXT NOT NULL,
    "organizationId" TEXT,
    "districtId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "projectCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "ministry" TEXT NOT NULL,
    "requiringBody" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "stageCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "totalAreaProposedHa" DOUBLE PRECISION NOT NULL,
    "totalAreaNotifiedHa" DOUBLE PRECISION NOT NULL,
    "totalAreaAcquiredHa" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimatedBudgetCr" DOUBLE PRECISION NOT NULL,
    "compensationAssessedCr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "compensationDisbursedCr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "affectedFamilies" INTEGER NOT NULL DEFAULT 0,
    "slaDaysRemaining" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "delayPredictedDays" INTEGER NOT NULL DEFAULT 0,
    "recommendedAction" TEXT,
    "targetCompletionDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boundaryGeoJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_milestones" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "stage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_stakeholders" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_stakeholders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "land_parcels" (
    "id" TEXT NOT NULL,
    "parcelNumber" TEXT NOT NULL,
    "surveyNo" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,
    "totalAreaHa" DOUBLE PRECISION NOT NULL,
    "acquiredAreaHa" DOUBLE PRECISION NOT NULL,
    "landCategory" TEXT NOT NULL,
    "landUse" TEXT,
    "stage" TEXT NOT NULL,
    "stageCode" TEXT NOT NULL,
    "compensationStatus" TEXT NOT NULL,
    "compensationAssessed" TEXT NOT NULL,
    "compensationAssessedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rrStatus" TEXT NOT NULL,
    "possessionStatus" TEXT NOT NULL,
    "coordinates" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "boundaryGeoJson" JSONB,
    "gazetteNotice" TEXT NOT NULL,
    "gazetteDate" TIMESTAMP(3),
    "color" TEXT NOT NULL DEFAULT '#F59E0B',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "land_parcels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcel_owners" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sharePercentage" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "bankAccountVerified" BOOLEAN NOT NULL DEFAULT false,
    "panNumber" TEXT,
    "phone" TEXT,
    "isMainOwner" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parcel_owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acquisition_cases" (
    "id" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "currentStage" TEXT NOT NULL,
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "slaDueDate" TIMESTAMP(3) NOT NULL,
    "slaStatus" TEXT NOT NULL DEFAULT 'ON_TRACK',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acquisition_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acquisition_notices" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "noticeType" TEXT NOT NULL,
    "noticeNumber" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "gazetteDate" TIMESTAMP(3),
    "publishedInGazette" BOOLEAN NOT NULL DEFAULT true,
    "pdfUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "acquisition_notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acquisition_actions" (
    "id" TEXT NOT NULL,
    "caseId" TEXT,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "assignedToUserId" TEXT,
    "assignedRole" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "escalationLevel" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acquisition_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_transitions" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "fromStage" TEXT NOT NULL,
    "toStage" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "slaHours" INTEGER NOT NULL DEFAULT 48,
    "slaBreached" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_transitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valuations" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "baseLandRatePerHa" DOUBLE PRECISION NOT NULL,
    "multiplicationFactor" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "marketValueTotal" DOUBLE PRECISION NOT NULL,
    "solatiumPercentage" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    "solatiumAmount" DOUBLE PRECISION NOT NULL,
    "assetsValueTreesStructures" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAssessedCompensation" DOUBLE PRECISION NOT NULL,
    "assessedBy" TEXT NOT NULL,
    "assessedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "valuations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compensation_awards" (
    "id" TEXT NOT NULL,
    "awardNumber" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "awardDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalAwardAmount" DOUBLE PRECISION NOT NULL,
    "solatiumAmount" DOUBLE PRECISION NOT NULL,
    "additionalInterest" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "approvedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compensation_awards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compensation_payments" (
    "id" TEXT NOT NULL,
    "awardId" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "beneficiaryName" TEXT NOT NULL,
    "beneficiaryAccountMasked" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'PFMS_DBT',
    "paymentDate" TIMESTAMP(3),
    "transactionRef" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compensation_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rr_cases" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "familyHeadName" TEXT NOT NULL,
    "familySize" INTEGER NOT NULL DEFAULT 4,
    "isScSt" BOOLEAN NOT NULL DEFAULT false,
    "isBpl" BOOLEAN NOT NULL DEFAULT false,
    "displacementType" TEXT NOT NULL DEFAULT 'ECONOMIC_DISPLACEMENT',
    "packageType" TEXT NOT NULL,
    "entitlements" TEXT[],
    "resettlementPlotNo" TEXT,
    "resettlementColonyName" TEXT,
    "subsistenceGrantAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "relocationGrantAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PACKAGE_SANCTIONED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rr_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rr_beneficiaries" (
    "id" TEXT NOT NULL,
    "rrCaseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rr_beneficiaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grievances" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "parcelId" TEXT,
    "complainantName" TEXT NOT NULL,
    "phone" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "filingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hearingDate" TIMESTAMP(3),
    "slaDueDate" TIMESTAMP(3) NOT NULL,
    "isOverdue" BOOLEAN NOT NULL DEFAULT false,
    "assignedOfficerName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "resolutionNotes" TEXT,
    "resolutionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grievances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grievance_actions" (
    "id" TEXT NOT NULL,
    "grievanceId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "actionTaken" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grievance_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_tasks" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "assignedToUserId" TEXT,
    "taskType" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "field_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_inspections" (
    "id" TEXT NOT NULL,
    "taskId" TEXT,
    "parcelId" TEXT NOT NULL,
    "inspectorName" TEXT NOT NULL,
    "inspectionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gpsLatitude" DOUBLE PRECISION NOT NULL,
    "gpsLongitude" DOUBLE PRECISION NOT NULL,
    "gpsAccuracyMeters" DOUBLE PRECISION NOT NULL DEFAULT 3.2,
    "observations" TEXT NOT NULL,
    "encroachmentFound" BOOLEAN NOT NULL DEFAULT false,
    "evidencePhotos" TEXT[],
    "verificationStatus" TEXT NOT NULL DEFAULT 'VERIFIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "field_inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "checksumSha256" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "uploadedBy" TEXT NOT NULL,
    "projectId" TEXT,
    "parcelId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_versions" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "checksumSha256" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "linkUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "thresholdDays" INTEGER NOT NULL,
    "severity" TEXT NOT NULL,
    "targetRole" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorName" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "previousState" JSONB,
    "newState" JSONB,
    "ipAddress" TEXT,
    "remarks" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_definitions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "queryConfig" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_jobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "fileUrl" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "export_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "states_code_key" ON "states"("code");

-- CreateIndex
CREATE UNIQUE INDEX "states_lgdCode_key" ON "states"("lgdCode");

-- CreateIndex
CREATE UNIQUE INDEX "districts_stateId_name_key" ON "districts"("stateId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_code_key" ON "organizations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_officerId_key" ON "users"("officerId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projects_projectCode_key" ON "projects"("projectCode");

-- CreateIndex
CREATE INDEX "projects_stateId_stageCode_idx" ON "projects"("stateId", "stageCode");

-- CreateIndex
CREATE INDEX "projects_projectCode_idx" ON "projects"("projectCode");

-- CreateIndex
CREATE UNIQUE INDEX "land_parcels_parcelNumber_key" ON "land_parcels"("parcelNumber");

-- CreateIndex
CREATE INDEX "land_parcels_projectId_surveyNo_idx" ON "land_parcels"("projectId", "surveyNo");

-- CreateIndex
CREATE INDEX "land_parcels_districtId_stageCode_idx" ON "land_parcels"("districtId", "stageCode");

-- CreateIndex
CREATE UNIQUE INDEX "acquisition_cases_caseNumber_key" ON "acquisition_cases"("caseNumber");

-- CreateIndex
CREATE INDEX "acquisition_actions_assignedRole_status_idx" ON "acquisition_actions"("assignedRole", "status");

-- CreateIndex
CREATE UNIQUE INDEX "compensation_awards_awardNumber_key" ON "compensation_awards"("awardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "grievances_ticketNumber_key" ON "grievances"("ticketNumber");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_actorId_idx" ON "audit_logs"("actorId");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "villages" ADD CONSTRAINT "villages_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_stakeholders" ADD CONSTRAINT "project_stakeholders_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_parcels" ADD CONSTRAINT "land_parcels_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_parcels" ADD CONSTRAINT "land_parcels_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_parcels" ADD CONSTRAINT "land_parcels_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_parcels" ADD CONSTRAINT "land_parcels_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "villages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcel_owners" ADD CONSTRAINT "parcel_owners_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "land_parcels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acquisition_cases" ADD CONSTRAINT "acquisition_cases_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acquisition_cases" ADD CONSTRAINT "acquisition_cases_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "land_parcels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acquisition_notices" ADD CONSTRAINT "acquisition_notices_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "acquisition_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acquisition_actions" ADD CONSTRAINT "acquisition_actions_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "acquisition_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acquisition_actions" ADD CONSTRAINT "acquisition_actions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acquisition_actions" ADD CONSTRAINT "acquisition_actions_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_transitions" ADD CONSTRAINT "workflow_transitions_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "acquisition_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valuations" ADD CONSTRAINT "valuations_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "land_parcels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_awards" ADD CONSTRAINT "compensation_awards_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "land_parcels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_payments" ADD CONSTRAINT "compensation_payments_awardId_fkey" FOREIGN KEY ("awardId") REFERENCES "compensation_awards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_payments" ADD CONSTRAINT "compensation_payments_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "land_parcels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rr_cases" ADD CONSTRAINT "rr_cases_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rr_cases" ADD CONSTRAINT "rr_cases_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "land_parcels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rr_beneficiaries" ADD CONSTRAINT "rr_beneficiaries_rrCaseId_fkey" FOREIGN KEY ("rrCaseId") REFERENCES "rr_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "land_parcels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievance_actions" ADD CONSTRAINT "grievance_actions_grievanceId_fkey" FOREIGN KEY ("grievanceId") REFERENCES "grievances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_tasks" ADD CONSTRAINT "field_tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_tasks" ADD CONSTRAINT "field_tasks_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_inspections" ADD CONSTRAINT "field_inspections_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "field_tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_inspections" ADD CONSTRAINT "field_inspections_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "land_parcels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "land_parcels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

