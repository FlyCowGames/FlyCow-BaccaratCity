# Baccarat City — Agent Instructions

## Project Overview
Living digital twin of Macau at baccaratcity.com. Single-page Three.js WebGL application.

## Architecture
- `src/index.html` — The assembled single-file application (deployed to S3)
- `src/modules/*.js` — Individual module source files for development
- `docs/` — Living documents that guide the hourly improvement loop
- `scripts/improve.sh` — The cron-triggered improvement orchestrator

## Module System
The app is a single HTML file with all JS in one `<script type="module">` block.
Modules use IIFEs that register via `window.BACCARAT.registerModule({init, update})`.

Module load order (matters!):
1. core-engine.js — Scene, camera, renderer, post-processing, animation loop
2. city-geometry.js — Buildings, roads, ground
3. entities.js — Vehicles, pedestrians
4. atmosphere.js — Day/night cycle, lighting
5. baccarat.js — Baccarat tables, card dealing
6. cinematic.js — Camera flythrough sequence
7. spectacle.js — Visual effects (water, fireworks, etc.)
8. interaction.js — Click/hover, tooltips, zoom-to

## Shared Contract
- `window.BACCARAT` namespace exposes: scene, camera, renderer, composer, THREE, registerModule
- World units: 1 unit = 1 meter
- Color palette: gold=0xd4af37, dark=0x0a0a12
- Macau time: UTC+8 (real clock, not accelerated)

## AWS Infrastructure
- S3 bucket: baccaratcity-site
- CloudFront distribution: E3V8V12C6EPFK6 (d3aidg7x90vx22.cloudfront.net)
- ACM cert: arn:aws:acm:us-east-1:870314670072:certificate/53a4b50e-b1e4-4d55-8490-2b54e316dd6d
- Domain: baccaratcity.com (Route 53 hosted zone Z09459563I7YEIV5VHCL)
- AWS profile: default (FlyCow account 870314670072)

## Deploy Commands
```bash
aws s3 cp src/index.html s3://baccaratcity-site/index.html --content-type "text/html" --cache-control "no-cache"
aws cloudfront create-invalidation --distribution-id E3V8V12C6EPFK6 --paths "/*"
```

## Git
- Repo: FlyCowGames/FlyCow-BaccaratCity
- Commit after every improvement session
- Message format: "Session N: [brief description]"

## Key Rules
- Read docs/PRIME_DIRECTIVE.md — it's the immutable north star
- Read docs/ROADMAP.md — it tells you what to work on
- ONE improvement per session
- Fix broken things before adding new features
- Update all living documents after each change
