# LUCKY CLAW — MASTER PLAN

**Revision:** 3.0  
**Date:** 4 September 2026  
**Status:** AUTHORITATIVE  
**Repository:** `grolygori789-crypto/lucky-claw`  
**Production source of truth:** current `main` branch on GitHub  
**Current released production baseline at this revision:** Build `002.04`  
**Current development focus:** Build `003` — Core Claw Loop / Stage 1  
**Platform:** portrait-first mobile web + installable PWA  
**Languages:** Thai / English / Japanese  
**Publisher:** Benedict Interactive  
**Game-facing brand:** BENEDICT GAMES  
**Brand location:** Bangkok, Thailand  
**Technical ceiling:** medium implementation complexity  
**Primary product principle:** premium through art direction, feel, feedback, clarity, and disciplined engineering—not engineering excess.

---

## 0. Authority, Roles, and Operating Model

Lucky Claw uses a **Full Authorized DEV 100%** operating model.

The assistant/dev is the project's primary:
- Product Owner;
- Game Director;
- UX/UI Lead;
- Art/Visual Systems Lead;
- Technical Lead / CTO;
- Systems Designer;
- Progression & Economy Designer;
- QA Owner;
- Release Gatekeeper.

The user acts as **Founder/Advisor and reviewer** who gives feedback, taste direction, priorities, approvals, and corrections. The assistant/dev is expected to make the principal product and implementation decisions autonomously inside this Master Plan and the user's latest explicit instruction.

Do not ask the user to make micro-decisions that the dev can reasonably decide.

### Conflict order

When instructions or artifacts conflict, resolve in this order:

1. latest explicit user instruction;
2. current production files on GitHub `main`;
3. this Master Plan;
4. `docs/BUILD_PROTOCOL.md`;
5. approved production assets and current runtime behavior;
6. repository history;
7. older conversation context or old drafts.

Never let an old local copy override current GitHub production.

---

## 1. Repository-Only Production Rule

For all project work, **production files must be read/fetched from the GitHub repository**.

Mandatory:
- inspect current GitHub `main` before modifying an existing production area;
- fetch the actual current file from GitHub before editing it;
- treat repository paths and current GitHub content as authoritative;
- generate new files in a working environment only after reading their dependencies from GitHub.

Forbidden as production authority:
- stale `/mnt/data` worktrees from an older room;
- remembered code;
- old ZIPs;
- screenshots as a substitute for source inspection;
- reconstructed files when GitHub has the real file;
- hidden local caches from previous sessions.

Uncommitted experiments may inform reasoning, but **they are not production** until rebuilt against and delivered from the current repository baseline.

Default workflow is manual upload by the user. Do not push or write remotely to GitHub unless the user explicitly instructs that in the current turn.

---

## 2. No-Wasted-Wait Contract

The user must never be left waiting through a long tool run only to receive no usable result.

Mandatory behavior:
- front-load repository inspection and feasibility checks;
- run a fast smoke test early before spending a long time polishing;
- if a blocking test fails, fix it before continuing expensive downstream work;
- do not silently disappear into an extended tool loop;
- give concise progress checkpoints during unusually long work;
- never tell the user to wait, come back later, or imply background work;
- every substantial development turn should end with either:
  1. an upload-ready tested artifact, or
  2. a prompt, actionable blocker reported promptly—never after a long silent wait.

If final QA fails, do not send a broken production ZIP. Fix it in the same turn when realistically possible. If the environment itself prevents completion, state the exact blocker immediately rather than consuming the user's time.

“Work completed” and “ready to upload” are not the same thing. Only tested outgoing files are upload-ready.

---

## 3. Mandatory Delivery Contract

Every delivery containing files must include:

1. a direct download link;
2. exact changed/new file paths;
3. explicit `DELETE: none` or exact delete paths;
4. tests actually run and their results;
5. any known limitation that was not testable;
6. a SHA-256 checksum for the final ZIP when practical;
7. a **Commit name no longer than 50 characters**, always shown in a code block.

Example:

```text
Build 003: add core claw gameplay
```

The ZIP must begin at repository root and be immediately mergeable into the repository without renaming or reorganizing files.

Do not put build ZIPs, screenshots, QA images, or temporary files in the repository.

---

## 4. Product North Star

Lucky Claw is a premium casual arcade collectible game built around the emotional loop:

**aim → commit → tension → near miss / success → reward → collection → progression → one more try**

Desired reactions:
- “This is cute.”
- “This looks expensive.”
- “This feels like a real mobile game.”
- “I nearly had it.”
- “One more try.”
- “I want that plush.”
- “I want to beat my high score.”
- “I want the next cabinet theme.”
- “I want the next trophy.”

The game must never feel like:
- a generic HTML demo;
- a cheap web form placed over a cabinet image;
- a rigged gambling machine;
- a physics sandbox;
- a children-only toy;
- a technically impressive but visually incoherent prototype.

---

## 5. Visual Identity

### Core identity
- cute-premium;
- luxury arcade;
- warm ivory / blush pink / champagne gold;
- tactile acrylic, pearl enamel, glass, chrome, satin, plush;
- polished mobile-game finish;
- charming but not childish;
- glossy but restrained.

### Premium rules
Premium perception comes from:
- coherent geometry;
- excellent spacing;
- deliberate hierarchy;
- consistent material language;
- believable mechanical connections;
- controlled highlights;
- excellent typography;
- smooth motion;
- immediate input response;
- clean assets.

Avoid:
- generic web cards;
- oversized flat panels;
- UI floating without physical logic;
- uncontrolled glow;
- cheap casino styling;
- parts that look pasted together;
- mechanically impossible geometry;
- tiny plushes that destroy the claw-machine fantasy.

---

## 6. Approved Production Baseline — Build 002.04

The following areas are considered stable production and must be protected from regression.

### Boot / first-load behavior
- boot cover hides the cabinet until critical visual assets are ready;
- the user must not see an empty cabinet first and then watch claw/plush/buttons pop in later;
- long-press image saving/callout must remain disabled on the game surface;
- pinch zoom / multi-touch zoom / double-tap zoom must remain blocked for gameplay presentation.

### Splash / Title
- Benedict Games publisher splash;
- premium Classic Pink cabinet;
- title plush showcase;
- title claw showcase;
- title hardware controls are presentation-only;
- `Tap to Start` is text-forward arcade prompting, not a generic oversized web button;
- language action stays separate from the exit action;
- exit `×` is available from Title and uses a localized confirmation flow.

### Languages
Production languages:
- Thai (`th`);
- English (`en`);
- Japanese (`ja`).

All visible copy must be native-quality, natural game language. Raw localization keys must never appear.

### Main Menu
Current menu foundation includes:
- PLAY;
- Collection;
- Missions;
- Themes;
- Trophy;
- How to Play;
- Settings.

PLAY remains the dominant primary action.

### Settings
Settings foundation includes:
- Music;
- SFX;
- Haptics;
- Language;
- Reduced Effects;
- Game Data;
- How to Play;
- Feedback/support utilities;
- Support;
- Legal & Privacy;
- About;
- Exit Game.

### Support
Canonical data belongs in `src/js/data/support.js`.

Current product model:
- International support: **Ko-fi**;
- Thailand support: **PromptPay**;
- support is optional;
- support must never change gameplay odds, rewards, progression, or access.

### Legal / Trust
Lucky Claw is:
- entertainment only;
- not gambling;
- no cash prizes;
- local-first;
- no account/backend required in the current product;
- progress can be lost if local browser/app storage is cleared.

Brand presentation:
- `BENEDICT GAMES`
- `by Benedict Interactive`
- `Bangkok, Thailand`

---

## 7. Audio / PWA Non-Regression Contract

This is a critical historical failure area. Do not casually rewrite it.

### Audio
Media elements may make HTTP Range requests and receive `206 Partial Content`.

Mandatory:
- audio requests must pass through to network;
- never runtime-cache streamed partial audio responses with the Cache API;
- do not reintroduce the old media `cacheFirst()` behavior;
- preserve music preference state;
- audio unlock should happen on a trusted interaction when browser policy requires it;
- background/hidden page lifecycle must pause correctly.

### Service Worker
Current architecture:
- explicitly versioned shell cache;
- old Lucky Claw shell caches removed on upgrade;
- normal 200 static responses may be cached;
- media Range behavior remains untouched;
- installed clients may be refreshed coherently on real build upgrade.

### Fullscreen / PWA
- installed PWA uses its manifest display mode;
- do not request browser fullscreen repeatedly when already installed/standalone/fullscreen;
- ordinary browser fullscreen may show Chrome/OS security education UI; the page cannot suppress browser chrome that the browser owns;
- portrait is the product orientation;
- landscape gets a graceful fallback rather than broken layout.

Any Build 003 work must pass audio/PWA regression checks before delivery.

---

## 8. Core Gameplay — Locked Direction

### Round model
Stage-based timed arcade play.

**Stage 1 baseline:**
- duration: **3:00**;
- target score: **600**;
- player must meet or exceed target before round ends to clear the stage;
- each plush has its own score value;
- stage score is separate from persistent Claw Points;
- High Score is stored per stage and persists locally;
- high scores remain until game data is cleared.

Stage targets, time, and plush values are data-driven and may be tuned through playtesting without rewriting engine code.

### Loop

```text
Start stage
→ Move claw
→ optional SHUFFLE
→ aim
→ DROP
→ claw extends
→ closes
→ evaluates grip
→ lifts
→ swing / secure carry / slip
→ travel to prize chute if secured
→ release
→ visible delivery
→ score + collection/progression updates
→ reset claw
→ next attempt until timer ends
```

---

## 9. Gameplay Claw — Mechanical Standard

The claw must look mechanically continuous, not composited from unrelated parts.

Required physical chain:

```text
rail/carriage
→ telescoping chrome shaft
→ champagne-gold collar / bearing
→ swivel / claw hub
→ three articulated arms
```

### Idle state
- claw stays high near the rail;
- shaft is substantially retracted;
- playable chamber remains visually open;
- claw does not hang halfway down the cabinet during ordinary aiming.

### DROP state
- shaft extends only after DROP;
- arm movement follows controlled easing;
- claw reaches the target height;
- arms close;
- shaft retracts while carrying or slipping.

### Size relationship
The claw must be sized **against the medium gameplay plush**, not against Title artwork.

The open claw span should visually cover a meaningful part of a medium plush body:
- not so small that a grab looks impossible;
- not so large that it captures whole clusters;
- enough clearance for believable edge grabs and slips.

Grab radius and rendered claw opening must be tuned together. Never enlarge only the art while leaving logic too small, or vice versa.

### Movement feel
Use controlled game-feel physics:
- horizontal inertia;
- gentle pendulum/swing;
- damping;
- plausible weight response;
- no full rope/rigid-body simulation required.

---

## 10. Gameplay Plush Test Roster

The first gameplay validation roster is intentionally small:

1. Signature Shih Tzu — tan/white;
2. Black Shih Tzu;
3. Red Bear;
4. Yellow Chick;
5. White Bunny.

These five define the art language before expanding the launch roster.

### Shape coverage
They intentionally test:
- medium standard body;
- dark medium body;
- large/round plush;
- small/light plush;
- long-ear / awkward silhouette.

### Stage 1 pile
Recommended initial visible population:
- approximately **11–12 plush instances** from the five types;
- dense enough to look like a real prize machine;
- layered front/middle/back;
- not arranged like icons;
- no plush may cross outside the physical chamber;
- no plush may visually penetrate cabinet walls or front boundaries;
- the left prize-chute opening and its physical edges must remain clearly readable.

### Chute exclusion
Define an explicit chute exclusion region in normalized cabinet coordinates. Plush placement and SHUFFLE must respect it at all times.

The test is not “looks okay before shuffle.” It must remain physically plausible after repeated shuffle actions.

---

## 11. SHUFFLE / Agitator System

SHUFFLE is available for a bounded amount of time per round/attempt, initially **up to about 15 seconds**.

The machine must visually explain how the pile can move.

Required:
- visible floor agitator / shuffle mechanism inside the chamber;
- mechanism styled as part of the premium cabinet;
- located away from the prize chute;
- activated state with subtle rotation/vibration/light response;
- plushes move within bounded, believable limits;
- no teleporting;
- no plush may clip walls, controls, chute, or chamber boundary.

Implementation can use controlled repositioning rather than full physics.

The physical floor mechanism + controlled plush motion is the illusion. Do not build heavyweight simulation.

---

## 12. Prize Chute

The prize chute is sacred visual logic.

Requirements:
- permanently readable on the left side of the chamber;
- plush pile must not obscure its key rim/entry edges;
- successful carry travels visibly above the chute;
- release is visibly connected to the chute;
- reward UI follows the physical drop, not before it.

Never treat the chute as decorative art unrelated to the capture path.

---

## 13. Gameplay UI Architecture

Gameplay UI is dynamic DOM/CSS, not baked text inside a static mockup.

### Dynamic UI
- Score;
- Target;
- Stage;
- countdown Timer;
- joystick;
- SHUFFLE;
- DROP;
- shuffle remaining time;
- round result;
- score gain / reward feedback.

### Static / cabinet art
- cabinet frame;
- chamber;
- prize chute;
- fixed material surfaces;
- non-interactive decorative hardware.

### Gameplay objects
- moving carriage/claw;
- telescoping shaft;
- claw arms;
- plush instances;
- controlled prize travel;
- particles/effects.

### UI visual standard
Score / Target / Stage / Timer must read as **cabinet hardware**, not web-dashboard cards.

Use:
- pearl/ivory enamel;
- blush acrylic;
- champagne-gold trim;
- inset display treatment;
- restrained shadows;
- excellent typographic hierarchy.

HUD labels must remain readable at phone scale and never overwhelm the cabinet.

---

## 14. Controls

### Joystick
- controls horizontal movement;
- touch target may be larger than visible hardware;
- visible stick response should match input direction;
- input must not be blocked by decorative overlays.

### DROP
- emotional primary action;
- strongest tactile response;
- commits the attempt;
- disabled during active descent/lift/reset states.

### SHUFFLE
- secondary action;
- clearly less dominant than DROP;
- hold interaction;
- bounded time budget;
- button visually communicates remaining availability;
- no floating generic pill over the prize pile.

---

## 15. Grab / Slip Model

No full plush physics is required.

Evaluate:
- distance from plush grab point;
- overlap;
- contact quality;
- plush size;
- plush weight;
- grip difficulty;
- balance;
- controlled variability;
- current swing.

Outcomes:
1. clean miss;
2. unstable contact / early slip;
3. late slip;
4. secure carry.

Player precision must materially improve probability.

Never make the result feel predetermined or rigged.

---

## 16. Score, Progression, High Score, Trophy

### Stage Score
Used for:
- stage pass/fail;
- High Score;
- score milestones.

### Claw Points
Persistent earnable currency used for:
- cabinet theme unlocks;
- future progression;
- mission/milestone rewards.

### High Score
- stored per stage;
- local device/browser persistence;
- survives normal reload/relaunch;
- cleared only through explicit Game Data reset or external storage clearing.

### Trophy
Trophy shelf is a persistent achievement display.

Initial trophy triggers may include:
- stage-score thresholds;
- flawless/low-miss milestones;
- rare capture milestones;
- stage completion milestones.

Trophy design must use tracked game events; avoid bespoke expensive mechanics solely for trophies.

---

## 17. Collection & Launch Plush Expansion

Do **not** create the full launch roster before the five-plush core gameplay test proves fun.

Workflow:
1. five plush test roster;
2. validate scale, grip, slip, pile density, score pacing;
3. adjust silhouette rules;
4. expand toward the launch catalog.

Current recommended launch target remains approximately **15 plush designs**, but this is a content target, not a prerequisite for Build 003.

Content must be data-driven.

---

## 18. Themes

Cabinet themes are cosmetic.

They may change:
- cabinet frame;
- interior;
- floor;
- light accents;
- controls;
- ambient effect;
- reward accent;
- optional audio sting.

They never change:
- claw power;
- capture probability;
- hidden odds;
- scoring fairness.

Theme unlocks use gameplay-earned Claw Points.

---

## 19. Localization

Supported at production level:
- Thai;
- English;
- Japanese.

Rules:
- native, natural copy;
- no literal translation smell;
- no raw i18n keys;
- no mixed languages;
- every changed UI screen is tested in all affected languages;
- Japanese should use natural concise game copy;
- Thai should feel written for Thai players, not translated from English;
- English should read like native mobile-game UI.

Do not fix overflow by making text uncomfortably tiny.

---

## 20. Persistent State

Current production schema already protects these major areas:
- language;
- Claw Points;
- selected/owned themes;
- collection;
- missions;
- stage progress;
- high scores by stage;
- trophies;
- music/settings;
- first-run completion.

Build 003 must extend state deliberately, not replace it.

Rules:
- preserve `schemaVersion`;
- migrate when shape changes;
- save meaningful events, not animation frames;
- never wipe existing user settings when introducing gameplay;
- Clear Game Data remains explicitly destructive to game progress while preserving intended preferences as defined by current production behavior.

---

## 21. Settings / Support / Legal

These are part of the product, not optional cleanup.

Settings must continue to expose:
- audio preferences;
- haptics;
- language;
- reduced effects;
- game data;
- support;
- legal;
- about;
- exit.

Support:
- Thailand → PromptPay;
- International → Ko-fi;
- no effect on odds/rewards/progression.

Legal center:
- Terms of Use;
- Privacy Policy;
- Copyright & Intellectual Property;
- Third-Party Notices.

Brand footer:
- Benedict Interactive;
- Bangkok, Thailand.

Future analytics/cloud/account changes require corresponding privacy updates before release.

---

## 22. Technical Architecture

Approved stack:
- semantic HTML;
- modern CSS;
- vanilla ES modules;
- DOM/CSS for UI and hardware-style controls;
- Canvas 2D only where continuous rendering materially benefits gameplay;
- localStorage;
- HTML Audio / Web Audio as appropriate;
- PWA;
- GitHub Pages.

Do not introduce a framework without a measurable maintainability reason.

Do not introduce full realtime 3D.

### Recommended Build 003 responsibilities

```text
src/css/gameplay.css

src/js/gameplay/
  gameplay-controller.js
  claw-controller.js
  plush-controller.js
  grab-evaluator.js

src/js/screens/
  gameplay.js

src/js/data/
  plush-catalog.js
  stage-catalog.js
  balance.js

assets/machines/classic/
  gameplay-specific machine assets only when actually needed

assets/plushies/gameplay/
  canonical five-plush production assets
```

File splitting is by durable responsibility, not arbitrary line count.

---

## 23. Build 003 Integration Strategy

Build 003 must be added with minimal intrusion into Build 002.04.

Preferred:
- add gameplay-specific CSS rather than heavily editing Title CSS;
- add gameplay modules rather than expanding `app.js` into a monolith;
- wire PLAY into a dedicated gameplay screen/controller;
- reuse existing state/music/i18n foundations;
- leave Settings and Title behavior untouched except for the smallest necessary integration points;
- add only necessary app-shell precache entries;
- preserve service-worker audio logic.

Do not redesign unrelated stable screens while implementing gameplay.

---

## 24. Build 003 Acceptance Gate

Do not send Build 003 until the **exact outgoing package** passes all applicable checks.

### Repository / structure
- built from current GitHub `main`;
- canonical paths;
- no stale version imports;
- no duplicate assets;
- no temporary QA files;
- no wrapper folder in ZIP.

### Gameplay function
- PLAY enters Stage 1;
- timer starts at 3:00;
- Score starts at 0;
- Target displays 600;
- joystick moves claw reliably;
- claw idle position is high/retracted;
- DROP extends, closes, lifts, resolves, resets;
- SHUFFLE works while held and respects its budget;
- agitator visibly activates;
- plushes remain inside physical bounds;
- prize chute remains readable;
- successful prize reaches chute;
- score updates exactly once;
- misses/slips do not incorrectly score;
- round end cannot double-trigger;
- High Score persistence works;
- stage clear/fail logic works.

### Visual
Test exact outgoing build at minimum:
- 320×640;
- 390×844;
- 690×1536.

Also inspect at least one common modern tall-phone ratio.

Reject release if:
- claw connector looks pasted;
- shaft visually collides with top emblem/star;
- claw is implausibly small or huge relative to plush;
- plushes are tiny;
- plushes cross walls/chute/front boundary;
- pile is unnaturally sparse;
- HUD resembles generic web cards;
- timer/control labels are illegible;
- physical machine logic is unclear.

### Localization
- Thai;
- English;
- Japanese;
- no raw keys;
- no overflow.

### Regression
- Title loads correctly;
- no empty-cabinet flash;
- title language/exit actions do not overlap;
- Tap to Start works;
- Main Menu works;
- Settings works;
- Exit confirmation works in TH/EN/JA;
- support/legal still opens;
- music still works;
- audio Range 206 passthrough remains correct;
- image long-press save remains disabled;
- pinch/double-tap zoom remains disabled;
- install/PWA flow is not broken.

### Console / runtime
- no uncaught errors in tested paths;
- no broken asset requests;
- no uncontrolled loops;
- no input-blocking overlay.

---

## 25. Visual QA Is Mandatory

Never claim “10/10”, “perfect”, “premium”, or “passed” from code inspection alone.

For visual changes:
- render the exact outgoing build;
- inspect screenshots visually;
- compare against the approved design intent;
- fix obvious design failures before delivery.

A mechanically working build can still fail release because it looks cheap, physically impossible, or visually incoherent.

The user’s visual rejection is a release-blocking signal, not a cosmetic backlog item.

---

## 26. Testing Truthfulness

Only claim tests that actually ran.

Use precise language:
- “syntax check passed”;
- “deterministic service-worker regression passed”;
- “Chromium screenshot QA passed”;
- “actual device audio playback not tested here” when true.

Never turn a failed tool invocation into a claimed pass.

If local browser restrictions prevent a specific test, say so explicitly and compensate with the strongest valid deterministic test available—without pretending it is the same test.

---

## 27. Performance

Targets:
- responsive on ordinary modern Android/iPhone-class hardware;
- no massive source images rendered tiny;
- no unnecessary layout thrashing;
- no runaway requestAnimationFrame loops;
- bounded particles;
- compressed WebP/PNG assets;
- UI motion should remain smooth under gameplay.

Smoothness is part of premium perception.

---

## 28. Accessibility / Mobile UX

Maintain:
- large touch targets;
- semantic buttons;
- focus support where relevant;
- reduced-motion support;
- readable contrast;
- no essential info by color alone;
- portrait-first responsive layout;
- no accidental page scroll;
- no pinch zoom on game surface;
- safe-area awareness.

---

## 29. Build Roadmap — Updated

### Build 001 — Foundation / Title / PWA
Completed family:
- splash;
- title cabinet;
- language foundation;
- title music;
- install flow;
- boot cover;
- PWA/audio hardening;
- long-press/zoom protection.

### Build 002 — Main Menu / Settings / Trust
Completed family through production Build `002.04`:
- Tap to Start;
- Main Menu;
- TH/EN/JA;
- Settings foundation;
- soundtrack controls;
- support;
- legal/privacy/about;
- exit flow;
- exit localization fix.

### Build 003 — Core Claw Loop
**Current priority.**
Deliver:
- production Stage 1;
- five-plush test roster;
- dense realistic pile;
- retracted/extendable claw;
- joystick;
- SHUFFLE + floor agitator;
- DROP;
- grip/slip;
- prize chute;
- score/target/timer;
- High Score;
- Stage 1 clear/fail;
- persistence;
- regression-safe integration.

### Build 004 — Feel & Feedback
After Build 003 is genuinely fun:
- SFX;
- haptics;
- rail/grip/slip tuning;
- near-miss feel;
- reward choreography;
- particles;
- HUD polish.

### Build 005 — Collection
- full collection screen;
- rarity;
- duplicates;
- new/owned states;
- expanded catalog foundation.

### Build 006 — Economy / Missions / Trophy
- Claw Point pacing;
- missions;
- Trophy shelf;
- milestone tuning.

### Build 007 — Cabinet Themes
- unlock/equip;
- preview;
- multiple premium themes;
- cosmetic-only behavior.

### Build 008 — Content / Stage Progression
- more plushes;
- approximately 15 launch designs;
- stage ladder;
- difficulty/score tuning;
- milestones.

### Build 009 — Deployment / PWA Hardening
PWA already exists in production, so this phase means final hardening rather than first introduction:
- cache strategy audit;
- install behavior sweep;
- offline shell validation;
- update behavior;
- deployment verification.

### Build 010 — Release Candidate
- full regression;
- device sweep;
- TH/EN/JA copy audit;
- persistence migration;
- performance;
- accessibility;
- onboarding;
- final legal/support consistency.

---

## 30. Explicit Out of Scope Unless Strategy Changes

- realtime 3D;
- Three.js gameplay;
- full deformable plush physics;
- multiplayer;
- accounts;
- cloud save;
- server economy;
- paid random odds;
- marketplace;
- chat;
- live-ops backend;
- native rewrite.

Use a simpler illusion when it creates the same player experience.

---

## 31. Release Heuristics

Prefer:
- one excellent control over three clever controls;
- believable claw motion over simulated complexity;
- five excellent test plushes over fifteen unvalidated plushes;
- dense but readable piles;
- visible player agency;
- local-first reliability;
- strong visual logic;
- reusable data-driven systems;
- native-quality localization;
- stable old screens over needless redesign.

Reject:
- fake physics that visibly break;
- floating UI with no cabinet logic;
- unexplained mechanical actions;
- rigged-feeling randomness;
- tiny unreadable rewards;
- hidden regression;
- dead buttons;
- raw localization keys;
- duplicated canonical files;
- untested delivery claims.

---

## 32. Final Principle

> **Lucky Claw must feel simpler to play than it was to polish.**

The player should never see the engineering compromises. They should see a coherent premium arcade machine, understand it immediately, feel that their aim matters, enjoy the tension, and want another attempt.

Whenever a technically elaborate implementation and a controlled illusion produce the same player experience, choose the controlled illusion—and execute it beautifully.
