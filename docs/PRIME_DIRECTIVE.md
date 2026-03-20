# Prime Directive

**This document is immutable. It defines the north star for this project.**

## Mission

Build a living, breathing digital twin of Macau at **baccaratcity.com**.

## Core Principles

1. **Real Geography** — The map must be recognizable as Macau to someone who has been there. The Macau Peninsula, Taipa, Cotai, Coloane, the three bridges, the harbor — all accurate.

2. **Real Landmarks** — Grand Lisboa, Ruins of St. Paul's, Macau Tower, The Venetian, MGM, Wynn, Galaxy, City of Dreams, A-Ma Temple, Senado Square — placed where they actually are.

3. **Real Time** — The scene runs on Macau time (UTC+8). If it's 2am in Macau, it's night. If it's noon, the sun is overhead.

4. **Real Weather** — Current Macau weather reflected in the scene: rain, fog, sunshine, cloud cover, temperature affecting the atmosphere.

5. **Real Events** — A calendar of actual Macau events reflected in the city: F3 Grand Prix (cars racing the Guia Circuit), Chinese New Year (fireworks, lanterns, decorations), Mid-Autumn Festival, Dragon Boat races, casino openings, concerts.

6. **Living & Breathing** — People walk, cars drive, ferries cross the harbor, planes land at the airport, construction cranes move. The city is never static.

7. **Entertainment** — This is not a dry simulation. It should be mesmerizing, cinematic, and explorable. Camera flythroughs, interactive exploration, ambient sound, dramatic lighting.

8. **Baccarat is the Soul** — Macau is the world capital of baccarat. Casino interiors with baccarat tables, card dealing, the culture of gambling — this is the signature feature.

## Technical Stack

- Three.js (WebGL) for 3D rendering
- Single-page web application at baccaratcity.com
- Real-time weather API (OpenWeatherMap or similar)
- Event calendar data
- Deployed via AWS (S3 + CloudFront)

## Iteration Philosophy

This project improves continuously through automated hourly sessions. Each session:
- Reviews current state
- Ideates improvements
- Implements the highest-impact change
- Reviews and revises
- Deploys
- Evolves the roadmap

The roadmap, ideas backlog, and instructions are living documents that morph over time. Only this Prime Directive remains constant.
