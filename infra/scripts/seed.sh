#!/usr/bin/env bash
# ==============================================================================
# BhuMitra — Database Migration & Seeding Script (Stage 4 Target)
# ==============================================================================

set -e

echo "🌱 Running Prisma Migrations..."
pnpm --filter @bhumitra/api db:migrate:deploy

echo "📦 Seeding BhuMitra Demonstration Dataset..."
pnpm --filter @bhumitra/api db:seed

echo "✅ Database seeded successfully."
