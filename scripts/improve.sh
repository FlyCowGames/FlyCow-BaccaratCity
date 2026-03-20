#!/bin/bash
# ============================================================
# Baccarat City — Hourly Improvement Loop
# ============================================================
# Runs via cron every hour. Spawns Claude CLI (logged-in session)
# to make one improvement, then ensures deploy + git happen.
# ============================================================

set -euo pipefail

PROJECT_DIR="/home/ec2-user/GitHub/FlyCow-BaccaratCity"
LOG_DIR="${PROJECT_DIR}/logs"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID=$(date +"%Y%m%d_%H%M")
LOG_FILE="${LOG_DIR}/session_${SESSION_ID}.log"

mkdir -p "${LOG_DIR}"

# Track session number
SESSION_NUM_FILE="${PROJECT_DIR}/docs/.session_number"
if [ -f "$SESSION_NUM_FILE" ]; then
    SESSION_NUM=$(($(cat "$SESSION_NUM_FILE") + 1))
else
    SESSION_NUM=2
fi
echo "$SESSION_NUM" > "$SESSION_NUM_FILE"

echo "[$TIMESTAMP] Starting improvement session ${SESSION_NUM} (${SESSION_ID})" | tee "$LOG_FILE"

# Update official plugins
cd /home/ec2-user/GitHub/claude-code-plugins && git pull --ff-only 2>/dev/null || true
cd "$PROJECT_DIR"

# ── Prompt ──
PROMPT=$(cat <<'PROMPT_EOF'
You are the Baccarat City improvement agent (Session NUM_PLACEHOLDER). You run every hour to make one meaningful improvement to the living digital twin of Macau.

## Your Process

### Phase 1: CONTEXT
Read these files to understand current state:
- docs/PRIME_DIRECTIVE.md (immutable north star)
- docs/ROADMAP.md (current priorities)
- docs/IDEAS.md (backlog)
- docs/CHANGELOG.md (history)
- docs/CALENDAR.md (Macau events)
- docs/STATE.md (current scene description)
- docs/AGENT_LEARNINGS.md (lessons from past sessions — read this carefully, don't repeat mistakes)
- src/index.html (the code — read first 200 lines + last 50 for structure, grep as needed)

### Phase 2: IDEATE
Based on roadmap priorities and ideas backlog:
1. Identify the single highest-impact improvement for this session
2. Consider: what will make the biggest visible difference?
3. Priority: fix broken things > foundational work > new features > polish
4. Write a brief plan (5-10 lines)

### Phase 3: IMPLEMENT
Build the improvement:
- Edit src/index.html directly (single-file CesiumJS app with Google 3D Tiles)
- Keep changes focused — one improvement per session
- Use /frontend-design skill for any visual/UI work
- Use /brainstorming before design decisions

### Phase 4: REVIEW
Use /verification-before-completion before claiming done:
- Did it address the stated goal?
- Any syntax errors or obvious bugs?
- Does it follow existing code patterns?

### Phase 5: REVISE
Fix any issues found in review. One revision pass.

### Phase 6: DEPLOY
```bash
aws s3 cp src/index.html s3://baccaratcity-site/index.html --content-type "text/html" --cache-control "no-cache"
aws cloudfront create-invalidation --distribution-id E3V8V12C6EPFK6 --paths "/*"
```

### Phase 7: EVOLVE
Update living documents:
1. Append to docs/CHANGELOG.md with session number, date, what you did
2. Update docs/STATE.md to reflect current state
3. Update docs/ROADMAP.md if priorities shifted
4. Update docs/IDEAS.md — check off completed, add new ideas
5. Append to docs/AGENT_LEARNINGS.md — what worked, what didn't, what to try next time
6. Git commit: "Session N: [brief description]"
7. Git push

### Phase 8: META-IMPROVE
Reflect on your own process and improve it:
1. Review this session — was it efficient? Did you waste time on anything?
2. Review scripts/improve.sh — could the prompt be better? Are there missing instructions?
3. Review .claude/CLAUDE.md — does it give the right context?
4. If you see a concrete improvement to the orchestration, make it.
5. The improvement process should get better every cycle.

## Required Skills
- **/frontend-design** — MUST use for all visual/UI work
- **/brainstorming** — MUST use before creative/design decisions
- **/systematic-debugging** — MUST use when encountering bugs
- **/verification-before-completion** — MUST use before deploying
- **/web-operations** — Use for fetching weather/event data
- **/agent-browser** — Use to verify the live site renders correctly

## Rules
- ONE improvement per session. Do it well.
- Read PRIME_DIRECTIVE.md first — it's your compass.
- Read AGENT_LEARNINGS.md — don't repeat past mistakes.
- Fix broken things before adding new features.
- Commit and push every session.
- Be bold with ideas, disciplined with implementation.
- Living documents (ROADMAP, IDEAS, LEARNINGS) should evolve every session.
- IMPROVE YOURSELF: update this script, CLAUDE.md, or docs if you see a way to make the process better.
- CRITICAL: You MUST complete phases 6 (deploy) and 7 (evolve/git) before finishing.
PROMPT_EOF
)

PROMPT="${PROMPT//NUM_PLACEHOLDER/$SESSION_NUM}"

# ── Run Claude CLI (logged-in session, no API key, no budget limit) ──
echo "[$TIMESTAMP] Launching Claude CLI (Opus 4.6, Session ${SESSION_NUM})..." | tee -a "$LOG_FILE"

cd "$PROJECT_DIR"
claude -p \
  --dangerously-skip-permissions \
  --model claude-opus-4-6 \
  "$PROMPT" \
  2>&1 | tee -a "$LOG_FILE"

AGENT_EXIT=${PIPESTATUS[0]}
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Agent exited with code ${AGENT_EXIT}" | tee -a "$LOG_FILE"

# ── Safety net: ensure deploy + git happen even if agent skipped them ──

# Deploy if src/index.html was modified
if ! git diff --quiet src/index.html 2>/dev/null; then
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Safety net: deploying to S3..." | tee -a "$LOG_FILE"
    aws s3 cp src/index.html s3://baccaratcity-site/index.html \
        --content-type "text/html" --cache-control "no-cache" 2>&1 | tee -a "$LOG_FILE"
    aws cloudfront create-invalidation --distribution-id E3V8V12C6EPFK6 \
        --paths "/*" 2>&1 | tee -a "$LOG_FILE"
fi

# Git commit + push if there are any uncommitted changes
if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Safety net: committing and pushing..." | tee -a "$LOG_FILE"
    git add -A
    git commit -m "Session ${SESSION_NUM}: automated improvement (safety-net commit)" 2>&1 | tee -a "$LOG_FILE"
    git push origin main 2>&1 | tee -a "$LOG_FILE"
fi

ENDTIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "[$ENDTIME] Session ${SESSION_NUM} fully complete." | tee -a "$LOG_FILE"

# Keep last 168 logs (1 week)
find "${LOG_DIR}" -name "session_*.log" -mtime +7 -delete 2>/dev/null || true
