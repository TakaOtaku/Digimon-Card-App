# Alysion Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A top-bar switch that turns the whole site into DIGIMON ALYSION mode, with its own card pool, filters and saved decks.

**Architecture:** One card list; Alysion is a derived subset (`poolCards`). Deck lookups keep using the full list. Decks carry a `format` that the backend stores and filters by.

**Tech Stack:** Angular (signals, NgRx signal stores), PrimeNG, Jest. Backend: Express, TypeScript, Mongoose, Jest.

**Spec:** `docs/superpowers/specs/2026-11-25-alysion-mode-design.md`

## Global Constraints

- Pool: every print of `BD*`, `ED*`, `SD*` sets; base print only (id without `_P`) of `BT1`-`BT4` and `ST1`-`ST6`.
- Alysion restricted to 1: `BT2-047`, `BT3-103`. Every other pool card is `Unrestricted`.
- Paper mode shows everything except `BD*`, `ED*`, `SD*`.
- Deck size: 50 main, at most 5 eggs, 4 copies.
- A deck's format is `'paper' | 'alysion'`; absent means paper. No data migration.
- Existing decks must not disappear, change, or show missing cards. The old frontend must keep working against the new backend.
- Collection counts are shared. No new dependencies. No hand edits to card JSON.
- Both repos: work on a branch `feat/alysion-mode`; no AI attribution in commits; never `git add -A`; no push or Coolify deploy without the user's go-ahead.

## Before Task 1

The app working tree holds uncommitted work in files this plan edits (`deck-view.component.ts`, `digimon-card.functions.ts`, `pagination-card-list.component.ts`, `deckbuilder-page.component.ts`, card JSON and more). **Ask the user** to commit it or say how to keep it apart. Do not start on top of it silently.

## Review Focus

- A saved deck opened by URL before the save has loaded, with the other mode remembered: the deck stays open and the site switches to its format (test in Task 3).
- Settings saved before this feature (no `alysionMode`): paper mode (Task 3).
- Changing card language while in Alysion mode: the pool stays Alysion (Task 2).
- An Alysion deck holding a paper alternate art (`BT1-010_P1`) or `BT5-001`: both flagged, neither removed (Task 4).
- Saving a user save with decks of both formats: `format` survives the round trip (Task 5).

---

### Task 1: Backend deck format

Repo: `C:\Users\chris\Documents\Repositories\Digimon-Card-Backend`

**Files:**
- Modify: `app/models/deck.model.ts`, `app/models/user.model.ts`, `app/services/deck.service.ts`, `app/controllers/deck.controller.ts`, `app/middleware/validation.middleware.ts`
- Test: `__tests__/services/deck.service.test.js`, `__tests__/middleware/validation.middleware.test.js`

**Interfaces:**
- Produces: `format?: 'paper' | 'alysion'` on deck create/update; `GET /api/decks?format=` and `GET /api/decks/top?format=&limit=`. `findTopDecks(limit = 10, format?: string)`.

- [ ] **Step 1: Update the checkout.** `master` was pulled to `13cc578` on 2026-11-25 (remote uses the `github-personal` SSH alias). `git pull --ff-only`, then `git switch -c feat/alysion-mode`. Run `npm ci`, then `npm test`; record the baseline.
- [ ] **Step 2: Write failing tests**

```js
// buildDeckQuery
expect(deckService.buildDeckQuery({ format: 'alysion' }).format).toBe('alysion');
expect(deckService.buildDeckQuery({ format: 'paper' }).format).toEqual({ $ne: 'alysion' });
expect(deckService.buildDeckQuery({})).toEqual({});
// createDeck
expect((await deckService.createDeck({ id: 'd', cards: [], format: 'alysion' }, 'u')).format).toBe('alysion');
// validateDeckCreate and validateDeckUpdate
// format: 'bogus' -> res.status 400, next not called; 'paper', 'alysion', absent -> next called
```

Add a `findTopDecks(4, 'paper')` test asserting the first aggregate stage is `{ $match: { format: { $ne: 'alysion' } } }`, and that no `$match` stage exists without a format (add `DeckConstructor.aggregate = jest.fn()` to the mock).

- [ ] **Step 3:** `npm test` - the new tests fail.
- [ ] **Step 4: Implement.** Schema field `format: { type: String, enum: ['paper', 'alysion'], default: 'paper' }` on `deckSchema`, and the same field without `default` on `embeddedDeckSchema` (an absent value already means paper, and defaults would rewrite old user decks). Share one filter helper between `buildDeckQuery` and `findTopDecks`. `createDeck` passes `format`. Controller reads `req.query.format`.
- [ ] **Step 5:** `npm test` and `npm run build` pass.
- [ ] **Step 6: Commit** `feat: store and filter deck format`

---

### Task 2: Alysion pool and card store

Repo from here on: `Digimon-Card-App`.

**Files:**
- Create: `src/models/data/alysion.data.ts`, `src/app/functions/alysion.functions.ts`, `src/app/functions/alysion.functions.spec.ts`, `src/app/store/digimon-card.store.spec.ts`
- Modify: `src/models/data/index.ts`, `src/models/interfaces/deck.interface.ts`, `src/app/store/digimon-card.store.ts`

**Interfaces:**
- Produces:
  - `type DeckFormat = 'paper' | 'alysion'` (in `deck.interface.ts`); `IDeck.format?: DeckFormat`
  - `ALYSION_REUSED_SETS: string[]`, `ALYSION_RESTRICTED: string[]`
  - `deckFormat(deck: { format?: DeckFormat }): DeckFormat`
  - `isAlysionSet(set: string): boolean` - `'BD01'`, `'ST1'`
  - `isInAlysionPool(card: Pick<DigimonCard, 'id' | 'cardNumber'>): boolean`
  - `restrictionFor(card: DigimonCard, format: DeckFormat): string`
  - `poolFor(cards: DigimonCard[], format: DeckFormat): DigimonCard[]` - Alysion results are copies with `restrictions.english` set from `restrictionFor`
  - `DigimonCardStore`: state `format: DeckFormat` (`'paper'`), computed `poolCards()`, method `updateFormat(format: DeckFormat): void`. `cards()` and `cardsMap()` stay the full list.

- [ ] **Step 1: Write failing tests**

```ts
const c = (id: string, english = 'Unrestricted') =>
  ({ id, cardNumber: id.split('_')[0], restrictions: { english } }) as DigimonCard;
const all = [c('BD01-02'), c('BD01-02_P1'), c('ED01-01'), c('SD01-02'), c('BT1-010'), c('BT1-010_P1'),
  c('ST6-01'), c('BT5-001'), c('ST7-01'), c('BT2-047'), c('BT1-084', 'Banned')];

expect(poolFor(all, 'alysion').map((x) => x.id)).toEqual(
  ['BD01-02', 'BD01-02_P1', 'ED01-01', 'SD01-02', 'BT1-010', 'ST6-01', 'BT2-047', 'BT1-084']);
expect(poolFor(all, 'paper').map((x) => x.id)).toEqual(
  ['BT1-010', 'BT1-010_P1', 'ST6-01', 'BT5-001', 'ST7-01', 'BT2-047', 'BT1-084']);
expect(restrictionFor(c('BT2-047'), 'alysion')).toBe('Restricted to 1');
expect(restrictionFor(c('BT1-084', 'Banned'), 'alysion')).toBe('Unrestricted');
expect(restrictionFor(c('BT1-084', 'Banned'), 'paper')).toBe('Banned');
expect(all.find((x) => x.id === 'BT1-084')!.restrictions.english).toBe('Banned'); // not mutated
expect(deckFormat({})).toBe('paper');
```

Store spec: mock `fetch`; after `updateFormat('alysion')` then `updateCards(CARDSET.English)` and again `updateCards(CARDSET.Japanese)`, `poolCards()` holds only pool cards and `cards()` holds all.

- [ ] **Step 2:** `npx jest alysion digimon-card.store` - fails.
- [ ] **Step 3: Implement** the interfaces above. Set = `cardNumber.split('-')[0]`; `ALYSION_REUSED_SETS` = `BT1`-`BT4`, `ST1`-`ST6`; Alysion-only sets match `/^(BD|ED|SD)\d+$/`.
- [ ] **Step 4:** Same command passes.
- [ ] **Step 5: Commit** `feat: add Alysion card pool`

---

### Task 3: Mode setting and per-mode state

**Files:**
- Create: `src/app/services/alysion-mode.service.ts`, `src/app/services/alysion-mode.service.spec.ts`
- Modify: `src/models/interfaces/settings.interface.ts`, `src/models/data/save.data.ts`, `src/app/store/website.store.ts`, `src/app/store/filter.store.ts`, `src/app/store/save.store.ts`, `src/app/app.component.ts`, `src/app/features/deckbuilder/deckbuilder-page.component.ts`, `src/app/features/shared/dialogs/deck-dialog.component.ts`, `src/app/features/home/components/home-intro.component.ts`

**Interfaces:**
- Consumes: Task 2.
- Produces:
  - `ISettings.alysionMode?: boolean` (`emptySettings`: `false`)
  - `IDeckFilter.format?: DeckFormat` (declared in `src/app/services/mongo-backend.service.ts`)
  - `FilterStore.switchFormat(format: DeckFormat): void`
  - `WebsiteStore`: state `format: DeckFormat`, `otherDraft: IDeck | null`; `switchFormat(format)`; `createNewDeck(id)` stamps the current format
  - `AlysionModeService`: `mode: Signal<DeckFormat>` (the card store's `format`), `setMode(format)`, `openDeck(deck: IDeck)`, `syncFromSave()`
  - `SaveStore.showPrices()` is false in Alysion mode

Behaviour:
- Both `switchFormat` methods do nothing if already in that format.
- Filter: swaps the active filter with the stored one (first visit: `emptyFilter`) and clears `advancedSearch`.
- Website: swaps `deck` with `otherDraft` (none: `emptyDeck` with a new uuid and that format), and sets `decksFilter` to `{ ...old, format, page: 1, cardSet: '' }`. Initial `decksFilter.format` is `'paper'`.
- `setMode` writes the setting and updates all three stores synchronously.
- `openDeck` = `setMode(deckFormat(deck))`, then `websiteStore.updateDeck(deck)`. It replaces that mode's draft, as opening a deck does today. Use it at every place that loads a saved deck into the builder (the three components above); same-deck edits keep `updateDeck`.
- `syncFromSave`: on the first call after load, a non-empty open deck wins (`setMode` to its format); otherwise apply the saved setting. `app.component` calls it when settings change, before `setAdvancedSettings()`.

- [ ] **Step 1: Write failing tests** with the real stores:

```ts
it('treats settings without alysionMode as paper');            // syncFromSave -> mode() 'paper'
it('keeps one draft and one filter per mode');                 // set deck cards + setFilter ['BT10']; switch to alysion -> empty deck, format 'alysion', setFilter []; switch back -> both restored
it('opening a deck switches to its format');                   // openDeck(alysion) -> mode 'alysion', setting true, deck id kept
it('keeps a deck opened before the save loaded');              // openDeck(paper deck with cards); save then holds alysionMode true; syncFromSave() -> mode 'paper', same deck, setting false
it('stamps new decks with the current format');                // createNewDeck in alysion -> format 'alysion'
it('hides prices in Alysion mode');                            // showPrices true + alysionMode true -> showPrices() false
```

- [ ] **Step 2:** `npx jest alysion-mode` - fails.
- [ ] **Step 3: Implement** per the behaviour list.
- [ ] **Step 4:** `npx jest` passes.
- [ ] **Step 5: Commit** `feat: add Alysion mode state`

---

### Task 4: Deck checks follow the deck's format

**Files:**
- Modify: `src/app/functions/digimon-card.functions.ts`, `src/app/functions/deck-checks.spec.ts`, `src/app/features/deckbuilder/components/deck-stats.component.ts`, `src/app/features/shared/deck-card.component.ts`, `src/app/features/shared/dialogs/view-card-dialog.component.ts`

**Interfaces:**
- Consumes: `restrictionFor`, `isInAlysionPool`, `deckFormat`, `AlysionModeService.mode`.
- Produces: `deckChecks(cards: IDeckCard[], format: DeckFormat = 'paper'): DeckCheck[]`

- [ ] **Step 1: Write failing tests**

```ts
// alysion: two copies of BT2-047 -> copy-limit check not ok; one paper-'Banned' pool card x4 -> ok
// alysion: ['BT1-010_P1', 'BT5-001'] -> { label: 'Not in Alysion: <name>, <name>', ok: false }, counts still include them
// alysion with pool cards only -> { label: 'Alysion cards', ok: true }
// paper: exactly the three existing checks, unchanged
```

- [ ] **Step 2:** `npx jest deck-checks` - fails.
- [ ] **Step 3: Implement.** Copy limit uses `restrictionFor`; the Alysion check is a fourth entry. `deck-stats` passes `deckFormat(websiteStore.deck())`. Deck-card and card-dialog restriction badges use `restrictionFor(card, mode())`.
- [ ] **Step 4:** `npx jest` passes.
- [ ] **Step 5: Commit** `feat: check Alysion decks against Alysion rules`

---

### Task 5: Deck lists per mode

**Files:**
- Modify: `src/app/services/mongo-backend.service.ts`, `src/app/services/mongo-backend.service.spec.ts`, `src/app/store/website.store.ts`, `src/app/features/home/components/home-meta.component.ts`, `home-intro.component.ts`, `src/app/features/profile/components/decks.component.ts`, `src/app/features/shared/deck-filter.component.ts`

**Interfaces:**
- Consumes: Task 1's query parameters, Task 3's state.
- Produces: `getTopDecks(limit = 10, format?: DeckFormat)`.

- [ ] **Step 1: Write failing tests**
  - `getDecksPaginated({ format: 'alysion' })` requests a URL containing `format=alysion`.
  - `getTopDecks(4, 'paper')` requests `decks/top?limit=4&format=paper`; `getTopDecks(10)` has no `format`.
  - `updateDeck` body has `format: 'alysion'` for an Alysion deck and `'paper'` for a deck without one.
  - `updateSave` with one deck of each format sends both with `format` intact.
- [ ] **Step 2:** `npx jest mongo-backend` - fails.
- [ ] **Step 3: Implement.** `prepareDeckForMongo` sends `deckFormat(deck)`. `WebsiteStore.switchFormat` reloads the community decks. Home meta re-requests top decks when the mode changes. Saved-deck lists (profile, home recent) filter by `deckFormat(deck) === mode()`. The admin component passes no format. In Alysion mode the deck set dropdown offers only entries where `isAlysionSet` is true.
- [ ] **Step 4:** `npx jest` passes.
- [ ] **Step 5: Commit** `feat: list decks per mode`

---

### Task 6: Browsing uses the pool, plus switch and filters

**Files:**
- Create: `src/app/features/shared/navbar/alysion-switch.component.ts` and `.spec.ts`
- Modify: `navbar.component.ts`; `app.component.ts`; `pagination-card-list.component.ts`; `global-search.component.ts` and `.spec.ts`; `collection-page.component.ts`; `collection-circle.component.ts`; `view-card-dialog.component.ts` and `.spec.ts`; `settings-dialog/collection-export.component.ts`; `deck-toolbar.component.ts`; the component that opens the collection price check; `filter-side-box.component.ts`; `set-filter.component.ts`; `active-filters.component.ts`; `filter.functions.ts` and its spec; `filter.data.ts`; `website.data.ts`; `filter.interface.ts`

**Interfaces:**
- Consumes: `poolCards()`, `AlysionModeService`, `isAlysionSet`.
- Produces: `<digimon-alysion-switch>`.

- [ ] **Step 1: Write failing tests**
  - Global search given `poolCards` without a card that `cards` has does not return it.
  - Card dialog previous/next steps through `poolCards`.
  - Switch component: toggling calls `setMode('alysion')`, and `setMode('paper')` back.
- [ ] **Step 2:** `npx jest global-search view-card-dialog alysion-switch` - fails.
- [ ] **Step 3: Switch browsing reads to `poolCards()`:** the `filterCards` input in `app.component` and the pagination list (`cardsMap` stays), global search, collection completion, collection circle, card dialog previous/next, and the set selection in collection export. Lookups by id (deck mapping, import, collection import/export rows) stay on `cards()`/`cardsMap()`.
- [ ] **Step 4: UI.** Switch in the top navbar, visible on mobile and desktop: a labelled toggle button with `aria-pressed`. Sidebar: set options limited to `isAlysionSet` items in Alysion mode and updating on switch (the set filter's local value must follow the store, like `block-filter` does; check color, type, rarity and version filters also resync); block filter hidden in Alysion mode (price already hidden by `showPrices`). Hide price-check buttons in Alysion mode. Delete the preset filter everywhere (`presetFilter`, `Presets`, `PRESET_MATCHERS`, `applyPresetFilter` and its tests).
- [ ] **Step 5:** `npx jest`, `npm run lint` (no new findings) and `npm run build` pass.
- [ ] **Step 6: Commit** `feat: add Alysion switch`

---

### Task 7: End-to-end check

- [ ] **Step 1:** Start the app with the preview tool. In paper mode: no `BD`/`ED`/`SD` cards in search. Switch: only pool cards, Alysion set list, no price or block filter. Reload: still Alysion.
- [ ] **Step 2:** Build a deck in each mode, switch back and forth, confirm both drafts and filters survive; save both signed out and confirm each lists only in its mode. Open an existing deck and confirm it is unchanged. Repeat Step 1's views at mobile width.
- [ ] **Step 3:** Count pool cards per set in the browser (the pipeline's `WikiVariables.py` already lists the BD, ED and SD set pages). Report sets that are incomplete (BD-04 had 3 of 10 on 2026-11-25) and ask the user to run the card update workflow for them.
- [ ] **Step 4:** Report release order to the user: deploy the backend first (confirm whether Coolify builds `master` or `coolify`), then the app. Do not deploy.
