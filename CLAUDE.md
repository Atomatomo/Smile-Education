# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a **design handoff and interactive prototype repository** for the Smile Education platform (Thai online learning product). It contains no build system, package manager, or tests. The two HTML files are self-contained and open directly in any modern browser.

## Files

- `smile-course-menu-handoff_2.html` — The primary PRD + interactive mock for restructuring the course menu. Includes a sticky table-of-contents, design rationale, component specs, and before/after comparisons.
- `smile-course-menu-mobile-options.html` — Three side-by-side interactive mobile proposals (Quick Wins accordion, Category Tabs, Card Grid drill-down) driven by a shared `TOPICS` data array.

## Tech Stack

- **HTML5 / CSS3 / Vanilla JS (ES6+)** — no frameworks, no bundler
- **Tabler Icons** via CDN (`@tabler/icons-webfont`)
- **Google Fonts**: Noto Sans Thai, Plus Jakarta Sans, JetBrains Mono
- Language: Thai (`lang="th"`) throughout

## Architecture Patterns

### CSS Design System
Both files use CSS custom properties for all theming. The primary brand token is `--brand: #0E9C7A` (green). Change visual appearance by editing the `:root` variable block at the top of each file—do not scatter hardcoded colours into component rules.

### Data-Driven Rendering (`smile-course-menu-mobile-options.html`)
A single `TOPICS` array at the top of the `<script>` block is the single source of truth for all three option panels. Each option's render function loops over `TOPICS` to build its UI. When adding, removing, or renaming a topic category, **edit `TOPICS` only**—all three options update automatically.

```js
const TOPICS = [
  { id, icon, title, short, count, isNew?, items: [{label, tag?, isNew?}] },
  ...
]
```

### Interactivity
- **Option 1 (Quick Wins)**: CSS-only accordion via `<details>`/`<summary>`
- **Option 2 (Category Tabs)**: JS tab switching + pointer-drag horizontal scroll
- **Option 3 (Card Grid)**: JS drill-down with `currentTopic` state variable and a back-button to reset it

## Development Workflow

No build step. To view or edit:
1. Open the target HTML file directly in a browser (double-click or `file://` URL).
2. Edit in any text editor; reload the browser to see changes.
3. Commit and push directly—there is no CI pipeline.

## Conventions

- All user-facing text is in **Thai**. Keep UI strings in Thai when editing content.
- Section anchors in `handoff_2.html` follow kebab-case IDs that the sticky TOC links to — update both the heading `id` and the TOC `href` when renaming sections.
- The handoff document embeds design intent as comments inside `<section>` blocks; preserve these when restructuring markup.
