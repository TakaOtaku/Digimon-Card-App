"""
GetAlysionDataFromWiki — the card pipeline for the DIGIMON ALYSION sets only (WikiVariables.alysionPageLinks).

Same phases, options and card files as GetDataFromWiki.py:
    python GetAlysionDataFromWiki.py
    python GetAlysionDataFromWiki.py --skip fetch_images

The two runs write the same JSON files, so never run them at the same time.
"""

import time

import GetDataFromWiki as GDW
import GetCardData
import GetLinks
import WikiVariables as WV


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
    stats.phase_times["scrape_cards"] = time.time() - t0
    GDW.logger.info("Phase 2 complete: %d of %d cards scraped", stats.cards_scraped, len(WV.cardLinks))


OWN_PHASES = {"fetch_links": fetch_links, "scrape_cards": scrape_cards}
PHASES = [(name, OWN_PHASES.get(name, phase)) for name, phase in GDW.PHASES]


if __name__ == "__main__":
    GDW.PHASES = PHASES
    GDW.main()
