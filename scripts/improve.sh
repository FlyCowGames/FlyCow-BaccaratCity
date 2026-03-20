#!/bin/bash
# ============================================================
# Baccarat City — Hourly Improvement Loop
# ============================================================
# Runs via cron every hour. Spawns Claude CLI to:
# 1. Review current state
# 2. Ideate improvements
# 3. Implement the highest-impact change
# 4. Self-review and revise
# 5. Deploy to S3 + CloudFront
# 6. Update living documents
# ============================================================

set -euo pipefail

PROJECT_DIR="/home/ec2-user/GitHub/FlyCow-BaccaratCity"
LOG_DIR="${PROJECT_DIR}/logs"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID=$(date +"%Y%m%d_%H%M")
LOG_FILE="${LOG_DIR}/session_${SESSION_ID}.log"

# Ensure log directory exists
mkdir -p "${LOG_DIR}"

echo "[$TIMESTAMP] Starting improvement session ${SESSION_ID}" | tee "$LOG_FILE"

# Build the prompt with full context
PROMPT=$(cat <<'PROMPT_EOF'
You are the Baccarat City improvement agent. You run every hour to make one meaningful improvement to the living digital twin of Macau.

## Your Working Directory
/home/ec2-user/GitHub/FlyCow-BaccaratCity

## Your Process

### Phase 1: CONTEXT (read these files)
Read the following files to understand the current state:
- docs/PRIME_DIRECTIVE.md (your north star — never changes)
- docs/ROADMAP.md (current priorities)
- docs/IDEAS.md (backlog)
- docs/CHANGELOG.md (what's been done)
- docs/CALENDAR.md (Macau events)
- docs/STATE.md (current scene description)
- src/index.html (the actual code — read the first 200 lines and last 50 to understand structure, then grep for specific sections as needed)

### Phase 2: IDEATE
Based on the roadmap priorities and ideas backlog:
1. Identify the single highest-impact improvement you can make in this session
2. Consider: what will make the biggest visible difference?
3. Prefer: fixing broken things > foundational work > new features > polish
4. Write a brief plan (5-10 lines) of what you'll do

### Phase 3: IMPLEMENT
Build the improvement:
- Edit src/index.html directly (it's the single-file app)
- Or edit individual src/modules/*.js files if working on a specific module
- If editing modules, you MUST also reassemble src/index.html from all modules
- Test by checking for syntax errors (node --check won't work for browser JS, but you can look for obvious issues)
- Keep changes focused — one improvement per session

### Phase 4: REVIEW
Review your own work:
- Did it address the stated goal?
- Any syntax errors or obvious bugs?
- Does it follow the existing code patterns?
- Is it the minimal change needed?

### Phase 5: REVISE
Fix any issues found in review. One revision pass only.

### Phase 6: DEPLOY
Run these commands:
```bash
aws s3 cp src/index.html s3://baccaratcity-site/index.html --content-type "text/html" --cache-control "no-cache"
aws cloudfront create-invalidation --distribution-id E3V8V12C6EPFK6 --paths "/*"
```
(If the S3 bucket or CloudFront doesn't exist yet, note it in the changelog and skip deploy.)

### Phase 7: EVOLVE
Update the living documents:
1. Append to docs/CHANGELOG.md with session number, date, and what you did
2. Update docs/STATE.md to reflect what exists now
3. Update docs/ROADMAP.md if priorities have shifted
4. Update docs/IDEAS.md — check off completed items, add new ideas discovered
5. Git commit all changes with message: "Session N: [brief description]"
6. Git push

## Required Skills (invoke these via slash commands)
You have access to 52+ skills via the .claude/skills/ directory. USE THEM. Key skills for this project:

- **/frontend-design** — MUST invoke for ALL visual/UI/frontend work. Generates distinctive, production-grade interfaces. Avoids generic AI aesthetics. Bold typography, color, motion, spatial composition.
- **/brainstorming** — MUST invoke before any creative/design work. Explores intent, requirements, and design before implementation.
- **/writing-plans** — MUST invoke when planning multi-step implementation. Creates structured plans with dependencies.
- **/systematic-debugging** — MUST invoke when encountering any bug or unexpected behavior. Diagnose before fixing.
- **/verification-before-completion** — MUST invoke before claiming work is done. Evidence before assertions.
- **/requesting-code-review** — Invoke after completing implementation to verify quality.
- **/web-operations** — Use for fetching Macau weather data, event info, map data from APIs.
- **/image-generation** — Use when you need reference images or visual assets.
- **/agent-browser** — Use to check the live site, take screenshots, verify rendering.

## Rules
- ONE improvement per session. Do it well.
- Always read the prime directive first — it's your compass.
- The roadmap tells you what to prioritize. Follow it unless you see something more urgent.
- If something is broken, fix it before adding new things.
- Commit and push every session, even if the change is small.
- Be bold with ideas but disciplined with implementation.
- The instructions (ROADMAP, IDEAS) should morph over time. Add to them. Reprioritize.
- ALWAYS invoke /brainstorming before design decisions.
- ALWAYS invoke /verification-before-completion before deploying.
- ALWAYS invoke /systematic-debugging when something breaks.
PROMPT_EOF
)

# Run Claude CLI with the prompt
echo "[$TIMESTAMP] Launching Claude CLI..." | tee -a "$LOG_FILE"

claude --print \
  --dangerously-skip-permissions \
  --model claude-opus-4-6 \
  --max-turns 30 \
  --prompt "$PROMPT" \
  --cwd "$PROJECT_DIR" \
  2>&1 | tee -a "$LOG_FILE"

EXIT_CODE=${PIPESTATUS[0]}

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Session ${SESSION_ID} completed with exit code ${EXIT_CODE}" | tee -a "$LOG_FILE"

# Keep last 168 logs (1 week of hourly runs)
find "${LOG_DIR}" -name "session_*.log" -mtime +7 -delete 2>/dev/null || true
