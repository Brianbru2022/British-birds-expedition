# British Birds Expedition

A stabilised, GitHub-ready pass-and-play British birds quiz app built with React, TypeScript, and Vite.

This repository contains a lean corrected build intended for GitHub hosting. It keeps the core expedition game loop while applying the main fixes from the code review: immutable scoring updates, Fisher-Yates randomisation, local save/resume, corrected Rarity Sweepstake rules, data validation, and a GitHub Pages deployment workflow.

## Features

- 388 deduplicated bird species cards generated from the original app data.
- 20 quiz rounds, including the corrected Round 19 Rarity Sweepstake.
- 2 to 6 local pass-and-play players.
- Immutable player score/stat updates.
- LocalStorage save/resume for interrupted games.
- Lightweight field guide with search.
- No API keys or bundled AI routes required for static hosting.

## Development

```bash
npm install
npm run dev
npm run build
```

`npm run build` validates the data, type-checks the code, and builds the Vite app.

## Hosting on GitHub Pages

The included workflow builds and deploys the app from `main`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

GitHub Pages hosts the static app. The original Express/Gemini image and audio endpoints from the prototype are intentionally not included in this lean hosted build because GitHub Pages cannot run a Node/Express server.

## Next migration steps

The full prototype can still be migrated in phases:

1. Move the remaining round-specific UI from the large prototype into smaller modules.
2. Add proper images or SVG cards through committed assets or durable storage.
3. Reintroduce server-backed AI features on Render, Railway, Fly.io, or Cloud Run.
4. Add unit tests for round logic, gear, action cards, and scoring.
