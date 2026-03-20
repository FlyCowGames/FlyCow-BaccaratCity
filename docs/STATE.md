# Current State

*Rewritten each session to reflect what exists now.*

## Last Updated: 2026-03-20 (Session 8)

## Scene Description
- CesiumJS viewer with Google Photorealistic 3D Tiles -- real Macau photogrammetry
- Cinematic 5-stage flythrough: bird's eye > Cotai sweep > street level > Grand Lisboa orbit > casino district overview
- 8 landmark billboards: Grand Lisboa, Venetian, Macau Tower, Ruins of St. Paul's, Galaxy, Wynn Palace, A-Ma Temple, City of Dreams
- Real-time day/night cycle driven by actual Macau time (UTC+8) via CesiumJS sun position
- Live weather from Open-Meteo API: temperature, conditions, humidity, wind, cloud cover
- Weather-reactive atmosphere: rain overlay, fog, cloud-dimmed lighting
- **Animated ferry boats**: 5 ferries on 2 routes (Outer Harbour-Taipa, Inner Harbour-Taipa), continuously moving
- **Animated road traffic**: 19 vehicles on 5 routes (3 bridges, Cotai Strip, peninsula road), continuously moving
- **Airport flights**: 4 planes on 2 routes (approach from south descending, departure north climbing), continuously animating
- **Neon casino glow**: 11 glow zones with bloom post-processing, active at night (19:00-05:00) with dusk/dawn ramps
- Dark/gold branding overlay: "BACCARAT CITY" / "百家樂之城 - 澳門風雲"
- Real-time Macau clock with day/night/golden hour indicator

## Technical Stack
- CesiumJS 1.119 from CDN
- Google Photorealistic 3D Tiles (API key on mega-agent-flycow project 914103293251)
- Open-Meteo API (free, no key) for weather data
- CesiumJS bloom post-processing for neon glow
- Single HTML file (~1631 lines, ~54KB)
- Custom CSS overlay with Cinzel + Noto Sans SC + DM Mono fonts
- Deployed: S3 (baccaratcity-site) > CloudFront (E3V8V12C6EPFK6) > baccaratcity.com

## What Works
- Photorealistic 3D rendering of all Macau
- Cinematic flythrough with smooth camera transitions
- Landmark billboards with Chinese/English names
- Click landmark to fly to it
- Replay button for cinematic
- Drag to orbit, scroll to zoom
- Loading screen with progress bar
- Real-time day/night cycle (sun/moon position)
- Live weather display (temp, conditions, humidity, wind, clouds)
- Rain effect (CSS overlay) when weather is rainy
- Fog effect when weather is foggy or heavily overcast
- Light dimming based on cloud cover
- Ferry boats animating across the harbor between Peninsula and Taipa
- **Road traffic**: 19 cars on 5 routes (3 bridges, Cotai Strip, peninsula)
- **Airport flights**: 4 planes approaching and departing Macau International Airport
- **Neon casino glow** at night with radial light billboard entities

## What's Missing (vs Prime Directive)
- Event system (F3, CNY, festivals)
- ~~Airport planes~~ (Done Session 8)
- Casino interior / baccarat tables
- Audio
- Interactive exploration (click buildings for info)
- Typhoon signal weather effects (T1-T10)
