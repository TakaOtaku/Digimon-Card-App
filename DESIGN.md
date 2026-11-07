---
name: Digimon Card App
description: A dark, device-like console for finding cards, building decks and tracking a collection.
colors:
  ink-0: "#0b111b"
  ink-1: "#111a28"
  ink-2: "#18243a"
  line: "#26354f"
  fg: "#e6edf7"
  muted: "#93a4bd"
  accent: "#4cc3ff"
  accent-strong: "#1d6fa8"
  accent-ink: "#04121f"
  bg-top: "#17212f"
  bg-bottom: "#08528d"
  card-red: "#e5484d"
  card-blue: "#3e9bff"
  card-yellow: "#f5c518"
  card-green: "#2fb67c"
  card-black: "#1c1f26"
  card-purple: "#8d6fdb"
typography:
  display:
    fontFamily: "Chakra Petch, sans-serif"
  body:
    fontFamily: "Inter, -apple-system, sans-serif"
  label:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "0.75rem"
    letterSpacing: "0.08em"
  mono:
    fontFamily: "JetBrains Mono, monospace"
rounded:
  md: "8px"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.md}"
  panel:
    backgroundColor: "{colors.ink-1}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
---

# Design System: Digimon Card App

## Overview

**Creative North Star: "The Digivice Console"**

The site behaves like a handheld device screen: layered navy panels, hairline borders and a single cyan signal color. It is a tool people use for long sessions, on a desk and on a phone, so it stays dense, readable and quiet, and lets card art supply the color.

Page headings use Chakra Petch for a technical, device-readout voice; everything else is Inter. Depth comes from tonal layers, not shadows.

**Key Characteristics:**
- Navy tonal layers (ink-0 to ink-2) separated by 1px line borders.
- One accent (cyan) for actions, selection and focus.
- Card colors (red, blue, yellow, green, black, purple, white) are reserved for card data, never for UI chrome.
- Dense but touch-ready: controls on phones keep tappable sizes.

## Colors

A cool navy palette with one electric-cyan accent.

### Primary
- **Signal Cyan** (#4cc3ff): primary buttons, selected pills, focus and active nav states. Text on it uses **Cyan Ink** (#04121f).
- **Deep Cyan** (#1d6fa8): filled backgrounds that must stay calm (`primary-background`).

### Neutral
- **Console Black-Blue** (#0b111b): deepest surfaces and wells (ink-0).
- **Panel Navy** (#111a28): default panels and cards (ink-1).
- **Raised Navy** (#18243a): inputs, chips, hover and nested surfaces (ink-2).
- **Hairline** (#26354f): all borders and dividers.
- **Console White** (#e6edf7): primary text. **Steel Mist** (#93a4bd): secondary text and labels.
- **Page Gradient**: #17212f at the top fading to #08528d, fixed behind everything.

### Card colors
Red #e5484d, Blue #3e9bff, Yellow #f5c518, Green #2fb67c, Black #1c1f26, Purple #8d6fdb, White #ffffff, plus a multi-color gradient. They mark card colors only.

### Named Rules
**The One Signal Rule.** Cyan is the only interactive accent; a second accent color is never introduced for UI.
**The Card Colors Stay On Cards Rule.** Game colors identify cards and filters, never decoration.

## Typography

**Display Font:** Chakra Petch (sans-serif fallback)
**Body Font:** Inter (-apple-system, sans-serif fallback)
**Label/Mono Font:** Inter for labels; JetBrains Mono for numbers such as prices and counts

**Character:** a technical heading voice over a neutral, highly legible interface face.

### Hierarchy
- **Display** (Chakra Petch, large): page titles and the home hero (every `h1` except tiny field labels).
- **Body** (Inter, 14-16px): default content.
- **Label** (Inter 12px, uppercase, 0.08em tracking, Steel Mist): small field labels (tiny `h1.text-xs` are styled this way).
- **Mono** (JetBrains Mono, up to 1.5rem semibold): prices and stats.

### Named Rules
**The Labels Whisper Rule.** Field labels are small, uppercase, muted; they never compete with values.

## Layout

Full-width app shell: a top navbar on desktop and a bottom bar on mobile (Home, Cards, Deckbuilder, Collection, Profile, Decks, More). Pages fill the visible viewport height (`--app-vh`, dvh-aware) with their own scroll regions. Tailwind spacing scale; grids go up to 13 columns for card lists. Mobile is first-class: wrap headers instead of overflowing, keep controls tappable, and avoid hover-only reveals (hover styles apply only on real pointers).

## Elevation & Depth

Flat tonal layering. Surfaces step ink-0 → ink-1 → ink-2 and are separated by 1px Hairline borders. Shadows appear only as feedback on hover or focus of raisable cards.

### Shadow Vocabulary
- **Raise** (`box-shadow: 0.2em 0.5em 0.5em 0 gray` with `translateY(-0.25em)`): hover/focus lift on card tiles; the `raise-xs` variant is half-size.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest; lift is a response to the pointer.

## Shapes

Gently rounded rectangles (8px, `rounded-lg`) for panels, inputs and buttons; fully rounded pills for segmented filters and chips; 6px tiles for small stat pills. 1px Hairline borders; selected cards get a 2px white or cyan border.

## Components

### Buttons
- **Shape:** 8px radius, 32px minimum height (`h-8`), 12px horizontal padding, 12px semibold text.
- **Primary:** Signal Cyan fill, Cyan Ink text.
- **Secondary:** Raised Navy fill, Hairline border, Console White text; the border turns cyan on hover.

### Chips / Segmented pills
- **Style:** pill (full radius) inside a Panel Navy track with a Hairline border.
- **State:** the selected pill is filled Signal Cyan with semibold Cyan Ink text; others are plain Console White. Use `aria-pressed`.

### Cards / Containers
- **Corner Style:** 8px. **Background:** Panel Navy. **Border:** 1px Hairline. **Padding:** 16px (px-4 py-3) for stat tiles. No nested cards.

### Inputs / Fields
- **Style:** Raised Navy fill, Hairline border, 8px radius. **Focus:** cyan border or ring.

### Navigation
- Icon-over-label tabs; active tab is highlighted cyan with an underline on desktop. A global card search with a Ctrl+K hint sits at the right of the desktop bar.

### Card tile (signature)
- A card image on a rounded tile with a version badge (e.g. Alternative Art) at the top and a "no image" placeholder when art is missing; selection is shown with a border, not a fill.

## Do's and Don'ts

### Do:
- **Do** use the ink tokens (`bg-ink-1`, `border-line`, `text-fg`, `text-muted`, `bg-accent`) instead of raw hex.
- **Do** keep tappable controls at least 32px high on phones.
- **Do** use JetBrains Mono for prices and counts.
- **Do** keep hover effects optional; every action must work on touch.

### Don't:
- **Don't** add a second accent color to UI chrome.
- **Don't** use card colors for decoration.
- **Don't** nest cards or add heavy shadows to resting surfaces.
- **Don't** reveal controls only on hover.
