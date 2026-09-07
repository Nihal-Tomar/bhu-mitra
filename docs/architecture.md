# BhuMitra — Stage 0: Architecture Blueprint
## National Land Acquisition Intelligence & Management Platform
### Smart India Hackathon 2026 — Problem Statement 26016

> **One Nation. One Land Acquisition Workflow. Real-Time Governance.**

---

## 1. SYSTEM ARCHITECTURE

### 1.1 High-Level Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         PUBLIC INTERNET / INTRANET                   │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ HTTPS
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        REVERSE PROXY / LOAD BALANCER                 │
│                              (Nginx / Caddy)                         │
└─────────────────┬──────────────────────────────┬────────────────────┘
                  │                              │
                  ▼                              ▼
┌─────────────────────────────┐    ┌─────────────────────────────────┐
│       Web Client            │    │      API Gateway (NestJS)        │
│  Next.js 14 + React 18      │    │     REST + OpenAPI/Swagger       │
│  TypeScript + Tailwind      │    │    Port: 3001                    │
│  Port: 3000                 │    │                                  │
└─────────────────────────────┘    └────────────────┬────────────────┘
                                                    │
                   ┌────────────────────────────────┼─────────────────────────────────┐
                   │                                │                                 │
                   ▼                                ▼                                 ▼
      ┌────────────────────┐          ┌─────────────────────┐          ┌─────────────────────┐
      │  Workflow Module   │          │    GIS Module        │          │  Documents Module    │
      │  State Machine     │          │  PostGIS queries     │          │  MinIO / S3          │
      └────────────────────┘          └─────────────────────┘          └─────────────────────┘
                   │                                │                                 │
                   └────────────────────────────────┼─────────────────────────────────┘
                                                    │
                                    ┌───────────────┴───────────────┐
                                    │      PostgreSQL + PostGIS      │
                                    │      (Primary Data Store)      │
                                    └───────────────────────────────┘
                                                    │
              ┌─────────────────────────────────────┼─────────────────────────────────────┐
              ▼                                     ▼                                     ▼
┌─────────────────────┐                ┌────────────────────┐              ┌────────────────────┐
│   Redis             │                │   MinIO            │              │  Intelligence Svc  │
│   Sessions/Cache    │                │   Object Storage   │              │  Python + FastAPI  │
│   BullMQ Queues     │                │   Documents/Maps   │              │  Port: 8000        │
└─────────────────────┘                └────────────────────┘              └────────────────────┘
```

### 1.2 Architectural Pattern

| Decision | Choice | Rationale |
|---|---|---|
| Backend Pattern | **Modular Monolith** | SIH prototype; clean module boundaries for future microservice extraction |
| API Style | **REST + OpenAPI** | Government-standard, well-documented, easy to audit |
| Frontend | **Next.js App Router** | SSR for performance, RSC for server-side data, static for public portal |
| State Management | **TanStack Query** | Server-state synchronization; no Redux complexity |
| ORM | **Prisma** | Type-safe, migration-based, PostGIS extension support |
| Message Queue | **BullMQ + Redis** | Async jobs: notifications, report generation, sync |
| Object Storage | **MinIO (S3-compatible)** | Local dev; swappable to AWS S3 in production |
| Intelligence | **Python FastAPI** | Separate process; heuristic scoring initially, ML-extensible |

---

## 2. MODULE ARCHITECTURE

### 2.1 Backend Modules (NestJS)

```
apps/api/src/modules/
│
├── auth/               — Authentication, JWT, session, OIDC adapter
├── users/              — User CRUD, profile, password management
├── roles/              — Role definitions, role assignment
├── permissions/        — Permission registry, centralized guards
├── organizations/      — Ministry, State Dept, District Office entities
│
├── master-data/        — States, Districts, Villages, Land categories
│
├── projects/           — Project lifecycle, agencies, milestones, health
├── land-parcels/       — Parcel CRUD, khasra, area, stage, risk
│
├── gis/                — PostGIS queries, spatial search, tile endpoints
│
├── workflow/           — State machine engine, transitions, SLA, escalation
│
├── notifications/      — Alerts, Action Centre, notification delivery
│
├── documents/          — Upload, versioning, checksum, MinIO integration
│
├── compensation/       — Assessment, approval, payment lifecycle, mock adapter
│
├── possession/         — Possession records, handover tracking
│
├── rehabilitation/     — R&R families, benefits, grievances
│
├── field-verification/ — Inspection assignments, evidence, GPS records
│
├── analytics/          — Aggregation queries, KPIs, drill-down
│
├── intelligence/       — Health score, predict, bottleneck radar (proxy to Python svc)
│
├── reports/            — MIS generation, export (PDF/Excel/CSV), daily brief
│
├── audit/              — Audit event store, explorer API
│
└── integrations/       — Gateway adapters: land records, identity, payments, SMS, email
```

### 2.2 Frontend Modules (Next.js App Router)

```
apps/web/src/app/
│
├── (auth)/             — Login, OTP demo flow
│
├── (officer)/          — Protected: all officer-facing modules
│   ├── dashboard/      — National Command Centre
│   ├── projects/       — Project listing, Digital Twin (360°)
│   ├── gis/            — GIS Command Centre
│   ├── parcels/        — Parcel listing, Parcel 360°
│   ├── workflow/       — Action Centre, workflow inbox
│   ├── compensation/   — Compensation module
│   ├── rr/             — R&R module
│   ├── documents/      — Document Vault
│   ├── field/          — Field Operations (mobile-first)
│   ├── analytics/      — Analytics, Intelligence
│   ├── reports/        — MIS, Daily Brief
│   ├── alerts/         — Alerts panel
│   ├── admin/          — User, role, org administration
│   └── audit/          — Audit Explorer
│
├── (public)/           — Public Transparency Portal (no auth)
│   ├── page.tsx        — Public landing
│   ├── projects/       — Public project search/tracking
│   └── track/          — Acknowledgement/reference lookup
│
└── design-system/      — Component showcase (Stage 2)
```

### 2.3 Intelligence Service (Python FastAPI)

```
apps/intelligence/
├── main.py             — FastAPI app, health endpoint
├── routers/
│   ├── health_score.py — BhuMitra Health Score (0–100)
│   ├── predict.py      — Delay risk prediction
│   └── bottleneck.py   — Bottleneck Radar
├── scoring/
│   ├── deterministic.py — Heuristic scoring engine
│   └── models.py        — Future: scikit-learn / XGBoost
└── schemas/            — Pydantic request/response models
```

---

## 3. DATABASE ER MODEL

### 3.1 Core Entity Groups

#### Identity & Access
```
User ──< UserRole >── Role ──< RolePermission >── Permission
User ──< Organization
Organization ──> State | District | Ministry
```

#### Geography Hierarchy
```
State ──< District ──< Village
```

#### Project Core
```
Project ──> State, District, Organization (RequiringBody)
Project ──< ProjectAgency (implementing agencies)
Project ──< Milestone
Project ──< RiskAssessment
Project ──< Alert
```

#### Land Parcels
```
LandParcel ──> Project, Village
LandParcel.geometry (PostGIS GEOMETRY)
LandParcel ──< AffectedParty
LandParcel ──> LandNotification, Award
```

#### Workflow Engine
```
WorkflowDefinition ──< WorkflowStage ──< WorkflowTransitionRule
WorkflowInstance ──> Project, WorkflowDefinition
WorkflowInstance ──< WorkflowTransition
WorkflowTransition ──> User (actor), Organization
WorkflowTransition ──< Document (supporting)
```

#### Compensation
```
CompensationAssessment ──> LandParcel
CompensationAssessment ──> AffectedParty
CompensationPayment ──> CompensationAssessment
```

#### Rehabilitation
```
AffectedFamily ──> LandParcel, Project
RehabilitationBenefit ──> AffectedFamily
```

#### Documents
```
Document ──> Project | LandParcel
Document ──< DocumentVersion
DocumentVersion ──> User (uploadedBy)
DocumentVersion.checksum, storageKey (MinIO)
```

#### Field Operations
```
FieldInspection ──> LandParcel, User (officer)
FieldInspection ──< InspectionEvidence (GPS, photo, remarks)
```

#### Audit
```
AuditEvent ──> User (actor), Organization
AuditEvent: action, resource, resourceId, prevValue, newValue, timestamp, sessionMeta
```

### 3.2 Key Schema Details

| Table | PK | Notable Columns |
|---|---|---|
| `users` | UUID | email, passwordHash, orgId, isActive, lastLogin |
| `roles` | UUID | code (SUPER_ADMIN…PUBLIC), label, description |
| `permissions` | UUID | code (project:create…), module, description |
| `organizations` | UUID | type (MINISTRY/STATE_DEPT/DISTRICT_OFFICE/PIA), stateId, districtId |
| `states` | UUID | name, code (2-letter), lgdCode |
| `districts` | UUID | name, stateId, lgdCode |
| `villages` | UUID | name, districtId, lgdCode |
| `projects` | UUID | name, projectId (human-readable), type, stateId, districtId, stage, area, budget, startDate, targetDate |
| `land_parcels` | UUID | khasraNo, surveyNo, villageId, projectId, area, landType, stage, geometry (PostGIS) |
| `workflow_instances` | UUID | projectId, definitionId, currentStage, startedAt, slaBreached |
| `workflow_transitions` | UUID | instanceId, fromStage, toStage, actorId, orgId, timestamp, remarks, sla |
| `compensation_assessments` | UUID | parcelId, partyId, awardAmount, status |
| `compensation_payments` | UUID | assessmentId, paidAmount, status, paymentDate, txRef |
| `audit_events` | UUID | actorId, action, resource, resourceId, prevValue, newValue, timestamp, ip |

### 3.3 PostGIS Spatial Columns

```sql
-- land_parcels
geometry  GEOMETRY(MULTIPOLYGON, 4326)   -- parcel polygon
centroid  GEOMETRY(POINT, 4326)          -- computed centroid (spatial index)

-- projects (bounding box of all parcels)
boundary  GEOMETRY(MULTIPOLYGON, 4326)   -- aggregate boundary

-- field_inspection_evidence
location  GEOMETRY(POINT, 4326)          -- GPS capture point

-- Spatial indexes
CREATE INDEX ON land_parcels USING GIST (geometry);
CREATE INDEX ON land_parcels USING GIST (centroid);
CREATE INDEX ON projects USING GIST (boundary);
```

---

## 4. ROLE MATRIX

| Role | Code | Scope | Key Permissions |
|---|---|---|---|
| Super Admin | `SUPER_ADMIN` | National | All permissions |
| Central Ministry Admin | `CENTRAL_MINISTRY_ADMIN` | National | project:*, workflow:*, analytics:view-national, audit:view, report:export |
| Central Ministry Viewer | `CENTRAL_MINISTRY_VIEWER` | National | project:view, analytics:view-national, report:export |
| State Nodal Officer | `STATE_NODAL_OFFICER` | State | project:view/update (own state), workflow:transition, compensation:view |
| District Collector | `DISTRICT_COLLECTOR` | District | project:approve, workflow:approve, compensation:approve, possession:approve |
| Land Acquisition Officer | `LAND_ACQUISITION_OFFICER` | District | parcel:create/update, workflow:transition, document:upload/view |
| Requiring Body Officer | `REQUIRING_BODY_OFFICER` | Project | project:create/view, document:upload, workflow:view |
| Field Officer | `FIELD_OFFICER` | Assignment | field:inspect, parcel:view, document:upload (evidence only) |
| Compensation Officer | `COMPENSATION_OFFICER` | District | compensation:assess/view, parcel:view |
| R&R Officer | `RR_OFFICER` | District | rehabilitation:*, parcel:view |
| Auditor | `AUDITOR` | Assigned scope | audit:view, project:view, report:export |
| Executive Viewer | `EXECUTIVE_VIEWER` | National | analytics:view-national, report:export (read-only everything) |
| Public | `PUBLIC` | Public only | public:view (no auth required) |

### 4.1 Permission Registry (Selected)

```
project:create          project:view           project:update
project:approve         project:delete
parcel:create           parcel:view            parcel:update
workflow:view           workflow:transition    workflow:approve
document:upload         document:view          document:download         document:delete
compensation:assess     compensation:approve   compensation:view
rehabilitation:manage   rehabilitation:view
possession:record       possession:approve
field:assign            field:inspect          field:view
analytics:view-national analytics:view-state   analytics:view-district
report:export           report:generate
audit:view              audit:export
admin:users             admin:roles            admin:organizations
public:view
```

---

## 5. WORKFLOW MODEL

### 5.1 Acquisition Lifecycle State Machine

```
                    ┌─────────────────┐
                    │  DRAFT_PROPOSAL │ ◄── Created by PIA/Requiring Body
                    └────────┬────────┘
                             │ Submit
                             ▼
                    ┌─────────────────────┐
                    │  PROPOSAL_SUBMITTED  │
                    └────────┬────────────┘
                             │ Assign for Scrutiny
                             ▼
                    ┌─────────────────────┐
                    │  INITIAL_SCRUTINY    │ ◄── LAO reviews
                    └────────┬────────────┘
                             │ Approve / Return
                    ┌────────┴────────────┐
                    │                     │
                    ▼                     ▼
           ┌───────────────┐    ┌─────────────────────┐
           │   RETURNED    │    │ ADMINISTRATIVE_APPRV │ ◄── Collector/DC
           └───────────────┘    └─────────┬────────────┘
                                          │
                                          ▼
                                ┌──────────────────────┐
                                │  LAND_IDENTIFICATION  │ ◄── GIS + Survey
                                └──────────┬────────────┘
                                           │
                                           ▼
                                ┌──────────────────────┐
                                │   SOCIAL_IMPACT_ASMT  │ ◄── SIA Report
                                └──────────┬────────────┘
                                           │
                                           ▼
                                ┌──────────────────────┐
                                │ PRELIMINARY_NOTIF     │ ◄── Section 11 Notice
                                └──────────┬────────────┘
                                           │
                                           ▼
                                ┌──────────────────────┐
                                │  CLAIMS_OBJECTIONS    │ ◄── 60-day window
                                └──────────┬────────────┘
                                           │
                                           ▼
                                ┌──────────────────────┐
                                │    DECLARATION        │ ◄── Section 19 Declaration
                                └──────────┬────────────┘
                                           │
                                           ▼
                                ┌──────────────────────┐
                                │  SURVEY_VALUATION     │ ◄── LAO survey
                                └──────────┬────────────┘
                                           │
                                           ▼
                                ┌──────────────────────┐
                                │  AWARD_PREPARATION    │
                                └──────────┬────────────┘
                                           │
                                           ▼
                                ┌──────────────────────┐
                                │   AWARD_DECLARED      │ ◄── Section 23 Award
                                └──────────┬────────────┘
                                           │
                           ┌───────────────┴──────────────────┐
                           ▼                                  ▼
                  ┌─────────────────────┐           ┌─────────────────────┐
                  │ COMPENSATION_ASMT   │           │   R&R_PROCESSING    │
                  └──────────┬──────────┘           └──────────┬──────────┘
                             │                                 │
                             ▼                                 │
                  ┌─────────────────────┐                     │
                  │  COMPENSATION_DISB  │                     │
                  └──────────┬──────────┘                     │
                             │                                 │
                             └─────────────┬───────────────────┘
                                           ▼
                                  ┌─────────────────┐
                                  │    POSSESSION    │ ◄── Physical handover
                                  └────────┬─────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │    HANDOVER      │
                                  └────────┬─────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │ PROJECT_COMPLETED│
                                  └─────────────────┘
```

### 5.2 Transition Record Schema

Every transition stores:
- `fromStage` / `toStage`
- `actorId` + `actorRole`
- `organizationId`
- `timestamp`
- `remarks` (required for returns/rejections)
- `documentIds[]` (supporting evidence)
- `slaHours` (configured per transition type)
- `slaBreached` (boolean, computed)
- `reason` (enum: APPROVED | RETURNED | ESCALATED | AUTO_PROGRESSED)

### 5.3 SLA Configuration (Selected)

| Transition | SLA (Working Days) | Escalation Target |
|---|---|---|
| Draft → Submitted | — | — |
| Submitted → Initial Scrutiny | 7 | District Collector |
| Initial Scrutiny → Admin Approval | 15 | State Nodal Officer |
| Claims/Objections window | 60 | (statutory) |
| Survey & Valuation | 30 | State Nodal Officer |
| Award Preparation | 15 | District Collector |
| Compensation Assessment | 30 | Central Ministry |
| Compensation Disbursement | 60 | Central Ministry |

---

## 6. PAGE HIERARCHY

### 6.1 Officer Portal

```
/login
/dashboard                          — National Command Centre
/projects                           — Project listing + filters
/projects/[id]                      — Project Digital Twin (360°)
/projects/[id]/gis                  — Project GIS view
/projects/[id]/parcels              — Parcel list for project
/projects/[id]/workflow             — Workflow timeline
/projects/[id]/compensation         — Compensation summary
/projects/[id]/rr                   — R&R summary
/projects/[id]/documents            — Project documents
/projects/[id]/milestones           — Milestones
/projects/[id]/audit                — Project audit log
/projects/create                    — Proposal wizard (7 steps)
/gis                                — GIS Command Centre (full-screen)
/parcels                            — National parcel browser
/parcels/[id]                       — Parcel 360° (or drawer)
/workflow                           — Action Centre inbox
/compensation                       — Compensation module
/rr                                 — R&R module
/documents                          — Document Vault
/field                              — Field Operations (mobile-first)
/field/inspections/[id]             — Inspection detail
/analytics                          — Analytics hub
/analytics/intelligence             — BhuMitra Intelligence (Health/Predict/Bottleneck)
/reports                            — MIS + report builder
/reports/daily-brief                — Daily National Brief
/alerts                             — Alerts & notifications
/admin                              — Administration
/admin/users                        — User management
/admin/roles                        — Role management
/admin/organizations                — Organization management
/admin/integrations                 — Integration Gateway status
/audit                              — Audit Explorer
/profile                            — User profile
/design-system                      — Design system showcase (Stage 2)
```

### 6.2 Public Portal

```
/public                             — Public landing + national stats
/public/projects                    — Public project search
/public/projects/[id]               — Public project page (sanitized)
/public/track                       — Acknowledgement/reference lookup
/public/map                         — Public map view
/public/resources                   — FAQs, guidelines
```

---

## 7. API STRUCTURE

### 7.1 API Route Groups

```
/api/v1/

auth/
  POST   /auth/login
  POST   /auth/logout
  POST   /auth/refresh
  GET    /auth/me
  POST   /auth/otp/send          (demo OTP flow)
  POST   /auth/otp/verify

users/
  GET    /users
  POST   /users
  GET    /users/:id
  PATCH  /users/:id
  DELETE /users/:id
  GET    /users/:id/permissions

roles/
  GET    /roles
  POST   /roles
  GET    /roles/:id
  PATCH  /roles/:id
  POST   /roles/:id/permissions

organizations/
  GET    /organizations
  POST   /organizations
  GET    /organizations/:id
  PATCH  /organizations/:id

master-data/
  GET    /master-data/states
  GET    /master-data/states/:id/districts
  GET    /master-data/districts/:id/villages
  GET    /master-data/land-categories
  GET    /master-data/project-types

projects/
  GET    /projects                 (paginated, filtered)
  POST   /projects
  GET    /projects/:id
  PATCH  /projects/:id
  GET    /projects/:id/summary     (Digital Twin overview)
  GET    /projects/:id/health      (Health Score)
  GET    /projects/:id/milestones
  POST   /projects/:id/milestones
  GET    /projects/:id/risk

land-parcels/
  GET    /parcels                  (paginated, filtered, spatial)
  POST   /parcels
  GET    /parcels/:id
  PATCH  /parcels/:id
  GET    /parcels/:id/timeline
  GET    /parcels/:id/documents
  GET    /parcels/:id/inspections

gis/
  GET    /gis/states               (GeoJSON state boundaries)
  GET    /gis/districts            (GeoJSON district boundaries)
  GET    /gis/projects             (GeoJSON project boundaries)
  GET    /gis/parcels              (GeoJSON parcels, bbox-filtered, paginated)
  GET    /gis/parcels/cluster      (clustered parcels for zoom levels)
  POST   /gis/spatial-search       (bbox / radius query)
  GET    /gis/tiles/:z/:x/:y       (MVT vector tiles - future)

workflow/
  GET    /workflow/definitions
  GET    /workflow/instances/:projectId
  POST   /workflow/instances/:projectId/transition
  GET    /workflow/action-centre   (current user's actions)
  GET    /workflow/pending
  POST   /workflow/approve/:transitionId
  POST   /workflow/return/:transitionId

notifications/
  GET    /notifications
  PATCH  /notifications/:id/read
  GET    /notifications/count

documents/
  GET    /documents                (filtered)
  POST   /documents/upload
  GET    /documents/:id
  GET    /documents/:id/versions
  GET    /documents/:id/download   (signed URL)
  DELETE /documents/:id
  GET    /documents/:id/audit

compensation/
  GET    /compensation             (filtered by project/parcel)
  POST   /compensation/assess
  PATCH  /compensation/:id
  POST   /compensation/:id/approve
  POST   /compensation/:id/payment
  GET    /compensation/summary/:projectId

rehabilitation/
  GET    /rr/families
  POST   /rr/families
  GET    /rr/families/:id
  PATCH  /rr/families/:id
  GET    /rr/benefits
  POST   /rr/benefits
  GET    /rr/summary/:projectId
  GET    /rr/grievances

field-verification/
  GET    /field/assignments        (current officer's)
  POST   /field/inspections
  GET    /field/inspections/:id
  PATCH  /field/inspections/:id
  POST   /field/inspections/:id/evidence
  POST   /field/inspections/:id/submit
  GET    /field/sync-queue         (offline sync)
  POST   /field/sync               (batch sync)

analytics/
  GET    /analytics/national/kpis
  GET    /analytics/national/state-breakdown
  GET    /analytics/national/stage-distribution
  GET    /analytics/state/:stateId/kpis
  GET    /analytics/district/:districtId/kpis
  GET    /analytics/compensation/summary
  GET    /analytics/rr/summary
  GET    /analytics/timeline/adherence
  GET    /analytics/delayed-projects

intelligence/
  GET    /intelligence/health-score/:projectId
  GET    /intelligence/predict/:projectId
  GET    /intelligence/bottleneck
  GET    /intelligence/bottleneck/stages
  GET    /intelligence/bottleneck/states

reports/
  GET    /reports/templates
  POST   /reports/generate
  GET    /reports/daily-brief
  GET    /reports/:id/download

audit/
  GET    /audit/events             (paginated, filtered)
  GET    /audit/events/:id
  GET    /audit/projects/:projectId

integrations/
  GET    /integrations/status
  POST   /integrations/land-records/lookup
  POST   /integrations/identity/verify
  GET    /integrations/payment/status/:txRef

public/
  GET    /public/stats
  GET    /public/projects          (sanitized)
  GET    /public/projects/:id      (sanitized)
  GET    /public/map/states
  GET    /public/track/:ref        (acknowledgement lookup)
  GET    /public/notifications     (public notifications only)

health/
  GET    /health                   (API health check)
  GET    /health/db
  GET    /health/redis
  GET    /health/storage
```

### 7.2 API Standards

- All responses: `{ data, meta, error }` envelope
- Pagination: `{ page, limit, total, totalPages }`
- Errors: `{ code, message, details }` — never expose stack traces
- Filtering: query params (`?stateId=&stage=&dateFrom=&dateTo=`)
- Sorting: `?sortBy=createdAt&order=desc`
- OpenAPI spec auto-generated via `@nestjs/swagger`
- All endpoints versioned under `/api/v1/`

---

## 8. GIS STRATEGY

### 8.1 Map Provider Architecture

```
MapLibre GL JS (provider-agnostic renderer)
           │
           ├── Base Tiles: OpenFreeMap / Protomaps (open, self-hostable)
           ├── State/District Boundaries: GeoJSON from API (India LGD data)
           ├── Project Boundaries: PostGIS → GeoJSON API
           └── Parcel Polygons: PostGIS → GeoJSON API (bbox-filtered)
```

No hard dependency on Mapbox, Google Maps, or any commercial provider.

### 8.2 GIS Data Architecture

| Layer | Source | Format | Update Frequency |
|---|---|---|---|
| India admin boundaries | LGD / GADM simplified | GeoJSON served from API | Static (seeded) |
| State boundaries | Same | GeoJSON | Static |
| District boundaries | Same | GeoJSON | Static |
| Project boundaries | PostGIS (aggregated parcel) | GeoJSON API | Real-time |
| Land parcels | PostGIS geometry column | GeoJSON API (bbox-filtered) | Real-time |
| Field GPS points | PostGIS point | GeoJSON API | Real-time |

### 8.3 Spatial Query Strategy

```sql
-- Parcels within bounding box (map viewport)
SELECT id, khasra_no, stage, ST_AsGeoJSON(geometry) as geojson
FROM land_parcels
WHERE geometry && ST_MakeEnvelope($minLng, $minLat, $maxLng, $maxLat, 4326)
  AND project_id = $projectId
LIMIT 500;

-- Parcels within radius of a point
SELECT id, ST_Distance(centroid::geography, ST_SetSRID(ST_Point($lng, $lat), 4326)::geography) as dist
FROM land_parcels
WHERE ST_DWithin(centroid::geography, ST_SetSRID(ST_Point($lng, $lat), 4326)::geography, $radiusMeters)
ORDER BY dist
LIMIT 100;

-- Project boundary (union of all parcels)
SELECT ST_AsGeoJSON(ST_Union(geometry)) as boundary
FROM land_parcels
WHERE project_id = $projectId;
```

### 8.4 GIS Performance Strategy

- GIST spatial index on `land_parcels.geometry` and `centroid`
- Bbox filtering on all parcel endpoints (never load all parcels)
- Clustering at low zoom levels (Supercluster on frontend or PostGIS cluster)
- Simplified polygon geometry for state/district boundaries (Douglas-Peucker)
- Limit: 500 parcels per viewport request; cluster at zoom < 12
- Vector tiles endpoint planned for Stage 7 optimization

### 8.5 GIS Layers & Controls

```
Layer Stack (bottom to top):
1. Base tiles (OpenFreeMap)
2. State boundaries (dashed, low opacity)
3. District boundaries (dashed, lower opacity)
4. Project boundaries (solid navy, medium opacity fill)
5. Land parcels (colored by stage: amber/blue/indigo/green/red)
6. Field inspection points (orange dots)
7. Clustering overlay

Controls:
- Layer toggle panel (top-right)
- Legend (bottom-right)
- Search box (top-left)
- Zoom in/out
- Fullscreen
- Geolocation (field view)
- Filter panel (stage, district, project)
```

---

## 9. SECURITY ARCHITECTURE

### 9.1 Authentication

```
Client ──POST /auth/login──► NestJS Auth Module
                              │ Validate credentials (bcrypt)
                              │ Issue JWT (access_token: 15min, refresh_token: 7d)
                              │ Store session in Redis
                              ▼
                           JWT Guard (all protected routes)
                              │ Verify signature
                              │ Check Redis session (not revoked)
                              ▼
                           Permission Guard
                              │ Resolve user permissions from DB
                              │ Check required permission for route
                              ▼
                           Controller
```

### 9.2 RBAC Implementation

```
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermissions('project:approve')
async approveProject(...) {}
```

- Permissions resolved from database (not hardcoded in guards)
- Permission cache in Redis (TTL: 5min) for performance
- `PermissionGuard` is the single, centralized enforcement point
- Never trust client-supplied role/permission claims

### 9.3 Security Controls

| Control | Implementation |
|---|---|
| HTTPS | Nginx TLS termination |
| CORS | NestJS CORS configured to specific origins |
| Rate Limiting | `@nestjs/throttler` — 100 req/min per IP on auth endpoints |
| Security Headers | Helmet.js (CSP, HSTS, X-Frame-Options, etc.) |
| Input Validation | Zod (frontend) + class-validator + class-transformer (backend) |
| Upload Validation | File type whitelist, size limit, virus scan hook (future) |
| Document Access | Signed MinIO URLs (TTL: 15min), permission check before URL generation |
| SQL Injection | Prisma parameterized queries only |
| XSS | Next.js default escaping + CSP headers |
| Secrets | Environment variables only; never committed; `.env.example` only |
| Audit Logging | Every write operation emits AuditEvent (interceptor pattern) |
| Data Masking | PII fields masked in API responses based on caller's permission scope |
| Session Management | Redis-backed sessions; logout invalidates server-side session |

### 9.4 Data Classification & Masking

| Data Type | Classification | Masking Rule |
|---|---|---|
| Landowner name | PII - Restricted | Masked unless `parcel:view-pii` permission |
| Aadhaar / ID | PII - Sensitive | Never returned via API |
| Bank details | Financial - Sensitive | Never returned via API |
| Compensation amount | Restricted | Accessible to authorized officers only |
| GPS coordinates (field) | Internal | Not exposed in public API |
| Project stage | Internal | Available to authenticated users |
| Aggregate statistics | Public | Available without auth |

---

## 10. DEPLOYMENT ARCHITECTURE

### 10.1 Docker Compose (Development / SIH Demo)

```yaml
services:
  postgres:
    image: postgis/postgis:16-3.4
    ports: [5432]
    volumes: [postgres_data]

  redis:
    image: redis:7-alpine
    ports: [6379]

  minio:
    image: minio/minio
    ports: [9000, 9001 (console)]
    volumes: [minio_data]

  api:
    build: ./apps/api
    ports: [3001]
    depends_on: [postgres, redis, minio]
    environment: [DATABASE_URL, REDIS_URL, MINIO_*]

  web:
    build: ./apps/web
    ports: [3000]
    depends_on: [api]
    environment: [NEXT_PUBLIC_API_URL]

  intelligence:
    build: ./apps/intelligence
    ports: [8000]
    depends_on: [postgres]

  nginx:
    image: nginx:alpine
    ports: [80, 443]
    depends_on: [web, api]
```

### 10.2 Production Architecture (Target — Post-SIH)

```
Internet
   │
   ▼
CDN (CloudFront / Fastly)
   │ Static assets, Next.js edge
   ▼
Application Load Balancer
   │
   ├── Next.js (Auto-scaled, ECS/GKE)
   ├── NestJS API (Auto-scaled, ECS/GKE)
   └── Intelligence Service (FastAPI, ECS/GKE)

RDS PostgreSQL + PostGIS (managed)
ElastiCache Redis (managed)
S3 (document storage)
Keycloak (Identity Provider, separate cluster)
OpenTelemetry → Observability Stack (Grafana/Prometheus)
```

### 10.3 Environment Configuration

```bash
# Database
DATABASE_URL=postgresql://user:pass@postgres:5432/bhumitra

# Redis
REDIS_URL=redis://redis:6379

# MinIO / S3
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
MINIO_BUCKET=bhumitra-documents

# JWT
JWT_SECRET=...
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Intelligence Service
INTELLIGENCE_SERVICE_URL=http://intelligence:8000

# App
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_VERSION=1.0.0-sih
NEXT_PUBLIC_DEMO_MODE=true
```

---

## 11. FOLDER STRUCTURE

```
bhumitra/                               ← monorepo root
│
├── apps/
│   ├── web/                            ← Next.js 14 frontend
│   │   ├── src/
│   │   │   ├── app/                    ← App Router pages
│   │   │   │   ├── (auth)/
│   │   │   │   ├── (officer)/
│   │   │   │   ├── (public)/
│   │   │   │   └── design-system/
│   │   │   ├── components/             ← Shared UI components
│   │   │   │   ├── government/         ← Masthead, header, footer
│   │   │   │   ├── layout/             ← Sidebar, navigation
│   │   │   │   └── ui/                 ← shadcn/ui components
│   │   │   ├── features/               ← Feature-level components
│   │   │   │   ├── dashboard/
│   │   │   │   ├── projects/
│   │   │   │   ├── gis/
│   │   │   │   ├── workflow/
│   │   │   │   └── ...
│   │   │   ├── lib/                    ← API client, utilities
│   │   │   │   ├── api/                ← TanStack Query hooks
│   │   │   │   ├── auth/               ← Auth utilities
│   │   │   │   └── utils/
│   │   │   ├── hooks/                  ← Custom React hooks
│   │   │   ├── store/                  ← Zustand stores (minimal)
│   │   │   ├── i18n/                   ← Translation files
│   │   │   │   ├── en/
│   │   │   │   └── hi/
│   │   │   └── types/                  ← Frontend-only types
│   │   ├── public/
│   │   ├── tailwind.config.ts
│   │   ├── next.config.ts
│   │   └── package.json
│   │
│   ├── api/                            ← NestJS backend
│   │   ├── src/
│   │   │   ├── modules/                ← Domain modules (listed in §2.1)
│   │   │   ├── common/
│   │   │   │   ├── guards/             ← JwtAuthGuard, PermissionGuard
│   │   │   │   ├── interceptors/       ← AuditInterceptor, LoggingInterceptor
│   │   │   │   ├── decorators/         ← @RequirePermissions, @CurrentUser
│   │   │   │   ├── filters/            ← Global exception filter
│   │   │   │   ├── pipes/              ← ValidationPipe
│   │   │   │   └── utils/
│   │   │   ├── config/                 ← App configuration
│   │   │   ├── database/               ← Prisma service, health check
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed/
│   │   │       ├── index.ts            ← Master seed runner
│   │   │       ├── demo-roles.ts
│   │   │       ├── demo-users.ts
│   │   │       ├── demo-states.ts
│   │   │       ├── demo-projects.ts
│   │   │       └── demo-parcels.ts
│   │   └── package.json
│   │
│   └── intelligence/                   ← Python FastAPI service
│       ├── main.py
│       ├── routers/
│       ├── scoring/
│       ├── schemas/
│       ├── requirements.txt
│       └── Dockerfile
│
├── packages/
│   ├── types/                          ← Shared TypeScript types
│   │   ├── src/
│   │   │   ├── project.types.ts
│   │   │   ├── parcel.types.ts
│   │   │   ├── workflow.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── gis.types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── ui/                             ← Shared UI component library (future)
│   │   └── package.json
│   │
│   └── config/                         ← Shared ESLint, TSConfig, Prettier
│       ├── eslint-preset.js
│       ├── tsconfig.base.json
│       └── prettier.config.js
│
├── infra/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── nginx/
│   │   └── nginx.conf
│   └── scripts/
│       ├── setup.sh
│       ├── seed.sh
│       └── reset-demo.sh
│
├── docs/
│   ├── architecture.md                 ← This document (Stage 0 output)
│   ├── api-spec.md
│   ├── data-dictionary.md
│   ├── rbac-matrix.md
│   └── demo-guide.md
│
├── .env.example
├── .gitignore
├── turbo.json                          ← Turborepo config
├── package.json                        ← Root workspace
└── README.md
```

---

## 12. PROTOTYPE vs PRODUCTION BOUNDARY

### 12.1 What is Real in the Prototype (SIH)

| Capability | Prototype Status |
|---|---|
| Authentication (JWT + session) | ✅ Real |
| RBAC + Permission Guards | ✅ Real (database-backed) |
| Workflow State Machine | ✅ Real (state transitions stored) |
| GIS rendering (MapLibre) | ✅ Real |
| PostGIS spatial queries | ✅ Real |
| Document upload + versioning | ✅ Real (MinIO) |
| Compensation lifecycle | ✅ Real (mock payment adapter) |
| R&R tracking | ✅ Real |
| Audit log | ✅ Real |
| Health Score calculation | ✅ Real (deterministic/heuristic) |
| Delay Prediction | ✅ Real (deterministic signals) |
| Demo data (seeded) | ✅ Fictional, clearly labelled |
| Field PWA (offline-capable) | ✅ Real (IndexedDB) |
| Reports/exports | ✅ Real |

### 12.2 What is Mocked/Simulated

| Capability | Prototype Status | Production Path |
|---|---|---|
| Payment disbursement | 🔶 Mock adapter | RBI-approved payment gateway |
| SMS/Email notifications | 🔶 Mock adapter (logged) | SMS: SMSGW / NIC; Email: NIC SMTP |
| Aadhaar verification | 🔶 Mock adapter | UIDAI API (govt agreement required) |
| Land Records integration | 🔶 Mock adapter | State DigiLocker / DILRMP |
| Cadastral maps (official) | 🔶 Demo GeoJSON polygons | Survey of India / NLRMP tiles |
| OIDC/Keycloak SSO | 🔶 JWT-compatible structure | Keycloak deployment |
| ML predictions | 🔶 Heuristic scoring | Trained XGBoost model |
| Vector tile server | 🔶 GeoJSON API | Martin / pg_tileserv |
| Government LDAP/AD | 🔶 Local user DB | NIC Active Directory |

### 12.3 Production-Grade Practices Applied Even in Prototype

- No secrets in code
- Server-side authorization (not just UI hiding)
- Database constraints and foreign keys
- Proper error handling (no stack trace exposure)
- Audit events for all sensitive operations
- Data masking for PII
- Structured logging

---

## 13. IMPLEMENTATION ROADMAP

### Stage-by-Stage Summary

| Stage | Name | Key Deliverables | Estimated Effort |
|---|---|---|---|
| **0** | Architecture Blueprint | This document | Complete ✅ |
| **1** | Initialization | Monorepo, all tooling, Docker, health checks | ~1 session |
| **2** | Government Design System | Masthead, all UI components, design showcase | ~2 sessions |
| **3** | Auth + RBAC | Login, JWT, sessions, permission guards, demo users | ~2 sessions |
| **4** | Data Model | Prisma schema, PostGIS, migrations, seed (25+ projects, 100+ parcels) | ~2 sessions |
| **5** | National Command Centre | KPI cards, India map, state breakdown, alerts | ~2 sessions |
| **6** | Project Digital Twin | Project 360°, milestones, health indicators | ~2 sessions |
| **7** | GIS Command Centre | MapLibre, parcel layers, spatial search, Parcel 360° | ~2 sessions |
| **8** | Workflow Engine | State machine, Action Centre, SLA, transitions | ~2 sessions |
| **9** | Document Vault | Upload, versioning, checksum, completeness checker | ~1 session |
| **10** | Compensation + R&R | Full lifecycle, mock payment, affected families | ~2 sessions |
| **11** | Field PWA | Mobile UI, GPS, offline drafts, sync | ~2 sessions |
| **12** | Intelligence | Health Score, Predict, Bottleneck Radar | ~1 session |
| **13** | Reports + MIS | All report types, exports, Daily Brief | ~1 session |
| **14** | Public Portal | Public landing, search, tracking, public map | ~1 session |
| **15** | Security Hardening | RBAC audit, headers, rate limiting, masking | ~1 session |
| **16** | Accessibility + Performance | A11y audit, responsive, bundle, query optimization | ~1 session |
| **17** | SIH Demo Mode | Guided demo, reset script, role switching | ~1 session |
| **18** | Testing | Unit, API, RBAC, E2E (Playwright) | ~2 sessions |
| **19** | Final Polish | Evaluator review, UX fixes, SIH quality bar | ~1 session |

### Critical Path

```
Stage 1 (Infra)
    → Stage 2 (Design System)
        → Stage 3 (Auth)
            → Stage 4 (Data Model)
                → Stage 5 (Command Centre)  ← Demo Journey Starts
                → Stage 6 (Projects)
                → Stage 7 (GIS)
                → Stage 8 (Workflow)
                → Stage 9 (Documents)
                → Stage 10 (Compensation/R&R)
                → Stage 11 (Field PWA)
                → Stage 12 (Intelligence)   ← Demo Journey Ends
                    → Stage 13 (Reports)
                    → Stage 14 (Public)
                        → Stage 15 (Security)
                        → Stage 16 (A11y/Perf)
                            → Stage 17 (Demo Mode)
                            → Stage 18 (Testing)
                                → Stage 19 (Final Polish)
```

### SIH Demo Journey Mapping to Stages

| Demo Step | Stage Responsible |
|---|---|
| 1. Login as Ministry Officer | Stage 3 |
| 2. National Command Centre | Stage 5 |
| 3. Identify High-Risk Project | Stage 5 + 12 |
| 4. Open Project Digital Twin | Stage 6 |
| 5. Open GIS | Stage 7 |
| 6. Select Delayed Parcel | Stage 7 |
| 7. Open Parcel 360° | Stage 7 |
| 8. Identify Document/Workflow Issue | Stage 8 + 9 |
| 9. Open Action Centre | Stage 8 |
| 10. Perform Officer Action | Stage 8 |
| 11. View Compensation | Stage 10 |
| 12. View Field Inspection Evidence | Stage 11 |
| 13. Open BhuMitra Predict | Stage 12 |
| 14. Show Risk Explanation | Stage 12 |
| 15. Updated Project Health | Stage 12 |
| 16. Generate Executive MIS | Stage 13 |

---

*Document Version: 1.0 | Stage: 0 | Status: COMPLETE*
*BhuMitra — National Land Acquisition Intelligence & Management Platform*
*Smart India Hackathon 2026 — Problem Statement 26016*
