# Changelog

## 1.1.0-phase-2

- Added richer 20-round definitions in `src/data/rounds.ts`.
- Added gear-shaped player state: binoculars, sonic sweep, thermal scope, golden lure, and guard shield.
- Added action card deck and game-engine helpers.
- Added working gear and action-card UI wiring for binoculars, sonic, thermal, lure, shield, family reveal, double points, streak protection, remove wrong answers, redraw question, and gain binoculars.
- Added streak and best-streak tracking.
- Moved saved-game storage to a v2 key so older saved games do not conflict with the new player state shape.
- Updated validation to use the new rounds file.

## 1.0.0-stabilised

- Added lean GitHub-ready React/Vite implementation.
- Added immutable scoring and player-stat updates.
- Added Fisher-Yates randomisation helper.
- Added localStorage save/resume support.
- Fixed Rarity Sweepstake semantics so rarity, not clutch size, determines the answer.
- Added 20-round data validation.
- Removed dependency on runtime AI image/audio endpoints for the static hosted version.
- Added GitHub Pages deployment workflow.
