# BHUMITRA (भू-मित्र)
## National Land Acquisition Intelligence & Management Platform
### Smart India Hackathon 2026 — Problem Statement 26016

> **"One Nation. One Land Acquisition Workflow. Real-Time Governance."**

---

## 🏛️ Executive Summary

**BhuMitra** is a unified digital operating platform purpose-engineered for the **Department of Land Resources (DoLR), Ministry of Rural Development, Government of India**. 

It digitizes, standardizes, and accelerates end-to-end statutory land acquisition under the **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR Act 2013)**.

### Core Value Pillars
1. **Statutory Rigor**: Full state machine governance enforcing strict statutory timelines (Section 11, Section 19, Section 23 Award).
2. **GIS Command Centre**: Cadastral parcel-level polygon mapping, spatial conflict detection, and field verification.
3. **Transparent Compensation & R&R**: Multi-tier award disbursement with audit-grade transparency for displaced families.
4. **Predictive Intelligence**: Heuristic & ML scoring of project health, bottleneck radar, and proactive delay forecasting.

---

## 🏗️ Architecture & Monorepo Layout

```
bhumitra/
├── apps/
│   ├── web/            # Next.js 16 App Router (Officer Portal & Public Transparency)
│   ├── api/            # NestJS Core API Gateway & Domain Engine (Port 3001)
│   └── intelligence/   # Python FastAPI Predictive Analytics & Scoring (Port 8000)
├── packages/
│   ├── config/         # Shared ESLint, TypeScript, Prettier configurations
│   ├── types/          # Shared domain schemas, contracts, and API envelopes
│   └── ui/             # Government Design System component library
├── infra/
│   ├── docker-compose.yml      # Local dev multi-container stack (PostGIS, Redis, MinIO)
│   ├── docker-compose.prod.yml # Production-grade deployment specification
│   ├── nginx/                  # Edge reverse proxy & SSL termination
│   └── scripts/                # Environment setup, database seeding, and reset utilities
└── docs/                       # Architecture blueprint, API specifications, and setup guide
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js**: v20+ (v24 LTS recommended)
- **pnpm**: v10+ (`npm install -g pnpm`)
- **Python**: v3.11+ (for Intelligence service)
- **Docker & Docker Compose**: (for PostGIS, Redis, MinIO stack)

### 1. Clone & Setup Environment
```bash
# Clone the repository
git clone <repo-url>
cd Bhu-Mitra

# Copy environment template
cp .env.example .env

# Install monorepo dependencies
pnpm install
```

### 2. Launch Infrastructure (Docker)
```bash
docker compose -f infra/docker-compose.yml up -d postgres redis minio
```

### 3. Start Development Servers
```bash
# Start all services (Turborepo pipeline)
pnpm dev

# Or start specific applications:
pnpm --filter @bhumitra/web dev           # Web portal at http://localhost:3000
pnpm --filter @bhumitra/api dev           # API gateway at http://localhost:3001
# For Python intelligence service:
cd apps/intelligence && uvicorn main:app --reload --port 8000
```

---

## 🩺 Service Health Check Endpoints

| Service | Port | Health Check URL | Documentation |
|---|---|---|---|
| **Web Frontend** | `3000` | `http://localhost:3000/api/health` | [Home](http://localhost:3000) |
| **API Backend** | `3001` | `http://localhost:3001/api/v1/health` | [Swagger Docs](http://localhost:3001/api/docs) |
| **Intelligence Svc** | `8000` | `http://localhost:8000/health` | [OpenAPI Docs](http://localhost:8000/docs) |

---

## 🗺️ Implementation Roadmap

- [x] **Stage 0**: System Architecture Blueprint
- [x] **Stage 1**: Project Initialization & Infrastructure Scaffolding
- [ ] **Stage 2**: Government Design System & Accessibility Foundations
- [ ] **Stage 3**: Authentication & 12-Role RBAC Model
- [ ] **Stage 4**: Relational & PostGIS Data Model + Master Seed
- [ ] **Stage 5**: National Command Centre & Executive Dashboard
- [ ] **Stage 6**: Project Digital Twin (360° View)
- [ ] **Stage 7**: Cadastral GIS Command Centre (MapLibre)
- [ ] **Stage 8**: Statutory RFCTLARR Workflow Engine
- [ ] **Stage 9**: Secure Document Vault
- [ ] **Stage 10**: Compensation & R&R Lifecycle
- [ ] **Stage 11**: Field Verification Mobile PWA
- [ ] **Stage 12**: Predictive Bottleneck Intelligence
- [ ] **Stage 13**: MIS Reports & Daily Executive Brief
- [ ] **Stage 14**: Public Transparency & Tracking Portal
- [ ] **Stage 15**: Security Hardening & PII Masking
- [ ] **Stage 16**: WCAG 2.1 AA Accessibility & Performance Optimization
- [ ] **Stage 17**: SIH Evaluator Guided Demo Mode
- [ ] **Stage 18**: Automated Testing Suite (Unit, Integration, E2E)
- [ ] **Stage 19**: Final SIH Polish & Quality Assurance

---

## 📜 Compliance & Standards

- **RFCTLARR Act, 2013**: Strict compliance with Sections 11, 15, 19, 23, 31, 38.
- **National Spatial Data Infrastructure (NSDI)**: EPSG:4326 PostGIS geometry models.
- **Digital India / GIGW**: Guidelines for Indian Government Websites (WCAG 2.1 AA).
- **Data Privacy**: No client exposure of PII; server-side permission gating for all sensitive financial/land records.

---

## 👥 Department of Land Resources (DoLR)
Ministry of Rural Development, Government of India
Smart India Hackathon 2026 Prototype
