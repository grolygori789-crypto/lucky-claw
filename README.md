# Lucky Claw

**Premium bilingual HTML5 claw-machine game by Benedict Interactive**

> Working title. The product name may change later without changing the repository architecture.

Lucky Claw is a portrait-first mobile claw-machine game designed to feel polished, charming, collectible, and difficult to put down while deliberately staying within a medium-or-lower implementation ceiling.

## North Star

**Make the game look more expensive than it is to engineer.**

Premium perception should come from art direction, motion, sound, feedback, progression, and UX—not unnecessary 3D, heavyweight physics, backend complexity, or fragile technology.

## Non-negotiables

- Real playable HTML/CSS/JavaScript implementation.
- Portrait-first mobile UX.
- Development complexity: medium or lower.
- Thai and English must both read naturally and natively.
- Premium, clean, responsive UI with polished micro-interactions.
- Strong collect/unlock/replay loops without manipulative dark patterns.
- Cabinet themes are cosmetic and earned through gameplay progression.
- Canonical paths and overwrite-in-place updates; no version-suffixed junk files.
- No secrets or credentials in this public repository.

## Authoritative docs

- [`docs/MASTER_PLAN.md`](docs/MASTER_PLAN.md) — product, game design, UX, architecture, economy, roadmap, QA and Definition of Done.
- [`docs/BUILD_PROTOCOL.md`](docs/BUILD_PROTOCOL.md) — repository cleanliness, upload rules, naming, overwrite policy and QA gate.

## Planned stack

- HTML5
- CSS
- Vanilla JavaScript / ES modules
- Canvas 2D where gameplay benefits from it
- DOM for UI/text/menus
- Local persistence
- PWA after core stability
- GitHub Pages

## Repository map

```text
/
├── README.md
├── .editorconfig
├── .gitignore
├── docs/
│   ├── MASTER_PLAN.md
│   └── BUILD_PROTOCOL.md
├── src/
│   ├── css/
│   ├── js/
│   │   ├── core/
│   │   ├── gameplay/
│   │   ├── screens/
│   │   ├── systems/
│   │   └── data/
│   └── locales/
└── assets/
    ├── brand/
    ├── ui/
    ├── machines/
    ├── plushies/
    ├── effects/
    ├── audio/
    └── fonts/
```

Planned directories appear when production content reaches them; Git history remains the archive instead of keeping speculative empty folders.

## Status

**Build 001 — Pre-main-menu Foundation**

Current production includes the bilingual app shell, Benedict Games intro, Lucky Claw title treatment, first-run language selection, persistence, responsive portrait baseline, and the approved Classic Pink cabinet base.

Next production batch: **Build 002 — Main Menu Shell**.
