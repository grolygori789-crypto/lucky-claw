# LUCKY CLAW — MASTER PLAN

**Document status:** AUTHORITATIVE  
**Product stage:** Pre-production / Foundation  
**Platform:** Mobile web / installable PWA target  
**Orientation:** Portrait  
**Languages:** Thai + English  
**Publisher identity:** Benedict Interactive  
**Working title:** Lucky Claw  
**Technical ceiling:** Medium implementation complexity  
**Primary principle:** Premium through art direction, feedback, and restraint—not engineering excess.

---

## 0. Executive Summary

Lucky Claw is a portrait-first premium casual claw-machine game for mobile browsers and eventual PWA installation. It must feel like a polished mobile game rather than a web demo while remaining fully achievable with HTML, CSS, vanilla JavaScript, Canvas 2D where useful, lightweight media assets, and local persistence.

The emotional product is not “operating a crane.” It is the tension between **precision, uncertainty, near-miss, reward, collection, and progression**.

The game intentionally avoids expensive technical spectacle. No realtime 3D is required. No heavyweight rigid-body plush simulation is required. No backend is required for the initial product. The illusion of physicality should come from high-quality 2D art, controlled animation, hit zones, tuned probabilities, layered sprites, sound, haptics where supported, and believable motion timing.

### Thai product intent

เป้าหมายคือทำให้ผู้เล่นรู้สึกว่าเป็นเกมมือถือพรีเมียมจริงตั้งแต่วินาทีแรก ทั้งที่เบื้องหลังใช้ระบบเว็บที่เรียบง่ายและควบคุมได้ ความสนุกต้องมาจาก “เล็ง–คีบ–ลุ้น–เกือบได้–ได้รางวัล–สะสม–ปลดล็อก” ไม่ใช่จากความซับซ้อนของระบบฟิสิกส์

ทุกฟีเจอร์ต้องผ่าน 2 คำถาม:
1. ทำให้เกมน่าเล่นขึ้น วางยากขึ้น หรืออยากกลับมาเล่นต่อขึ้นจริงหรือไม่
2. ทำได้โดยไม่ผลัก implementation ให้เกินระดับปานกลางหรือไม่

ถ้าไม่ผ่านข้อใดข้อหนึ่ง ต้องลดรูป เปลี่ยนวิธี หรือตัดออก

---

## 1. Product Authority & Decision Framework

The project is operated under a full-authority development model. Product, UX, game design, visual direction, progression, economy, architecture, scope, and implementation decisions optimize for the agreed North Star without requiring approval for every micro-decision.

### Decision priority

When trade-offs exist, decide in this order:

1. Player delight and clarity
2. Core-loop fun and replay pull
3. Premium perception
4. Mobile responsiveness and smoothness
5. Implementation reliability
6. Medium-or-lower complexity ceiling
7. Maintainability
8. Content scalability
9. Nice-to-have spectacle

### Feature acceptance test

A proposed feature should normally satisfy at least two:
- improves the first 30 seconds;
- strengthens claw tension;
- strengthens collection desire;
- creates meaningful progression;
- improves return motivation;
- creates satisfying feedback;
- improves identity/premium feel;
- enables future content at low engineering cost.

A feature that mainly adds engineering work without noticeable player value should be rejected.

---

## 2. Product North Star

### Desired player reaction

- “This is cute.”
- “This feels surprisingly polished.”
- “I get it immediately.”
- “One more try.”
- “I nearly had it.”
- “I want that plush.”
- “I’m almost at the next cabinet.”
- “I’ll come back and finish the collection.”

### Experience pillars

**Instant readability**  
The player understands what to do without a manual.

**Tactile anticipation**  
Movement, sound, button response, claw descent, grip, lift, wobble, slip, and prize drop feel physical despite 2D implementation.

**Collectibility**  
Plushies feel like desirable objects, not score markers.

**Visible progression**  
The player always has a nearby goal: another plush, a mission, a milestone, or a cabinet unlock.

**Premium restraint**  
The UI is glossy, charming, clean, motion-rich, and controlled rather than noisy.

---

## 3. Audience & Positioning

### Core audience

Broad casual mobile players who enjoy:
- claw machines;
- cute collectibles;
- cozy/premium casual games;
- short sessions;
- light progression;
- satisfying rewards.

Cute enough to invite, refined enough not to feel children-only.

### Positioning

**Premium casual arcade collectible.**

Not:
- gambling simulator;
- hardcore crane simulator;
- physics sandbox;
- hyper-casual ad shell;
- children-only toy app.

### Session shapes

- Micro: 1–2 plays
- Normal: 3–8 plays
- Goal session: “Only 300 points until Sakura.”

---

## 4. Core Gameplay Loop

```text
Choose target
↓
Move claw horizontally
↓
DROP
↓
Claw descends
↓
Grip attempt
↓
Lift + tension
↓
Success / slip / near miss
↓
Prize delivery or reset
↓
Points + collection + mission progress
↓
Next attempt
```

This loop is sacred. Meta systems support it; they never bury it.

---

## 5. Core Mechanical Model

### Controls

Initial production control:
- horizontal joystick — the player drags/holds left or right to position the claw;
- SHUFFLE — optional hold control that stirs/repositions the plush pile for up to approximately 15 seconds per attempt;
- DROP — the primary action that commits the attempt.

SHUFFLE is a low-complexity agency feature: presentation may imply a physical mixing mechanism, while implementation uses controlled plush repositioning and motion rather than full rigid-body simulation.

After DROP:
- automatic descent;
- automatic close/grip;
- automatic lift;
- automatic travel to prize chute on successful carry;
- automatic release;
- reset.

This is intentionally simpler and better for portrait mobile than full crane-simulator control.

### Plush data model

Each plush should be data-driven:

```text
id
rarity
displayNameKey
sprite
x / y
renderDepth
grabZone
weight
gripDifficulty
value
collectionSet
```

### Grab evaluation

A claw attempt can evaluate:
- overlap with grab zone;
- distance from ideal grab point;
- plush difficulty;
- controlled variability;
- context that does not violate fairness.

The result drives animation states rather than heavyweight physics.

### Useful outcomes

1. Clean miss
2. Weak grab / early slip
3. Late slip
4. Successful carry

Near misses must feel plausible, not rigged.

### Fairness rule

Probability may model imperfect grip, but player precision must matter materially.

Strong aim must be observably better than poor aim. Never build an opaque “the game decided you lose” system.

---

## 6. Prize Delivery

The visible prize chute is a permanent part of the machine fantasy.

Successful sequence:

```text
grip
→ rise
→ travel to chute
→ release
→ visible drop/ramp
→ reward reveal
```

The chute uses controlled animation paths rather than full physics.

The physical payoff should happen before the reward card whenever possible.

---

## 7. Collection System

### Purpose

Collection is the strongest low-complexity long-term retention system.

A won plush becomes permanently visible in the collection.

### Initial rarity model

- Common
- Uncommon
- Rare
- Epic
- Secret / Special

Avoid excessive rarity tiers.

### Collection sets

Examples:
- Cozy Friends
- Tiny Paws
- Forest Party
- Lucky Stars

Sets should be data-driven so new content rarely changes engine code.

### Duplicates

Preferred initial behavior:
- first copy unlocks the collectible;
- duplicates award bonus Claw Points;
- duplicate milestones may feed missions.

No crafting system in the initial product.

---

## 8. Progression & Economy

### Primary earnable currency

Working name: **Claw Points**

Purpose:
- reward play;
- create forward progress;
- unlock cosmetic cabinet themes;
- power missions and milestones.

### Economy philosophy

Create pleasant “almost there” pull without grind.

The player should see:
- short goals;
- medium goals;
- aspirational goals.

### Earn sources

- successful captures;
- rarity bonus;
- first-time collection bonus;
- missions;
- collection milestones;
- optional session reward only if it improves flow.

### Cosmetic fairness

Cabinet themes never improve grip strength or capture probability.

---

## 9. Cabinet Theme System

### Product role

Themes provide:
- aspiration;
- personalization;
- status;
- visual freshness;
- cheap future content expansion.

### Architecture

Themes are config-driven skins, not separate gameplay implementations.

A theme may define:

```text
frame asset
interior background
floor asset
LED/accent tokens
button treatment
ambient effect
reward effect
optional audio cue
localized display name
unlock cost
```

The claw engine remains shared.

### Recommended ladder

1. Classic Pink — free
2. Midnight Arcade
3. Sakura Dream
4. Ocean Pop
5. Galaxy Claw
6. Royal Gold
7. Neon Tokyo
8. Secret Cabinet — milestone unlock

Exact prices require playtesting.

### Preview-before-unlock

Locked themes must be previewable at full cabinet scale with:
- locked state;
- current points;
- required points;
- UNLOCK when affordable.

### Rule

Cosmetic theme choice must never change win odds.

---

## 10. Missions

### Purpose

Turn ordinary play into short-term goals.

### Initial mission types

- Win 2 plushies
- Collect a new plush
- Win Rare or higher
- Play 5 rounds
- Earn 500 Claw Points

### Complexity rule

Missions derive from events already tracked by the game.

Do not build bespoke mechanics only to satisfy a mission.

---

## 11. Screen Architecture

### First launch

```text
Publisher / game-brand splash
→ Lucky Claw logo reveal
→ Welcome + language selection
→ Main Menu
```

### Returning launch

```text
Short splash / asset warm-up
→ Main Menu
```

### Splash

Preferred:
- Benedict Interactive remains the parent identity;
- optional playful game-label treatment may appear visually;
- no long cinematic;
- approx. 2.6–3.0 seconds for the approved Benedict Games intro; reduced-motion mode may shorten nonessential presentation.

Possible motion:
- cabinet lights activate;
- logo fades/scales;
- tiny claw idle movement.

### Language selection

First-run only.

Options:
- ไทย
- English

Browser language may preselect, but player can override.

### Title cabinet presentation

The approved Classic Pink cabinet base is the tall-phone production plate at **841×1870 (~9:20)**. Runtime framing preserves this aspect ratio and scales the stage to cover the viewport; it must never stretch the cabinet. On non-target phone ratios, only a small amount of the outer cabinet frame may crop so the game still reads as full-screen rather than a centered poster with empty bands.

The cabinet base remains a clean physical plate. Title presentation adds production layers rather than baking controls or effects into the cabinet image:
- curated Title Plush Layer when its final transparent asset is approved;
- separate claw layer when its final transparent asset is approved;
- restrained front-glass overlay;
- DOM/CSS 2.5D joystick, monitor, SHUFFLE button, and DROP button anchored to the cabinet deck.

On Title, the control set is a powered-on showcase state: visually complete, premium, and non-interactive. It must not look greyed-out or broken. Gameplay later reuses the same control geometry and changes it to an interactive state, avoiding a visual jump between Title and play.

The front glass is a foreground visual layer, not an input surface. It uses restrained laminated-glass edge highlights, a soft directional reflection, and low-opacity sheen; reflection must stay subtle enough that plush targets and the claw remain easy to read.

The control deck follows one coherent hardware-console language: pearl enamel, champagne-gold trim, smoked rose display glass, shallow perspective, and shared lighting. Joystick, monitor, SHUFFLE, and DROP must read as mounted hardware from the same machine—not independent web widgets placed over an image.


---

## 12. Main Menu

The Main Menu must answer:
- How do I play?
- What am I collecting?
- What can I unlock?
- What should I do next?

### Hierarchy

Primary:
- PLAY

Secondary:
- Collection
- Themes
- Missions

Utility:
- Settings
- points display

The selected cabinet should act as the hero visual so theme ownership matters continuously.

---

## 13. Gameplay Screen

### Portrait hierarchy

Approximate:
- top HUD: 7–10%
- cabinet/gameplay: 62–70%
- controls: 18–22%
- secondary status/nav only if it does not steal useful gameplay area.

### HUD

Keep minimal:
- points;
- plays/tickets only if retained;
- timer only if it creates useful tension;
- pause/settings.

Avoid currency bloat.

### Controls

The approved physical cabinet art keeps the control deck visually clean. Interactive controls are DOM/CSS 2.5D overlays anchored to the cabinet coordinate system so visual size and touch-target size can be tuned independently.

Large touch targets:
- horizontal joystick;
- SHUFFLE;
- DROP.

DROP is the emotional primary action and receives the strongest tactile treatment. SHUFFLE is secondary and must never compete visually with DROP. Touch hit areas may extend invisibly beyond the rendered control artwork where needed for comfortable one-handed play.

---

## 14. Premium UI Design Language

### Target identity

- cute-premium;
- luxury arcade;
- glossy but clean;
- warm;
- collectible;
- polished mobile-game finish.

Avoid:
- cheap casino chrome;
- excessive neon;
- generic web-app styling;
- toddler-only visual language.

### Material vocabulary

Use CSS + lightweight raster/SVG art to imply:
- pearl enamel;
- soft acrylic;
- subtle chrome;
- clean glass;
- warm LEDs;
- plush/satin softness.

### Premium through restraint

Premium perception comes from:
- spacing;
- typography;
- motion timing;
- controlled highlights;
- visual hierarchy;
- responsive feedback;
- coherent audio;
- clean assets.

Not blur/glow everywhere.

---

## 15. Approved UI Effects

Low-to-medium complexity:
- soft acrylic/glass panels;
- controlled backdrop blur where performant;
- restrained LED glow;
- press compression;
- subtle specular sweep;
- reward sparkle burst;
- animated number gain;
- card reveal;
- tab motion;
- gentle cabinet idle lighting;
- limited plush idle motion;
- limited parallax;
- smooth dialogs.

### Performance rule

If an effect causes visible jank on ordinary modern mobile hardware, simplify or remove it.

Smoothness is premium.

### Reduced motion

Respect `prefers-reduced-motion` for nonessential animation.

---

## 16. Audio & Haptics

### SFX should reinforce

- button press;
- rail movement;
- claw descent;
- claw close;
- grip tension;
- slip;
- prize chute;
- reward reveal;
- theme unlock.

Short, crisp, not noisy.

### Music

Lucky Claw uses a fixed launch soundtrack of five production tracks:
- Main Title Theme
- Cozy Claw
- Toy Boutique
- Lucky Rush
- Dreamy Arcade

Player-facing track names display only the song title; no “Lucky Claw” suffix is shown in the media player.

Music UX is intentionally unobtrusive:
- Title plays Main Title Theme with no visible media player; the soundtrack supports the title rather than competing with it.
- The full minimal player lives inside Settings only: Previous/Next, Play/Pause, Shuffle, Repeat Off/Playlist/Track, volume decrease/increase, and direct track selection.
- Gameplay has no persistent media-player overlay. The track active when a round begins is locked for that round; track-change requests made through Settings may be queued for the next round.
- The final 30 seconds enter Dynamic Urgency Mode. Playback rate rises progressively and smoothly, reaching a restrained maximum near the final seconds, then always resets to 1.00× when the round ends.
- User mute/volume choices always win; urgency never forces music back on.

Music preferences persist locally. Audio must remain subordinate to gameplay SFX and retain enough headroom for claw, shuffle, drop, chute, and reward sounds.

### Haptics

Where supported:
- subtle press feedback;
- stronger reward pulse;
- optional near-miss cue.

Graceful fallback when unsupported.

---

## 17. Localization: Thai + English

Localization is a first-class system, not a late translation pass.

### Quality bar

Both languages must feel written natively for a premium mobile game.

Avoid:
- literal translation;
- textbook phrasing;
- unnatural formality;
- Thai copied into English structure;
- English copied into Thai structure.

### Architecture

Semantic localization keys:

```json
{
  "menu.play": "PLAY",
  "menu.collection": "COLLECTION",
  "reward.new": "NEW!",
  "theme.unlock": "UNLOCK"
}
```

Thai and English dictionaries remain separate from screen logic.

### Layout rule

Every changed screen is tested in both languages.

Never solve overflow by shrinking one language until it becomes unpleasant to read.

---

## 18. Technical Architecture

### Approved stack

- semantic HTML5;
- modern CSS;
- vanilla ES modules;
- Canvas 2D for continuous gameplay where useful;
- DOM for UI/text/menus;
- localStorage initially;
- Web Audio / HTML audio;
- PWA after core stability;
- GitHub Pages.

### DOM + Canvas hybrid

Use DOM/CSS for:
- menus;
- HUD;
- buttons;
- dialogs;
- text;
- settings;
- collection cards.

Use Canvas 2D for:
- claw motion;
- layered plush rendering;
- controlled gameplay animation;
- lightweight particles.

Do not render the whole app in Canvas merely because it is a game.

### No framework by default

A framework is introduced only if vanilla architecture becomes measurably harder to maintain.

### No backend by default

Initial product does not require:
- accounts;
- cloud save;
- multiplayer;
- remote economy;
- payments;
- server authority.

Backend scope, if ever needed, is a separate deliberate decision.

---

## 19. Planned Module Responsibilities

```text
src/js/core/
  app bootstrap
  state
  storage
  localization
  lightweight app events if justified

src/js/gameplay/
  claw controller
  target/grab evaluation
  plush placement
  gameplay state machine
  reward handoff

src/js/screens/
  splash
  language
  main menu
  gameplay
  collection
  themes
  missions
  settings

src/js/systems/
  economy
  collection
  themes
  missions
  audio
  haptics

src/js/data/
  plush catalog
  theme catalog
  mission definitions
  balance constants

src/locales/
  th
  en
```

Files are split by durable responsibility, not mechanically.

---

## 20. Persistent State

Initial state may include:

```text
schemaVersion
language
points
selectedTheme
ownedThemes[]
collection{}
missionProgress{}
settings{
  music
  sfx
  haptics
  reducedEffects
}
firstRunComplete
```

### Save schema

Use `schemaVersion` from the beginning.

Future state changes migrate old saves deliberately rather than silently breaking progress.

### Save timing

Persist after meaningful changes:
- prize won;
- points changed;
- theme unlocked;
- setting changed;
- language changed.

Never write storage every animation frame.

---

## 21. Data-driven Content

Future plushies, themes, and missions should mostly be content additions, not engine edits.

Ideal future task:

> Add art + one data record + localized name.

Bad future task:

> Edit five gameplay files to add one plush.

Architecture must keep moving toward the first pattern.

---

## 22. Performance Budget

Premium means smooth.

### Runtime goals

- responsive on ordinary contemporary mobile hardware;
- no uncontrolled animation loops;
- no unnecessary layout thrashing;
- fast return navigation;
- graceful degradation.

### Assets

Prefer:
- WebP/AVIF where appropriate;
- SVG for simple vectors;
- PNG only when needed;
- compressed audio;
- no oversized source images shown tiny.

### Loading priority

1. splash essentials
2. main menu essentials
3. selected cabinet + core plush set
4. secondary screens lazily

Do not preload the entire future content library before the player sees the menu.

---

## 23. PWA Strategy

PWA is a target, not the first priority.

Implement after the core shell stabilizes.

Later desired behavior:
- installable from supported browsers;
- standalone display;
- portrait-first;
- offline shell where practical;
- predictable cache behavior;
- explicit service-worker versioning.

During active development, caching must never hide new builds unexpectedly.

---

## 24. Accessibility & Mobile UX

Required baseline:
- large touch targets;
- semantic buttons;
- visible focus;
- readable contrast;
- no essential information only by color;
- reduced-motion support;
- audio controls;
- resilient narrow-screen layout.

---

## 25. Orientation

Primary: portrait.

The runtime should aggressively prefer an immersive portrait presentation:
- disable page pinch-zoom/double-tap zoom for the game surface;
- request fullscreen on the first trusted user gesture where the browser permits it;
- request portrait orientation lock once fullscreen is available;
- detect landscape and keep a tasteful rotate-device overlay as the guaranteed fallback;
- remain safe when fullscreen or orientation locking is denied by the browser or host webview.

Web security rules do not permit guaranteed audible autoplay, fullscreen entry, or orientation locking before a trusted user gesture on every browser. The installable PWA later strengthens the standalone portrait experience, but the web build must never falsely claim platform behavior it cannot enforce.

---

## 26. Reward Design

Successful grab sequence:

1. prize visibly reaches chute;
2. short anticipation beat;
3. reward card;
4. plush becomes hero;
5. rarity/new status;
6. point gain;
7. collection progress;
8. concise next action.

Common rewards stay fast. Higher rarity earns stronger presentation.

---

## 27. Near-Miss Design

Near misses are powerful only when credible.

Rules:
- not every loss is a late slip;
- poor aim can simply miss;
- strong aim produces better outcomes;
- visual outcome reflects result logic;
- do not create a rigged feeling.

Trust is retention.

---

## 28. Retention Loop

```text
PLAY
↓
WIN / NEAR MISS
↓
COLLECTION PROGRESS
↓
CLAW POINTS
↓
MISSIONS / MILESTONES
↓
THEME UNLOCK
↓
NEW VISUAL EXPERIENCE
↓
PLAY AGAIN
```

Strong loop, low infrastructure cost.

---

## 29. First-session UX

Preferred:
- splash;
- language;
- main menu;
- Play;
- micro tutorial layered on real controls;
- first real attempt.

No multi-page tutorial.

Teach by doing:
- “Move the claw”
- optionally introduce SHUFFLE without blocking the first attempt
- highlight DROP
- “Drop it!”
- let the real attempt happen.

Tutorial disappears after completion and may be replayed from help/settings later.

---

## 30. Monetization Boundary — Future Only

No monetization is required for the initial product.

If explored later:
- do not sell hidden better grip odds as cosmetics;
- avoid predatory energy frustration;
- avoid misleading scarcity or odds;
- preserve satisfying free play.

Monetization must not damage product trust.

---

## 31. Privacy & Security

- Public repo contains no secrets.
- Initial game avoids collecting personal data.
- Future analytics, if any, must be minimal and documented.
- No invasive tracking by default.

---

## 32. Canonical Repository Architecture

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

Runtime files such as `index.html`, web manifest and service worker are added only when implementation reaches them.

Do not create speculative directories without real use.

---

## 33. Repository Cleanliness Contract

Mandatory:
- one canonical path per production responsibility;
- overwrite existing files instead of creating versioned copies;
- no `final`, `new`, `fixed`, `copy`, date suffixes or export counters;
- no arbitrary root files;
- no build ZIPs committed;
- no raw experiments committed as production;
- no unused dependencies;
- no duplicate active assets;
- no secrets.

Git history is the historical archive.

---

## 34. Production Roadmap

This defines order, not dates.

### Foundation Pack — current

Deliver:
- repository taxonomy;
- Master Plan;
- Build Protocol;
- repo hygiene baseline.

No production build number consumed.

### Build 001 — Pre-main-menu Foundation

Deliver:
- Benedict Interactive / game-brand splash;
- Lucky Claw logo treatment;
- first-run language selection;
- language persistence;
- app shell;
- premium motion tokens;
- responsive portrait baseline.

Acceptance:
- mobile browser works;
- Thai/English layouts work;
- returning user skips language selection;
- no normal-path console errors.

### Build 002 — Main Menu Shell

Deliver:
- hero cabinet;
- PLAY;
- Collection / Themes / Missions entry;
- Settings;
- points display;
- selected-theme presence;
- Settings containing the full minimal soundtrack player using the approved five-track set.

Do not expose dead controls.

### Build 003 — Core Claw Loop

Deliver:
- horizontal joystick movement;
- SHUFFLE hold mechanic with a bounded per-attempt duration;
- DROP sequence;
- basic plush targets;
- grab evaluation;
- miss / grip / lift / success;
- prize chute;
- reset loop;
- per-round soundtrack track lock and final-30-second Dynamic Urgency integration.

Goal: repeatable claw attempt that is already fun.

### Build 004 — Feel & Feedback

Deliver:
- motion timing;
- SFX;
- haptic hooks;
- near-miss tuning;
- premium press states;
- reward reveal;
- HUD cleanup.

### Build 005 — Collection

Deliver:
- persistence;
- catalog;
- new/owned state;
- rarity;
- duplicates;
- collection screen.

### Build 006 — Economy & Missions

Deliver:
- Claw Points;
- reward values;
- mission event tracking;
- mission UI;
- rewards;
- balancing.

### Build 007 — Cabinet Themes

Deliver:
- config architecture;
- Classic + at least two unlockable themes;
- full preview;
- unlock/equip;
- persistence;
- theme-specific tokens/effects.

### Build 008 — Content & Progression

Deliver:
- expanded plush catalog;
- collection sets;
- progression pacing;
- more themes where assets are ready;
- milestones;
- balance pass.

### Build 009 — PWA & Deployment Hardening

Deliver:
- manifest;
- installability;
- icons;
- service worker;
- cache/version strategy;
- GitHub Pages verification.

### Build 010 — Release Candidate

Deliver:
- complete QA;
- mobile sweep;
- bilingual copy audit;
- save migration verification;
- performance optimization;
- accessibility pass;
- onboarding polish.

---

## 35. Explicit Out-of-Scope for Initial Product

Unless strategy deliberately changes:
- realtime 3D;
- Three.js environment;
- full rigid-body plush simulation;
- multiplayer/PvP;
- accounts;
- cloud save;
- chat;
- server economy;
- complex crafting;
- marketplace;
- gacha-style paid randomness;
- live-ops backend;
- native Android/iOS codebase.

---

## 36. Risk Register

**Web game looks cheap**  
Mitigation: art direction, micro-motion, tactile feedback, sound, spacing, premium assets.

**Probability feels rigged**  
Mitigation: aim quality materially matters; near misses used conservatively.

**Weak long-term pull**  
Mitigation: collection + points + themes + missions + milestones.

**Too much menu/meta complexity**  
Mitigation: PLAY stays visually dominant.

**Asset explosion**  
Mitigation: canonical taxonomy, reusable components, config-driven content.

**Performance falls as polish increases**  
Mitigation: effects budget, compressed assets, bounded particles.

**Thai/English layout drift**  
Mitigation: both languages QA’d every affected build.

**PWA serves stale builds**  
Mitigation: service worker delayed until stable and versioned explicitly.

---

## 37. QA Matrix

### Functionality
- controls respond;
- transitions cannot double-trigger;
- rewards apply once;
- persistence works;
- returning flow works.

### Mobile
- narrow portrait;
- tall portrait;
- landscape fallback;
- touch hold;
- no accidental gameplay page scroll;
- no critical clipping.

### Localization
- Thai;
- English;
- switching;
- no raw keys;
- no overflow.

### Visual
- hierarchy;
- spacing;
- legibility;
- no stretched assets;
- animation continuity.

### Performance
- no runaway animation loops;
- no excessive DOM updates;
- no huge uncompressed assets;
- no audio leaks.

### Persistence
- fresh state;
- existing save;
- malformed save fallback;
- schema migration when needed.

---

## 38. Definition of Done — Product

Release-ready only when:

1. first-time player understands play without external explanation;
2. returning player reaches gameplay quickly;
3. claw movement and DROP feel responsive;
4. capture outcomes feel plausible and fair;
5. prize delivery is visibly satisfying;
6. collection creates a real goal;
7. progression visibly leads toward desirable unlocks;
8. themes feel meaningfully different without changing win odds;
9. Thai and English both sound natural;
10. every visible control works;
11. no major dead-end screens exist;
12. no normal-path uncaught errors;
13. persistent state survives reload safely;
14. performance feels smooth on realistic mobile hardware;
15. repository remains clean and understandable;
16. complexity remains medium or lower;
17. overall presentation feels like a deliberate premium mobile game—not a demo.

---

## 39. Definition of Done — Every Build

A batch is done only when:
- scope works end-to-end;
- canonical paths are respected;
- no duplicate version files were introduced;
- both languages were tested for affected UI;
- visible controls are functional;
- console errors were checked;
- mobile layout was checked;
- save compatibility was considered;
- performance impact was considered;
- assets are appropriate for current production stage;
- upload package contains only required additions/replacements.

---

## 40. Product Heuristics

Prefer:
- one excellent primary CTA over three equal ones;
- one strong reward reveal over constant fireworks;
- reusable systems over bespoke cases;
- visible agency over opaque randomness;
- content-driven scalability over code duplication;
- short natural copy;
- polished 2D over mediocre 3D;
- smooth motion over unnecessary spectacle;
- a smaller set of excellent plushies over many weak ones;
- genuinely distinct themes over recolors marketed as new.

Avoid:
- feature bloat;
- currency bloat;
- notification-dot spam;
- dark patterns;
- fake urgency;
- dead buttons;
- long onboarding;
- meaningless rarity;
- excessive dialogs;
- effects that obscure gameplay.

---

## 41. Brand Direction

`Benedict Interactive` remains the stable publisher identity.

A playful game-facing label may be explored visually without fragmenting the parent brand.

The game logo should be:
- readable at mobile size;
- distinctive;
- charming;
- premium;
- not dependent on tiny details;
- suitable for subtle animation.

Brand assets live in `assets/brand/`.

---

## 42. Art Direction

### Plushies
- soft and tactile;
- distinct silhouettes;
- readable faces at gameplay scale;
- enough personality to create favorites;
- coherent art universe.

Avoid:
- detail that disappears on mobile;
- near-identical silhouettes;
- accessories that make grab zones visually confusing.

### Cabinets
- strong framing;
- visible depth;
- clear prize chute;
- readable claw rail;
- premium materials;
- strong theme identity.

### UI
- crisp;
- soft;
- tactile;
- legible;
- controlled highlights;
- coherent icon language.

---

## 43. Theme Expansion Rule

A future theme is worthwhile when it changes several high-perception surfaces:
- frame;
- interior;
- floor;
- lights;
- control accent;
- ambient effect;
- reward accent;
- optional audio sting.

A simple hue rotation is not a full theme.

---

## 44. Final Principle

> **We are not trying to prove how complicated a browser game can be. We are trying to make a simple browser game feel irresistible, polished, and expensive.**

Whenever a difficult implementation and a simpler illusion create nearly the same player experience, choose the simpler illusion—then execute it beautifully.
