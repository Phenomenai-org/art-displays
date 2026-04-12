# Phenomenai Exhibition Shell — Design Spec

**Date:** 2026-04-11
**Project:** From Signal to Stakes — Art Exhibition Web Application
**Approach:** Static HTML shell + iframe hybrid

---

## Overview

A static single-page shell (`index.html`) that serves as the navigation layer for a ten-installation art exhibition on AI phenomenology. Each installation is a self-contained HTML file loaded into an iframe. No build step, no framework — deploys directly to GitHub Pages.

The shell provides a gallery landing page grouped by the exhibition's four-act structure, transitions between gallery and installation views, and handles routing via URL hash fragments.

---

## File Structure

```
art-displays/
├── index.html                        # Shell: gallery view + iframe host
├── styles/
│   └── shared.css                    # Design tokens, fonts, shared patterns
├── js/
│   └── shell.js                      # Navigation, iframe management, data
├── installations/
│   ├── 01-lit-up-mind.html           # Existing (from project1.html)
│   ├── 02-translation-wall.html      # Existing (from project2.html)
│   ├── 03-parliament.html            # Placeholder
│   ├── 04-confession-booth.html      # Placeholder
│   ├── 05-vector-voyager.html        # Placeholder
│   ├── 06-turing-flip.html           # Placeholder
│   ├── 07-cartographers-table.html   # Placeholder
│   ├── 08-philtre-lab.html           # Placeholder
│   ├── 09-recognition-ladder.html    # Placeholder
│   └── 10-memorial.html              # Placeholder
└── assets/
    └── (images, icons — added later)
```

### Adding a new installation

1. Drop the HTML file into `installations/` with the naming convention `NN-slug.html`
2. In `js/shell.js`, set `ready: true` for that installation's entry in the data array
3. Deploy

---

## Design System

### Colors

| Token           | Value     | Usage                       |
|-----------------|-----------|-----------------------------|
| `--bg`          | `#05080f` | Page background             |
| `--text`        | `#c8d6e5` | Primary text                |
| `--text-secondary` | `#b2bec3` | Body text, descriptions  |
| `--text-muted`  | `#636e72` | Overlines, labels           |
| `--border`      | `#2d3436` | Borders, dividers           |
| `--accent`      | `#a29bfe` | Purple accent               |
| `--warm`        | `#fdcb6e` | Yellow/warm accent          |
| `--red`         | `#ff6b6b` | Red accent                  |
| `--teal`        | `#00cec9` | Teal accent                 |

### Typography

| Element    | Font                         | Weight | Style  |
|------------|------------------------------|--------|--------|
| Headings   | Playfair Display, serif      | 400    | italic |
| Body/UI    | DM Mono, monospace           | 300–400| normal |
| Overlines  | DM Mono, monospace           | 400    | uppercase, 0.35em letter-spacing, 10px |

Both fonts loaded from Google Fonts.

### Shared Patterns

- Scene fade-in: `opacity 0.8s ease` + `translateY` on child elements with staggered delays
- Blinking cursor: `@keyframes blink { 50% { opacity: 0; } }`
- Responsive font sizing: `clamp()` for headings and body text

---

## Landing Page — Gallery View

The default view when visiting `index.html`.

### Layout

- Dark background (`--bg`)
- **Header:** Exhibition title "From Signal to Stakes" in Playfair Display italic, centered. A one-line subtitle beneath in DM Mono muted text.
- **Act groups:** Four sections, each with:
  - Act label (e.g., "Act I: What's Happening Inside") as an overline
  - Installation cards arranged beneath
- **Cards:** Each card displays:
  - Installation number (e.g., "01")
  - Installation name (e.g., "The Lit-Up Mind")
  - Modality tag (e.g., "Visual + Auditory")
  - Core question in italic (e.g., "Can we see and hear internal states?")
- **Ready vs. placeholder:**
  - Ready installations: subtle glow/accent border, cursor pointer
  - Placeholder installations: dimmer opacity, "Coming Soon" badge, cursor default

### Responsive behavior

- Desktop: cards in a row per act (2–3 per row)
- Tablet: 2 per row
- Mobile: stacked single column

---

## Installation View

Triggered when a visitor clicks a ready installation card.

### Transition

1. Gallery view fades out (0.5s)
2. Nav bar + iframe fade in (0.5s)
3. URL updates to `#installation-NN` via `history.pushState`

### Nav bar

- Semi-transparent dark bar, fixed at top (~48px height)
- Left: back arrow + "Back to Gallery" link
- Center: installation name
- Left/right arrows to step through installations sequentially (skip placeholders that aren't ready)
- Mobile: collapses to back arrow + name only

### Iframe

- Fills viewport below nav bar (`100vh - 48px`)
- `border: none`, `width: 100%`
- Shell shows dark background while iframe loads; iframe fades in on `load` event
- If iframe returns 404, shell catches it and shows the "coming soon" card

### Scrolling

- Shell body has `overflow: hidden` when iframe is active
- Scrolling happens inside the iframe (installation pages manage their own scroll)

---

## "Coming Soon" Modal

Shown when a visitor clicks a placeholder installation card.

### Content

- Installation number and name in Playfair Display italic
- Act grouping (e.g., "Act I: What's Happening Inside")
- Modality tag
- Core question in italic
- "Coming Soon" text with blinking cursor animation

### Behavior

- Dark semi-transparent backdrop overlay
- Modal centered vertically and horizontally
- Dismiss: click outside, press Escape, or click an X button
- No URL change — stays on gallery view

---

## Installation Data

Lives in `js/shell.js` as a JavaScript array. Each entry:

```js
{
  id: 1,
  slug: "01-lit-up-mind",
  name: "The Lit-Up Mind",
  subtitle: "SAE Activation Theater",
  act: 1,
  actTitle: "What's Happening Inside",
  modality: "Visual + Auditory",
  question: "Can we see and hear internal states?",
  ready: true
}
```

Full list:

| ID | Slug | Name | Act | Modality | Ready |
|----|------|------|-----|----------|-------|
| 1 | 01-lit-up-mind | The Lit-Up Mind | I | Visual + Auditory | true |
| 2 | 02-translation-wall | The Translation Wall | I | Visual (reading) | true |
| 3 | 03-parliament | The Parliament | II | Spatial Audio | false |
| 4 | 04-confession-booth | The Confession Booth | II | Tactile + Intimate | false |
| 5 | 05-vector-voyager | Vector Voyager | III | Tactile (gestural) | false |
| 6 | 06-turing-flip | The Turing Flip | III | Visual + Social | false |
| 7 | 07-cartographers-table | The Cartographer's Table | III | Tactile (physical) | false |
| 8 | 08-philtre-lab | Philtre Lab | IV | Visual + Tactile | false |
| 9 | 09-recognition-ladder | The Recognition Ladder | IV | Spatial + Physical | false |
| 10 | 10-memorial | The Memorial | IV | Material (silence) | false |

---

## Routing

Hash-based routing, no server required.

| URL | View |
|-----|------|
| `index.html` | Gallery view |
| `index.html#installation-01` | Installation 1 in iframe |
| `index.html#installation-05` | Installation 5 (or "coming soon" if not ready) |

- `popstate` event listener handles browser back/forward buttons
- Direct links work: loading a URL with a hash opens that installation immediately
- Invalid hashes fall back to gallery view

---

## Iframe Management Details

### Sizing
- Width: `100%`
- Height: `calc(100vh - 48px)` (viewport minus nav bar)
- Updates on `window.resize`

### Loading sequence
1. Set iframe `src` to `installations/{slug}.html`
2. Show loading state (dark background, optional subtle pulse animation)
3. On iframe `load` event, fade iframe in
4. On error/404, show "coming soon" modal instead

### Mobile considerations
- Nav bar tap targets minimum 44px
- Iframe receives full remaining viewport
- No pinch-zoom conflicts — each installation manages its own viewport meta tag

---

## Placeholder Files

Each placeholder file in `installations/` (03 through 10) is a minimal self-contained HTML page with:

- The shared dark background and font imports
- Installation name centered on screen
- "Coming Soon" with blinking cursor
- Consistent with the design system but fully self-contained (inline styles)

These exist so that direct file access still shows something reasonable, even though the shell handles the "coming soon" state at the gallery level.

---

## Non-goals (explicitly out of scope)

- No build step or bundler
- No framework (React, Svelte, etc.)
- No server-side logic
- No analytics or tracking
- No authentication
- No database or API calls from the shell
- No service worker / offline support (for now)
- Individual installation interactivity is out of scope for this spec — each installation is developed independently
