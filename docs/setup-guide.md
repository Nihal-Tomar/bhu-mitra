# BhuMitra — Developer Setup & Infrastructure Guide

## Prerequisites

| Software | Minimum Version | Recommended | Notes |
|---|---|---|---|
| Node.js | 20.x | 22.x LTS or 24.x | Required for Next.js and NestJS |
| pnpm | 10.x | Latest (`npm i -g pnpm`) | Package manager for workspaces |
| Python | 3.11+ | 3.11 / 3.12 | For intelligence service |
| Docker | 24+ | Latest Desktop / Engine | For PostGIS, Redis, MinIO |

---

## 1. Initial Monorepo Setup

```bash
# 1. Clone repo
cd Bhu-Mitra

# 2. Copy environment template
cp .env.example .env

# 3. Install all workspace dependencies
pnpm install
```

---

## 2. Infrastructure Setup (Docker Compose)

Start the supporting infrastructure:

```bash
# Start PostgreSQL (PostGIS), Redis, and MinIO in the background
docker compose -f infra/docker-compose.yml up -d postgres redis minio

# Verify running containers
docker compose -f infra/docker-compose.yml ps
```

### Direct Access Endpoints
- **PostgreSQL**: `localhost:5432` (db: `bhumitra`, user: `bhumitra`, pass: `bhumitra_secure_dev`)
- **Redis**: `localhost:6379`
- **MinIO S3**: `localhost:9000`
- **MinIO Console**: `http://localhost:9001` (user: `bhumitra_admin`, pass: `bhumitra_minio_secret`)

---

## 3. Running Services Locally

### Option A: All Node Services via Turborepo
```bash
pnpm dev
```

### Option B: Running Individual Services

#### NestJS API Backend (Port 3001)
```bash
pnpm --filter @bhumitra/api dev
# Health check: http://localhost:3001/api/v1/health
# Swagger docs: http://localhost:3001/api/docs
```

#### Next.js Frontend (Port 3000)
```bash
pnpm --filter @bhumitra/web dev
# Frontend portal: http://localhost:3000
# Health check: http://localhost:3000/api/health
```

#### Python FastAPI Intelligence Service (Port 8000)
```bash
cd apps/intelligence
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python main.py
# OpenAPI docs: http://localhost:8000/docs
# Health check: http://localhost:8000/health
```

---

## 4. Verification & Testing

Verify that all service health checks respond:

```bash
# Web frontend health
curl http://localhost:3000/api/health

# API Gateway health
curl http://localhost:3001/api/v1/health

# Intelligence service health
curl http://localhost:8000/health
```
