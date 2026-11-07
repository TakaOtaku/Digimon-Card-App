# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Digimon Card Game players who both build decks and track their collection: the same people use the deck builder, the collection and the card database. They work at a desk before tournaments and on their phones at events, so mobile touch use is a first-class requirement.

## Product Purpose

digimoncard.app is a website for tracking a Digimon Card Game collection, building decks and sharing them with the community. Success is a player finding any card (including alternative arts and SP/RP prints), building and price-checking a deck, and seeing what they own, quickly and on any device.

## Positioning

Free, ad-free, and everything in one place: card database, deck builder, collection tracker, price compare, community decks and tier list, with no paywall. Competitors named by the owner: digilab.cards and digimoncard.io.

## Operating Context

- Card data is scraped from the DigimonCardGame.Fandom wiki and refreshed by a scheduled GitHub Actions run (every 3 days); the site credits the wiki.
- New sets and alternative prints arrive frequently, so the data model (prints, SP/RP, sets) changes often.
- Users may sign in (profile, saved decks, collection); a separate backend repository serves that data.

## Capabilities and Constraints

- Angular 21 (standalone components, SSR/prerender), Tailwind and PrimeNG; Jest and Playwright for tests.
- Routes: home, cards, deckbuilder, collection, decks (community + tier list), deck page, profile, products, rulings, price-compare, plus admin and migration tools.
- UI is mostly English with some German strings.
- Card images may be missing; a placeholder is shown.

## Brand Commitments

Name: Digimon Card App (digimoncard.app). Existing logo at `src/assets/images/logo.png`. The current dark, blue-toned look from the earlier redesign is the incumbent.

## Evidence on Hand

Real card data and images in `src/assets/`; no testimonials or usage figures are on hand and none should be invented.

## Product Principles

1. One place for the whole play loop: find a card, build a deck, check prices, track what you own.
2. Free and ad-free; never put a paywall or ad slot in the core flow.
3. Data accuracy first: every print and variant a player can own should be findable.
4. Phone-first at events: every flow works with touch.
5. Credit the community and the wiki that provide the data.

## Accessibility & Inclusion

Mobile touch use is required (tap targets, no hover-only actions). Text is English with some German; avoid hard-coding strings in layouts that cannot grow. WCAG AA contrast is not a stated requirement but is the working target.
