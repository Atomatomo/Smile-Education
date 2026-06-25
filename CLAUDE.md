# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a **design handoff and interactive prototype repository** for the Smile Education platform (Thai online learning product). It contains no build system, package manager, or tests. The two HTML files are self-contained and open directly in any modern browser.

## Files

- `smile-course-menu-handoff_2.html` — PRD + interactive mock for restructuring the course menu (v2). Includes a sticky table-of-contents, before/after structure diagrams, data model spec, interaction tables, acceptance criteria, and a device-toggle mock that previews both mobile and desktop layouts.
- `smile-course-menu-mobile-options.html` — Three side-by-side interactive mobile proposals (Quick Wins accordion, Category Tabs, Card Grid drill-down) driven by a shared `TOPICS` array, plus a comparison table and a recommendation section.

## Tech Stack

- **HTML5 / CSS3 / Vanilla JS (ES6+)** — no frameworks, no bundler
- **Tabler Icons** via CDN (`@tabler/icons-webfont@3.24.0`)
- **Google Fonts**: Noto Sans Thai, Plus Jakarta Sans, JetBrains Mono
- Language: Thai (`lang="th"`) throughout

## CSS Design System

Both files drive all theming through CSS custom properties declared in `:root`. Never scatter hardcoded colours into component rules — edit the `:root` block only.

### Token sets by file

**`smile-course-menu-handoff_2.html`** — brand-green palette:
```css
:root {
  --ink:#18202E;  --muted:#5C6675;  --faint:#8A93A2;
  --line:#E7EAF0; --line-strong:#D6DBE4;
  --surface:#FFFFFF; --panel:#F6F8FB; --page:#EDF0F5;
  --brand:#0E9C7A; --brand-ink:#0A6E57; --brand-soft:#E2F4EE;
  --new-bg:#E7F0FF; --new-ink:#1D4ED8;  /* blue badge */
  --live-bg:#FCF0D8; --live-ink:#92590B; /* amber badge */
  --code-bg:#0F172A; --code-ink:#E2E8F0; --code-dim:#7C89A3; --code-key:#7DD3C0;
  --radius:14px; --radius-sm:9px;
}
```

**`smile-course-menu-mobile-options.html`** — blue-accent + CTA-orange palette:
```css
:root {
  --ink:#18202E;  --muted:#5C6675;  --faint:#8A93A2;
  --line:#E7EAF0; --surface:#FFFFFF; --panel:#F6F8FB; --page:#EDF0F5;
  --accent:#1B8FE0; --accent-ink:#0E6BB0; --accent-soft:#E3F2FD; /* primary blue */
  --cta:#FF7A2F;    --cta-ink:#C2520F;    --cta-soft:#FFF1E8;    /* orange CTA */
  --good:#0E9C7A;   /* Smile brand green, used only for recommendation callout */
  --radius:14px;
}
```

## TOPICS Data Array

Both files share the same six-topic course taxonomy. Each file maintains its own copy of the array with slightly different shapes.

### handoff_2.html shape

Items use `t` (text) and `b` (badge). Topics contain `groups` (sub-groupings with labels):

```js
const TOPICS = [
  {
    id: 'tcas',          // stable slug for analytics/anchors
    icon: 'ti-school',   // Tabler icon class
    title: 'TCAS & เตรียมสอบเข้ามหาลัย',
    isNew: false,        // shows "ใหม่" tag on left rail when true
    groups: [
      {
        label: 'แนะนำสำหรับ Dek70',
        items: [ { t: 'TGAT ความถนัดทั่วไป' }, { t: 'A-Level คณิต 1', b: 'NEW' } ]
      }
    ]
  },
  // ...5 more topics
];
```

### mobile-options.html shape

Items still use `t` and `b`. Topics add `short` (abbreviated tab label) and `count` (item count shown on Card Grid). No nested `groups`:

```js
const TOPICS = [
  {
    id: 'tcas', icon: 'ti-school',
    title: 'TCAS & เตรียมสอบเข้ามหาลัย',
    short: 'TCAS',    // shown inside narrow chip tabs
    count: 10,        // shown on Card Grid tiles
    isNew: false,
    items: [ { t: 'TGAT ความถนัดทั่วไป' }, { t: 'A-Level คณิต 1', b: 'NEW' } ]
  },
  // ...5 more topics
];
```

### Current six topics (both files)

| # | `id`      | Icon              | `isNew` |
|---|-----------|-------------------|---------|
| 1 | `tcas`    | `ti-school`       | —       |
| 2 | `faculty` | `ti-stethoscope`  | —       |
| 3 | `grade`   | `ti-users`        | —       |
| 4 | `live`    | `ti-bolt`         | —       |
| 5 | `others`  | `ti-package`      | true    |
| 6 | `trial`   | `ti-gift`         | true    |

When adding, removing, or renaming a topic, **edit the `TOPICS` array only** — all UI panels update automatically from it.

## Architecture Patterns

### handoff_2.html — Interactive Mock + PRD

**Sticky TOC** — `<nav class="toc" id="toc">` uses `IntersectionObserver` to highlight the section currently in view (`rootMargin:'-20% 0px -70% 0px'`). Section IDs and matching TOC `href` values must stay in sync:

| Section | `id`        | TOC `href`    |
|---------|-------------|---------------|
| Mock    | `mock`      | `#mock`       |
| 1       | `overview`  | `#overview`   |
| 2       | `problem`   | `#problem`    |
| 3       | `scope`     | `#scope`      |
| 4       | `structure` | `#structure`  |
| 5       | `data`      | `#data`       |
| 6       | `interaction` | `#interaction` |
| 7       | `responsive`  | `#responsive`  |
| 8       | `states`    | `#states`     |
| 9       | `ac`        | `#ac`         |
| 10      | `future`    | `#future`     |
| 11      | `questions` | `#questions`  |

**Device toggle mock** — Buttons call `setDevice('mobile'|'desktop')`, which changes the `#mock-inner` width, toggling the `.is-mobile` CSS class (hides rail labels, shrinks `newtag`), and adjusts `#mock-mega` grid columns inline.

**Rail + detail rendering** — `renderRail()` and `renderDetail()` loop over `TOPICS`. Rail items use `data-idx` attributes and are wired via a delegated `click` and `keydown` listener on `#rail`. Keyboard: Enter/Space selects the focused tab.

**Badge logic** — `badge === 'NEW'` → `.badge.new` (blue); any other string → `.badge.live` (amber); absent → no badge.

### mobile-options.html — Three Option Panels

**Option 1 — Quick Wins accordion** — Built with `<div class="acc-sec">` toggled open/closed by adding/removing `.open` via a click listener on `.acc-head`. No `<details>` element (pure JS toggle).

**Option 2 — Category Tabs** — `render2()` rebuilds `.chip` list and `#list2` from `TOPICS[act2]`. Pointer-drag horizontal scroll is implemented with `pointerdown`/`pointermove`/`pointerup` on the chip container (`dragMoved` flag differentiates a drag from a click). Left/right arrow buttons call `scrollBy`.

**Option 3 — Card Grid** — `render3Home()` shows a 2-column card grid. Clicking a `.card` calls `render3List(i)` which injects a back-bar (`#back3`) and the course list into `#scr3`. Clicking `#back3` calls `render3Home()`.

## Responsive Design

Both files are **Mobile First**: base CSS is for mobile, desktop enhancements are added with `min-width` media queries — never write desktop first and override down.

| Breakpoint           | Layout                                            |
|----------------------|---------------------------------------------------|
| Base / mobile (~390px) | Single column; rail = horizontal icon-only tab strip (scrollable) |
| `min-width: 761px`   | Master–detail 2-column (rail 248px fixed left + detail right) |
| `max-width: 880px`   | TOC hidden (`display:none`); single-column `main` |

Touch targets must be ≥ 44×44 px on mobile rail items and course list rows.

## Development Workflow

No build step. To view or edit:
1. Open the target HTML file directly in a browser (`file://` URL or double-click).
2. Edit in any text editor; reload the browser to see changes.
3. Commit and push directly — there is no CI pipeline.

## Conventions

- All user-facing text is in **Thai**. Keep UI strings in Thai when editing content.
- When renaming a section in `handoff_2.html`, update **both** the `id` attribute on the `<section>` and the `href` in `<nav class="toc">`.
- The handoff document embeds design intent as HTML comments inside `<section>` blocks; preserve these when restructuring markup.
- The `id` field in each TOPICS entry is a **stable analytics slug** — do not rename it without updating any analytics event references.
- Do not add `JetBrains Mono` to `smile-course-menu-mobile-options.html`; it intentionally omits that font (code blocks are not used there).
