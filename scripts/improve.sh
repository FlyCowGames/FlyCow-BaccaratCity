#!/bin/bash
# ============================================================
# Baccarat City — Hourly Improvement Loop
# Wrapper for the Node.js Agent SDK orchestrator
# ============================================================

set -euo pipefail

PROJECT_DIR="/home/ec2-user/GitHub/FlyCow-BaccaratCity"
LOG_DIR="${PROJECT_DIR}/logs"
mkdir -p "${LOG_DIR}"

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Starting improvement via Agent SDK orchestrator" | tee -a "${LOG_DIR}/cron.log"

cd "$PROJECT_DIR"
node scripts/improve.mjs 2>&1 | tee -a "${LOG_DIR}/cron.log"

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Orchestrator finished" | tee -a "${LOG_DIR}/cron.log"

# Clean old logs (keep 1 week)
find "${LOG_DIR}" -name "session_*.log" -mtime +7 -delete 2>/dev/null || true
