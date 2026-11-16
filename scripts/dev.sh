#!/usr/bin/env bash
# CRAVELAB - Concurrent Dev Server Runner
set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🔥 Starting CRAVELAB AI Culinary Platform..."

# 1. Start FastAPI backend
echo "🍽️  Starting FastAPI Backend on http://127.0.0.1:8000..."
cd "$PROJECT_ROOT/backend"
PYTHONPATH="$PROJECT_ROOT/backend" "$PROJECT_ROOT/backend/.venv/bin/uvicorn" app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

# 2. Start Next.js frontend
echo "✨ Starting Next.js Frontend on http://localhost:3000..."
cd "$PROJECT_ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

cleanup() {
    echo ""
    echo "🛑 Shutting down CRAVELAB servers..."
    kill "$BACKEND_PID" 2>/dev/null || true
    kill "$FRONTEND_PID" 2>/dev/null || true
    exit 0
}

trap cleanup INT TERM

wait

