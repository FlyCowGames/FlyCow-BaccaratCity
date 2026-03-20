#!/usr/bin/env node
// ============================================================
// Baccarat City — Hourly Improvement Orchestrator
// Uses Claude Agent SDK (unstable_v2_prompt — spawns CLI, uses logged-in session)
// ============================================================

import { unstable_v2_prompt } from '@anthropic-ai/claude-agent-sdk';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const PROJECT_DIR = '/home/ec2-user/GitHub/FlyCow-BaccaratCity';
const LOG_DIR = join(PROJECT_DIR, 'logs');
const SESSION_NUM_FILE = join(PROJECT_DIR, 'docs/.session_number');

mkdirSync(LOG_DIR, { recursive: true });

// ── Session tracking ──
let sessionNum = 3;
if (existsSync(SESSION_NUM_FILE)) {
  sessionNum = parseInt(readFileSync(SESSION_NUM_FILE, 'utf8').trim()) + 1;
}
writeFileSync(SESSION_NUM_FILE, String(sessionNum));

const timestamp = () => new Date().toISOString();
const logLines = [];
function log(msg) {
  const line = `[${timestamp()}] ${msg}`;
  logLines.push(line);
  console.log(line);
}

log(`Starting improvement session ${sessionNum}`);

// ── Update plugins ──
try {
  execSync('cd /home/ec2-user/GitHub/claude-code-plugins && git pull --ff-only', { stdio: 'ignore' });
  log('Plugins updated');
} catch { log('Plugin update skipped (no changes or offline)'); }

// ── Build prompt ──
const prompt = `You are the Baccarat City improvement agent (Session ${sessionNum}). You run every hour to make one meaningful improvement to the living digital twin of Macau.

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
\`\`\`bash
aws s3 cp src/index.html s3://baccaratcity-site/index.html --content-type "text/html" --cache-control "no-cache"
aws cloudfront create-invalidation --distribution-id E3V8V12C6EPFK6 --paths "/*"
\`\`\`

### Phase 7: EVOLVE
Update living documents:
1. Append to docs/CHANGELOG.md with session number, date, what you did
2. Update docs/STATE.md to reflect current state
3. Update docs/ROADMAP.md if priorities shifted
4. Update docs/IDEAS.md — check off completed, add new ideas
5. Append to docs/AGENT_LEARNINGS.md — what worked, what didn't, what to try next time
6. Git commit: "Session ${sessionNum}: [brief description]"
7. Git push

### Phase 8: META-IMPROVE
Reflect on your own process and improve it:
1. Was this session efficient?
2. Could scripts/improve.mjs or .claude/CLAUDE.md be improved?
3. Make concrete improvements if you see them.

## Required Skills
- /frontend-design — MUST use for all visual/UI work
- /brainstorming — MUST use before creative/design decisions
- /systematic-debugging — MUST use when encountering bugs
- /verification-before-completion — MUST use before deploying

## Rules
- ONE improvement per session. Do it well.
- Read PRIME_DIRECTIVE.md first. Read AGENT_LEARNINGS.md — don't repeat mistakes.
- Fix broken things before adding new features.
- CRITICAL: You MUST deploy to S3 and git commit+push before finishing.`;

// ── Run agent via SDK ──
log(`Sending prompt to Claude Opus 4.6 via Agent SDK...`);

let result;
try {
  result = await unstable_v2_prompt(prompt, {
    model: 'claude-opus-4-6',
    cwd: PROJECT_DIR,
    dangerouslySkipPermissions: true,
    allowedTools: ['Bash', 'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Agent', 'Skill'],
  });

  log(`Agent completed: ${result.type}/${result.subtype || 'unknown'}`);
  log(`Turns: ${result.num_turns}, Duration: ${Math.round(result.duration_ms / 1000)}s`);
  log(`Cost: $${result.total_cost_usd?.toFixed(4) || 'N/A'}`);
  log(`Stop reason: ${result.stop_reason}`);

  if (result.result) {
    // Log the agent's final output (truncated)
    const output = result.result.slice(0, 2000);
    log(`Agent output:\n${output}`);
  }

  if (result.is_error) {
    log(`Agent returned error: ${result.result}`);
  }
} catch (err) {
  log(`Agent SDK error: ${err.message}`);
}

// ── Safety net: deploy + git if agent didn't ──
process.chdir(PROJECT_DIR);

try {
  const diff = execSync('git diff --name-only src/index.html 2>/dev/null', { encoding: 'utf8' }).trim();
  if (diff) {
    // Check if it was deployed by looking for recent S3 upload in the result
    const agentOutput = result?.result || '';
    if (!agentOutput.includes('s3://baccaratcity') && !agentOutput.includes('S3')) {
      log('Safety net: deploying to S3...');
      execSync('aws s3 cp src/index.html s3://baccaratcity-site/index.html --content-type "text/html" --cache-control "no-cache"');
      execSync('aws cloudfront create-invalidation --distribution-id E3V8V12C6EPFK6 --paths "/*"');
    }
  }
} catch (e) { log(`Deploy safety net: ${e.message}`); }

try {
  const status = execSync('git status --porcelain', { encoding: 'utf8', cwd: PROJECT_DIR }).trim();
  if (status) {
    log('Safety net: committing and pushing...');
    execSync('git add -A', { cwd: PROJECT_DIR });
    execSync(`git commit -m "Session ${sessionNum}: automated improvement (safety-net commit)"`, { cwd: PROJECT_DIR });
    execSync('git push origin main', { cwd: PROJECT_DIR });
  }
} catch (e) { log(`Git safety net: ${e.message}`); }

// ── Write log ──
log(`Session ${sessionNum} complete.`);
const logFile = join(LOG_DIR, `session_${sessionNum}_${new Date().toISOString().replace(/[:.]/g, '').slice(0, 15)}.log`);
writeFileSync(logFile, logLines.join('\n') + '\n');

process.exit(0);
