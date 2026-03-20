#!/bin/bash
# ============================================================
# Baccarat City — Hourly Improvement Loop
# Direct CLI invocation. Claude handles its own orchestration.
# ============================================================
set -euo pipefail

PROJECT_DIR="/home/ec2-user/GitHub/FlyCow-BaccaratCity"
LOG_DIR="${PROJECT_DIR}/logs"
SESSION_FILE="${PROJECT_DIR}/docs/.session_number"
PROMPT_FILE="${PROJECT_DIR}/scripts/prompt.md"

mkdir -p "${LOG_DIR}"
cd "$PROJECT_DIR"

# ── Session number ──
PREV=$(cat "$SESSION_FILE" 2>/dev/null || echo "0")
SESSION=$((PREV + 1))
echo "$SESSION" > "$SESSION_FILE"

TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
LOG_FILE="${LOG_DIR}/session_${SESSION}_$(date -u +%Y%m%d_%H%M).log"

log() { echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"; }

log "Starting session ${SESSION}"

# ── Update plugins ──
(cd /home/ec2-user/GitHub/claude-code-plugins && git pull --ff-only 2>/dev/null) || true

# ── Build prompt with session number ──
sed "s/{{SESSION}}/${SESSION}/g" "$PROMPT_FILE" > /tmp/baccarat_prompt_${SESSION}.md

# ── Run Claude CLI ──
log "Launching Claude CLI (Opus 4.6)..."

claude -p "$(cat /tmp/baccarat_prompt_${SESSION}.md)" \
  --dangerously-skip-permissions \
  --model claude-opus-4-6 \
  2>&1 | tee -a "$LOG_FILE"

EXIT_CODE=${PIPESTATUS[0]}
log "Claude exited with code ${EXIT_CODE}"

# ── Safety nets ──
# Deploy if index.html changed but wasn't deployed
if git diff --quiet src/index.html 2>/dev/null; then
  log "No changes to index.html — skipping deploy safety net"
else
  if ! grep -q "s3://baccaratcity" "$LOG_FILE" 2>/dev/null; then
    log "Safety net: deploying to S3..."
    aws s3 cp src/index.html s3://baccaratcity-site/index.html \
      --content-type "text/html" --cache-control "no-cache" 2>&1 | tee -a "$LOG_FILE"
    aws s3 cp src/improvements.html s3://baccaratcity-site/improvements.html \
      --content-type "text/html" --cache-control "no-cache" 2>&1 | tee -a "$LOG_FILE"
    aws s3 cp src/data/improvements.json s3://baccaratcity-site/data/improvements.json \
      --content-type "application/json" --cache-control "no-cache" 2>&1 | tee -a "$LOG_FILE"
    aws cloudfront create-invalidation --distribution-id E3V8V12C6EPFK6 \
      --paths "/*" 2>&1 | tee -a "$LOG_FILE"
  fi
fi

# Commit+push if there are uncommitted changes
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  if ! grep -q "git push" "$LOG_FILE" 2>/dev/null; then
    log "Safety net: committing and pushing..."
    git add -A
    git commit -m "Session ${SESSION}: automated improvement (safety-net)" 2>&1 | tee -a "$LOG_FILE"
    git push origin main 2>&1 | tee -a "$LOG_FILE"
  fi
fi

# ── Cleanup ──
rm -f /tmp/baccarat_prompt_${SESSION}.md
find "${LOG_DIR}" -name "session_*.log" -mtime +7 -delete 2>/dev/null || true

log "Session ${SESSION} complete."
