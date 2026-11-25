# Alysion mode: design

Status: draft, waiting for approval.

## Intent

DIGIMON ALYSION is a new mobile game that uses new cards plus older paper cards. Players should be able to switch the whole site to Alysion and build, save and browse Alysion decks.

## Goals

- A switch in the top bar changes the site between Paper and Alysion.
- Alysion cards come from the wiki through the existing card pipeline. Cards are "pretty much the same", so older cards reuse the data the app already has.
- Each mode has its own filters.
- The backend stores which mode a deck belongs to and lists decks per mode.

## Non-goals

- Alysion card art or text for older cards.
- Collection, Rulings and Products in Alysion mode (changed 2026-11-25 during the build): their links are gone, their routes lead to card search, and owned counts, the missing-card tools and collection mode are hidden. Paper collection import and export stay in Settings.
- Pack data.
- Price compare and price check in Alysion mode (paper prices do not apply, so they are hidden).

## Must not happen

- An existing deck disappears, changes, or shows missing cards.
- The old frontend breaks against the new backend.
- Switching modes loses an unsaved deck.

## Approaches

| Approach | Trade-off |
|---|---|
| **One card list, Alysion pool as a subset (chosen)** | No duplicate data, pipeline unchanged. Cannot show different text for an old card. |
| Separate Alysion card file | Allows differences. Duplicates about 600 cards for no visible gain while cards are the same. |
| Copy game art from a third-party site | Looks like the game. Rejected: cards are to come from the wiki. |

Chosen from the request: wiki cards like the current ones, two filter sets, decks in the backend.

## Card pool

New file `src/models/data/alysion.data.ts`:

- Every print of cards in `BD*`, `ED*` and `SD*` sets.
- Base print only (id without `_P`) of cards in `BT1`-`BT4` and `ST1`-`ST6`.
- Restricted to 1: `BT2-047`, `BT3-103`. Every other card in the pool is unrestricted, whatever its paper status.

The wiki set pages do not list the reused older cards, so the old-set list is maintained by hand and a new Alysion pack means adding its set here. The list comes from Game8 and digimoncard.io and explains 604 of the latter's 617 cards; the other 13 are unidentified.

Paper mode shows everything except `BD*`, `ED*` and `SD*` cards.

New cards missing from the app arrive through the existing pipeline (`scripts/python/Wiki`), which already knows the BD set pages. Check that it also covers ED and SD, and run it. No hand edits to card JSON.

## App

- **Setting:** `alysionMode` (boolean) in the save settings, so it is remembered like the card language.
- **Card store:** `cards` and `cardsMap` keep the full list for deck lookups. A new `poolCards` holds the current mode's cards. Everything that browses uses `poolCards`: card search, deckbuilder list, global search, collection pages and completion, card dialog previous/next, collection export by set.
- **Filters:** the filter store keeps one filter per mode and swaps them on switch. In Alysion mode the set list offers only pool sets, and the price and block filters are hidden. The `DIGIMON ALYSION` preset is removed, since the switch replaces it.
- **Decks:** `IDeck.format?: 'alysion'`. Absent means paper. A new or imported deck takes the current mode and keeps it.
- **Builder:** checks follow the deck's format. Alysion decks use the Alysion restrictions and flag cards outside the pool. Size rules stay 50 main, 5 eggs, 4 copies.
- **Switching with a deck open:** the builder keeps one draft per mode, so nothing is lost. Opening a saved deck switches the site to that deck's mode.
- **Deck lists:** community decks, home top decks and profile decks show the current mode only. The admin pages show everything. In Alysion mode, community and top decks are every deck made only of released Alysion cards, older paper decks included (changed 2026-11-26); the backend filters by card id, and opening such a shared deck keeps Alysion mode and makes an Alysion copy.
- **Tier list:** paper only; not shown in Alysion mode (added 2026-11-26).
- **Sign-out state:** works without an account, as today.

## Backend (`Digimon-Card-Backend`, MongoDB branch)

- `deck.model.ts`: `format: { type: String, enum: ['paper', 'alysion'], default: 'paper' }`; the same field on the user's embedded deck schema.
- `createDeck`: pass `format` through.
- `GET /api/decks` and `/api/decks/top`: optional `format`. `alysion` matches `format: 'alysion'`; `paper` matches `format: { $ne: 'alysion' }`, which covers old decks without the field; absent filters nothing.
- Validation: reject other values.
- No data migration.
- Tests for the query and create paths in the existing Jest suite.

The app sends `paper` or `alysion` and treats an absent value as paper.

**Release order:** backend first. The current backend drops unknown fields, so Alysion decks saved before it is updated would be stored as paper decks. Deploying through Coolify happens only with your go-ahead.

## Testing

- Unit: pool membership, Alysion restrictions and deck checks, mode-filtered card lists, filter swap.
- Backend: format filtering, including old decks without the field.
- Browser: switch modes, build and save a deck in each, confirm old decks are unchanged.

## Left to the builder

Switch styling and placement within the top bar, naming of store methods, and how components read the mode.
