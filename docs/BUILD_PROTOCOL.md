# Lucky Claw — Build & Repository Protocol

**Status:** AUTHORITATIVE  
**Applies to:** Every production batch after the Foundation Pack  
**Purpose:** Keep the GitHub repository clean, predictable, overwrite-safe, and easy to maintain through manual uploads.

---

## 1. Source of truth

The current `main` branch of the public GitHub repository is the production source of truth.

Before changing an existing production area, inspect the current repository state first. Do not reconstruct files from memory when the production version is available.

`docs/MASTER_PLAN.md` is the product/design/technical source of truth.

---

## 2. Canonical-path rule

Every persistent production file has exactly one canonical path.

Examples:

```text
src/js/gameplay/claw-controller.js
src/css/gameplay.css
assets/machines/classic/frame.webp
assets/ui/icons/settings.svg
src/locales/th.json
```

When a file is revised, the replacement keeps the **same filename and same path** unless its responsibility genuinely changes.

### Forbidden patterns

```text
claw-final.js
claw-final-v2.js
claw-new.js
claw-fixed.js
button2.webp
button-latest.webp
home-copy.css
test-final-final.js
```

Git history is the version archive. The repository itself contains only the current production version.

---

## 3. Upload-package rule

Each delivery package contains only:

1. files newly required by the batch;
2. complete replacement versions of production files changed by the batch;
3. a concise upload manifest only when needed.

Do not repack the entire repository by default.

The folder hierarchy inside every package must start at repository root so the package can merge into the repo without manual sorting.

Example:

```text
src/
├── js/
│   └── gameplay/
│       └── claw-controller.js
├── css/
│   └── gameplay.css
└── ../assets/
    └── ui/
        └── drop-button.webp
```

No wrapper folders such as `new-files/`, `latest/`, `upload-this/`, or `version-4/` belong inside the repository.

---

## 4. Overwrite-first policy

Prefer overwrite-in-place over delete-and-recreate.

Use the same canonical path when:
- fixing a bug;
- improving animation;
- changing copy;
- optimizing an asset;
- restyling an existing component;
- improving a sound serving the same role;
- refactoring internals without changing module responsibility.

Deletion is justified only when a file is truly obsolete, merged into another module, or moved because architecture materially changed.

When deletion is unavoidable, delivery notes must state:

```text
DELETE
- exact/path/to/obsolete-file.ext
```

Deletion should be rare.

---

## 5. Root cleanliness

The repository root is reserved for genuinely root-level application files and top-level documentation.

Never place in root:
- screenshots;
- exported design drafts;
- working notes;
- ZIP archives;
- temporary test files;
- prompt scratch files;
- duplicate assets.

Production assets live under `assets/`.  
Production source lives under `src/`.  
Persistent project docs live under `docs/`.

---

## 6. Asset taxonomy

```text
assets/
├── brand/       logos and publisher/game-brand assets
├── ui/          icons, panels, buttons, generic interface art
├── machines/    cabinet/theme-specific assets
├── plushies/    collectible plush artwork/sprites
├── effects/     particles, sparkles, overlays, reward FX
├── audio/       music, SFX, UI sounds
└── fonts/       only legally permitted local fonts
```

Theme-specific assets nest under stable theme IDs:

```text
assets/machines/classic/
assets/machines/sakura/
assets/machines/galaxy/
```

Do not mix unrelated assets just because they appear on the same screen.

---

## 7. Source taxonomy

```text
src/
├── css/         production styles
├── js/
│   ├── core/      app/state/storage/i18n foundations
│   ├── gameplay/  claw and play-loop logic
│   ├── screens/   screen controllers
│   ├── systems/   economy/collection/themes/missions/audio
│   └── data/      declarative content and balance data
└── locales/     Thai/English dictionaries
```

A module exists because it owns a durable responsibility, not because a file became long.

---

## 8. Naming convention

Use lowercase `kebab-case`.

Good:

```text
golden-bear.webp
reward-sparkle.webp
claw-controller.js
theme-selector.css
```

Avoid:
- spaces;
- Thai filenames;
- uppercase file naming;
- dates;
- export counters;
- subjective version words.

Stable code IDs should be boring and durable:

```text
classic
sakura
midnight
galaxy
royal
```

Marketing display names belong in localization data and may change without renaming files.

---

## 9. Build numbering

The Foundation Pack is **not** a production build.

The first user-facing production batch is:

**Build 001**

Each coherent tested delivery increments the build number once.

Suggested commit format:

```text
Build 001: pre-menu foundation
Build 002: main menu shell
Build 003: core claw loop
```

Do not increment build number for every tiny local edit.

---

## 10. No generated junk

Never commit:
- OS metadata;
- editor caches;
- local IDE settings;
- build caches;
- temporary renders;
- raw prompt scratch files;
- duplicate exports;
- local test recordings;
- delivery ZIP files;
- secrets or credentials.

If an artifact is not used by runtime, documentation, or a legitimate production workflow, it probably does not belong in the repository.

---

## 11. Empty-directory policy

Git does not track empty directories.

`.gitkeep` is permitted only to establish approved canonical folders before content exists.

Do not create speculative folders because they *might* be useful later.

---

## 12. Change discipline

Before adding a new production file, ask:

1. Does an existing module already own this responsibility?
2. Can the existing file be extended cleanly?
3. Is this genuinely a new durable responsibility?
4. Does the path fit the approved taxonomy?
5. Will another developer understand why it exists six months later?

When unclear, choose the simpler architecture.

---

## 13. Batch QA gate

A batch is not upload-ready until all applicable checks pass.

### Structure
- canonical paths respected;
- no duplicate-responsibility files;
- no accidental root files;
- no stale imports;
- no broken asset paths.

### Runtime
- no uncaught console errors in the tested path;
- all visible controls work;
- touch targets remain usable;
- language switching does not break layout;
- save-schema changes are handled safely.

### Visual
- no clipped text;
- no unintended horizontal scrolling;
- premium spacing/hierarchy retained;
- animations do not block input unnecessarily;
- both Thai and English checked.

### Performance
- no uncontrolled animation loops;
- no unnecessarily huge source images;
- no heavyweight dependency without explicit justification.

### Package
- includes only required additions/replacements;
- paths exactly match repository destinations;
- deletions, if any, are explicitly listed.

---

## 14. Architecture stop rule

The game has a hard product constraint:

**Implementation complexity must remain medium or lower.**

If a feature pushes the project toward:
- heavyweight realtime 3D;
- complex full-scene physics;
- server-authoritative simulation;
- multiplayer synchronization;
- substantial backend infrastructure;

stop and redesign the player-facing feature with a simpler implementation.

Premium output is mandatory. Premium engineering complexity is not.

---

## 15. Delivery-package contract

Every future delivery should be easy to use manually:

1. unzip;
2. preserve included folder paths;
3. upload/replace matching files in GitHub;
4. commit.

The user should not need to rename files, reorganize folders, or hunt for destinations.

If an existing canonical file changes, the delivery contains a complete replacement file at the same path.

---

## 16. Final rule

> **One responsibility → one canonical home → one current production version.**

The repository should remain understandable after dozens of builds without manual archaeology.
