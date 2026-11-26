"""
GetAlysionDataFromWiki — the card pipeline for the DIGIMON ALYSION sets only (WikiVariables.alysionPageLinks).

Same phases and options as GetDataFromWiki.py, but its own card files (AlysionCards, PreparedAlysionCards*):
    python GetAlysionDataFromWiki.py
    python GetAlysionDataFromWiki.py --skip fetch_images

Rulings.json is shared, so never run the two at the same time.
"""

import json
import time

import GetDataFromWiki as GDW
import GetCardData
import GetLinks
import WikiVariables as WV

# ids scraped in this run; only these hold unformatted wiki text
scraped_ids = set()


def fetch_links(stats: GDW.PipelineStats) -> None:
    """Card links of the Alysion set pages: no promos, and Links.json (the paper card list) stays untouched."""
    GDW.logger.info("═══ Phase 1: Fetch Alysion card links ═══")
    t0 = time.time()
    for page in WV.alysionPageLinks:
        GDW.logger.info("Getting links for: %s", page["name"])
        GetLinks.getLinks(page)

    WV.cardLinks = sorted(set(WV.cardLinks))
    WV.cardCount = stats.links_found = len(WV.cardLinks)
    if not WV.cardLinks:
        raise RuntimeError("No Alysion card links found")
    stats.phase_times["fetch_links"] = time.time() - t0
    GDW.logger.info("Phase 1 complete: %d links", stats.links_found)


def scrape_cards(stats: GDW.PipelineStats) -> None:
    """New sets list cards whose pages are not written yet, so only an empty result counts as a failure."""
    GDW.logger.info("═══ Phase 2: Scrape card data ═══")
    t0 = time.time()
    GetCardData.getCardData()
    stats.cards_scraped = len(WV.cards)
    if not WV.cards:
        raise RuntimeError(f"None of {len(WV.cardLinks)} card pages could be scraped")
    scraped_ids.update(card.id for card in WV.cards)
    stats.phase_times["scrape_cards"] = time.time() - t0
    GDW.logger.info("Phase 2 complete: %d of %d cards scraped", stats.cards_scraped, len(WV.cardLinks))


def format_cards(stats: GDW.PipelineStats) -> None:
    """Format only this run's cards: a second pass over formatted text strips its line breaks."""
    with open(WV.cardsJson(), encoding="utf-8") as f:
        cards = json.load(f)
    others = [card for card in cards if card["id"] not in scraped_ids]

    def save(data):
        with open(WV.cardsJson(), "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, sort_keys=True)

    # the shared formatting works on the whole card file, so give it only the new cards
    save([card for card in cards if card["id"] in scraped_ids])
    try:
        GDW.format_cards(stats)
        with open(WV.cardsJson(), encoding="utf-8") as f:
            cards = others + json.load(f)
    finally:
        save(sorted(cards, key=lambda card: card["id"]))


OWN_PHASES = {"fetch_links": fetch_links, "scrape_cards": scrape_cards, "format_cards": format_cards}
PHASES = [(name, OWN_PHASES.get(name, phase)) for name, phase in GDW.PHASES]


def use_alysion_files() -> None:
    WV.cardsName = "AlysionCards"


if __name__ == "__main__":
    use_alysion_files()
    GDW.PHASES = PHASES
    GDW.main()
