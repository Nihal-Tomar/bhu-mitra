#!/usr/bin/env bash
# ==============================================================================
# BhuMitra — Environment Setup Script
# Initializes local environment, copies .env, and installs dependencies
# ==============================================================================

set -e

echo "========================================================"
echo "  BHUMITRA — National Land Acquisition Management Platform"
echo "  Setting up local development environment..."
echo "========================================================"

# Check for .env file
if [ ! -f ".env" ]; then
    echo "📋 Copying .env.example to .env..."
    cp .env.example .env
else
    echo "✅ .env file already exists."
fi

# Install root dependencies
echo "📦 Installing workspace dependencies with pnpm..."
pnpm install

# Check Python environment
if command -v python3 &> /dev/null; then
    echo "🐍 Python3 detected: $(python3 --version)"
    if [ -f "apps/intelligence/requirements.txt" ]; then
        echo "💡 To setup intelligence service Python venv:"
        echo "   cd apps/intelligence && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    fi
else
    echo "⚠️ Python3 not found in PATH (needed for local intelligence service development)"
fi

echo "========================================================"
echo "  ✅ Setup complete!"
echo "  Run 'pnpm dev' to start all frontend and API services."
echo "  Run 'docker compose -f infra/docker-compose.yml up -d' for full infrastructure."
echo "========================================================"
