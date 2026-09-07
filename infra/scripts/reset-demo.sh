#!/usr/bin/env bash
# ==============================================================================
# BhuMitra — Reset Demonstration State (SIH Evaluator Ready)
# Clears transactional changes and resets state back to baseline seed
# ==============================================================================

set -e

echo "⚠️  Resetting BhuMitra Demo State..."
pnpm --filter @bhumitra/api db:reset

echo "✨ Demo environment restored to clean baseline!"
