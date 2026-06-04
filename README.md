# British Birds Expedition

A stabilised pass-and-play British birds quiz app built with React, TypeScript, and Vite.

## Phase 2 status

This phase keeps the clean GitHub Pages foundation and starts migrating more of the original prototype back in safely:

- 388 species cards from the app's curated species list.
- 20 quiz rounds with richer styles: identification, habitat, group, diet, conservation, migration, wingspan, clutch size, rarity, and finale.
- Gear-shaped player state for binoculars, sonic sweep, thermal scope, golden lure, and guard shield.
- Working binoculars flow in the UI, using the new gear model rather than the old flat `binoculars` field.
- Action-card data and game-engine helpers for family reveal, double points, streak protection, remove wrong answers, redraw question, and gain binoculars.
- LocalStorage save/resume using a new v2 save key so older saved games do not conflict with the new player shape.
- Immutable player score, gear, card, streak, and stat updates.
- GitHub Pages deployment workflow.

## Development

```bash
npm install
npm run dev
npm run build
```

`npm run build` validates the species data, validates the 20-round definition file, type-checks the code, and builds the Vite app.

## Hosting on GitHub Pages

This repository is designed to deploy through GitHub Actions. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

GitHub Pages hosts the static app. The old Express/Gemini image and audio routes from the prototype are not included in this static phase because GitHub Pages cannot run a Node/Express server.

## Next migration steps

1. Wire every action card to the UI buttons, not just the game-engine helpers.
2. Add a dedicated shop/hub screen between rounds.
3. Move the richer original bird-data fields into the GitHub build.
4. Move more round-specific UI into standalone components.
5. Add committed SVG or generated image assets for bird cards.
6. Reintroduce AI image/audio features on a Node-capable host such as Render, Railway, Fly.io, or Cloud Run.
7. Add unit tests for scoring, round setup, gear, and action cards.
