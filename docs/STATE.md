# Current State

*Rewritten each session to reflect what exists now.*

## Last Updated: 2026-03-20 (Session 1)

## Scene Description
- CesiumJS viewer with Google Photorealistic 3D Tiles — real Macau photogrammetry
- Cinematic 5-stage flythrough: bird's eye → Cotai sweep → street level → Grand Lisboa orbit → casino district overview
- 8 landmark billboards: Grand Lisboa, Venetian, Macau Tower, Ruins of St. Paul's, Galaxy, Wynn Palace, A-Ma Temple, City of Dreams
- Night atmosphere (clock set to 8:30 PM Macau time)
- Dark/gold branding overlay: "BACCARAT CITY" / "百家樂之城 · 澳門風雲"
- Real-time Macau clock (UTC+8)

## Technical Stack
- CesiumJS 1.119 from CDN
- Google Photorealistic 3D Tiles (API key on mega-agent-flycow project 914103293251)
- Single HTML file (~600 lines, ~20KB)
- Custom CSS overlay with Cinzel + Noto Sans SC + DM Mono fonts
- Deployed: S3 (baccaratcity-site) → CloudFront (E3V8V12C6EPFK6) → baccaratcity.com

## What Works
- Photorealistic 3D rendering of all Macau
- Cinematic flythrough with smooth camera transitions
- Landmark billboards with Chinese/English names
- Click landmark to fly to it
- Replay button for cinematic
- Drag to orbit, scroll to zoom
- Loading screen with progress bar

## What's Missing (vs Prime Directive)
- Real-time weather (rain, fog, temperature)
- Real-time Macau clock driving day/night (currently hardcoded to 8:30 PM)
- Event system (F3, CNY, festivals)
- Animated traffic, ferries, planes
- Casino interior / baccarat tables
- Neon sign effects / light beams
- Audio
- Interactive exploration (click buildings for info)
