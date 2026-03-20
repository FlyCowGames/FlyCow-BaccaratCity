#!/bin/bash
# Update official Claude Code plugins from anthropics/claude-code repo
cd /home/ec2-user/GitHub/claude-code-plugins && git pull --ff-only 2>&1
echo "Plugins updated. Skills symlinked via mega-agent2/.claude/skills/"
