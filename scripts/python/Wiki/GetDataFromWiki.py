"""
GetDataFromWiki — Phased pipeline for scraping Digimon card data from the wiki.

Phases (each is independent and can be run/debugged in isolation):
  1. fetch_links()      — Discover card links from all set pages + promos
  2. scrape_cards()     — Parse card data from each card's wiki page
  3. fetch_rulings()    — Scrape Q&A rulings for each card
  4. merge_cards()      — Diff-merge scraped cards into existing JSON (only update changed cards)
  5. fetch_images()     — Download new/updated card images from gallery pages
  6. format_cards()     — Apply string replacements, remove keyword explanations
  7. prepare_output()   — Split into ENG/JAP prepared JSONs, convert PNG→WebP, move files, cleanup

Run the full pipeline:
    python GetDataFromWiki.py

Run a single phase for debugging:
    python GetDataFromWiki.py --phase fetch_links
    python GetDataFromWiki.py --phase scrape_cards
    python GetDataFromWiki.py --phase merge_cards
    ...

Skip a phase:
    python GetDataFromWiki.py --skip fetch_images
"""

import argparse
import hashlib
import json
import logging
import os
import sys
import time
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Set

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("CardPipeline")

# ---------------------------------------------------------------------------
# Ensure lxml is available
# ---------------------------------------------------------------------------
try:
    import lxml  # noqa: F401
    logger.info("lxml parser available — faster HTML parsing enabled")
except ImportError:
    logger.warning("lxml not found — install with 'pip install lxml' for better performance")

# ---------------------------------------------------------------------------
# Local module imports (must be done after sys.path is correct)
# ---------------------------------------------------------------------------
import TransformPNG
import MoveFiles
import DeletePNGs
import FormatCards
import GetCardData
import GetCardImages
import GetLinks
import PrepareCards
import WikiVariables as WV
import WikiFunctions as WF

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
CARDS_JSON = "./scripts/python/Wiki/jsons/DigimonCards.json"


# ---------------------------------------------------------------------------
# Pipeline statistics
# ---------------------------------------------------------------------------
@dataclass
class PipelineStats:
    links_found: int = 0
    cards_scraped: int = 0
    scrape_errors: int = 0
    rulings_found: int = 0
    cards_new: int = 0
    cards_updated: int = 0
    cards_unchanged: int = 0
    cards_kept: int = 0
    images_downloaded: int = 0
    images_skipped: int = 0
    phase_times: Dict[str, float] = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Diff / merge helpers
# ---------------------------------------------------------------------------

def _card_content_hash(card: dict) -> str:
    """
    Compute a stable hash of the card fields that matter for change detection.
    Ignores cardImage (changes independently via image phase) and AAs/JAAs
    (volatile across runs due to gallery ordering).
    """
    relevant = {
        "name": card.get("name", {}),
        "cardType": card.get("cardType", "-"),
        "dp": card.get("dp", "-"),
        "playCost": card.get("playCost", "-"),
        "cardLv": card.get("cardLv", "-"),
        "form": card.get("form", "-"),
        "attribute": card.get("attribute", "-"),
        "type": card.get("type", "-"),
        "rarity": card.get("rarity", "-"),
        "color": card.get("color", "-"),
        "effect": card.get("effect", "-"),
        "digivolveEffect": card.get("digivolveEffect", "-"),
        "securityEffect": card.get("securityEffect", "-"),
        "aceEffect": card.get("aceEffect", "-"),
        "rule": card.get("rule", "-"),
        "restrictions": card.get("restrictions", {}),
        "block": card.get("block", []),
        "digivolveCondition": card.get("digivolveCondition", []),
        "specialDigivolve": card.get("specialDigivolve", "-"),
        "dnaDigivolve": card.get("dnaDigivolve", "-"),
        "burstDigivolve": card.get("burstDigivolve", "-"),
        "digiXros": card.get("digiXros", "-"),
        "assembly": card.get("assembly", "-"),
    }
    return hashlib.sha256(json.dumps(relevant, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def _load_existing_cards() -> Dict[str, dict]:
    """Load existing DigimonCards.json into a dict keyed by card id."""
    if not os.path.exists(CARDS_JSON):
        logger.info("No existing %s found — starting fresh", CARDS_JSON)
        return {}
    try:
        with open(CARDS_JSON, "r", encoding="utf-8") as f:
            data = json.load(f)
        return {card["id"]: card for card in data}
    except (json.JSONDecodeError, KeyError) as exc:
        logger.warning("Could not parse existing cards JSON: %s — starting fresh", exc)
        return {}


# ═══════════════════════════════════════════════════════════════════════════
# Phase 1 — Fetch links
# ═══════════════════════════════════════════════════════════════════════════

def fetch_links(stats: PipelineStats) -> None:
    """Discover all card links from set pages and promos."""
    logger.info("═══ Phase 1: Fetch card links ═══")
    t0 = time.time()

    for page in WV.wikiPageLinks:
        logger.info("Getting links for: %s", page["name"])
        GetLinks.getLinks(page)

    logger.info("Getting promo links")
    GetLinks.getPromoLinks()

    logger.info("Comparing to saved links")
    GetLinks.saveLinks()

    WV.cardLinks = sorted(list(set(WV.cardLinks)))
    WV.cardCount = len(WV.cardLinks)
    stats.links_found = WV.cardCount

    elapsed = time.time() - t0
    stats.phase_times["fetch_links"] = elapsed
    logger.info("Phase 1 complete: %d links in %.1fs", stats.links_found, elapsed)


# ═══════════════════════════════════════════════════════════════════════════
# Phase 2 — Scrape card data
# ═══════════════════════════════════════════════════════════════════════════

def scrape_cards(stats: PipelineStats) -> None:
    """Parse card data from each card's wiki page."""
    logger.info("═══ Phase 2: Scrape card data ═══")
    t0 = time.time()

    try:
        from GetCardDataFast import getCardDataOptimized
        logger.info("Using fast parallel processing")
        getCardDataOptimized("normal")
    except ImportError:
        logger.info("Using standard sequential processing")
        GetCardData.getCardData()
    except Exception as exc:
        logger.warning("Fast processing failed (%s) — falling back to standard", exc)
        GetCardData.getCardData()

    stats.cards_scraped = len(WV.cards)
    elapsed = time.time() - t0
    stats.phase_times["scrape_cards"] = elapsed
    logger.info("Phase 2 complete: %d cards scraped in %.1fs", stats.cards_scraped, elapsed)


# ═══════════════════════════════════════════════════════════════════════════
# Phase 3 — Fetch rulings
# ═══════════════════════════════════════════════════════════════════════════

def fetch_rulings(stats: PipelineStats) -> None:
    """Scrape Q&A rulings for each card."""
    logger.info("═══ Phase 3: Fetch rulings ═══")
    t0 = time.time()

    WF.getRulings()
    stats.rulings_found = sum(len(v) for v in WV.rulings.values())

    elapsed = time.time() - t0
    stats.phase_times["fetch_rulings"] = elapsed
    logger.info("Phase 3 complete: %d rulings in %.1fs", stats.rulings_found, elapsed)


# ═══════════════════════════════════════════════════════════════════════════
# Phase 4 — Diff-merge scraped cards into existing JSON
# ═══════════════════════════════════════════════════════════════════════════

def merge_cards(stats: PipelineStats) -> None:
    """
    Merge newly scraped cards into the existing DigimonCards.json.

    - New cards (not in existing) → add
    - Changed cards (content hash differs) → update
    - Unchanged cards → keep as-is
    - Cards in existing but NOT scraped this run → keep (prevents data loss)
    """
    logger.info("═══ Phase 4: Diff-merge cards ═══")
    t0 = time.time()

    existing = _load_existing_cards()
    logger.info("Loaded %d existing cards for comparison", len(existing))

    # Convert scraped cards to plain dicts
    scraped_dicts: Dict[str, dict] = {}
    for card_obj in WV.cards:
        card_dict = WF.class_to_dict(card_obj)
        card_dict = WF.remove_underscores(card_dict)
        card_id = card_dict.get("id", "")
        if card_id:
            scraped_dicts[card_id] = card_dict

    logger.info("Scraped %d cards this run", len(scraped_dicts))

    # Build merged result
    merged: Dict[str, dict] = {}

    # First: keep all existing cards that were NOT scraped (prevents data loss)
    for card_id, card in existing.items():
        if card_id not in scraped_dicts:
            merged[card_id] = card
            stats.cards_kept += 1

    # Second: process all scraped cards
    for card_id, scraped_card in scraped_dicts.items():
        old_card = existing.get(card_id)
        if old_card is None:
            # New card
            merged[card_id] = scraped_card
            stats.cards_new += 1
            logger.debug("NEW: %s", card_id)
        else:
            old_hash = _card_content_hash(old_card)
            new_hash = _card_content_hash(scraped_card)
            if old_hash != new_hash:
                # Card data changed — use freshly scraped version
                merged[card_id] = scraped_card
                stats.cards_updated += 1
                logger.debug("UPDATED: %s", card_id)
            else:
                # Unchanged — keep existing (preserves any manual edits, stable AAs, etc.)
                merged[card_id] = old_card
                stats.cards_unchanged += 1

    # Sort by id and save
    merged_list = sorted(merged.values(), key=lambda c: c.get("id", ""))

    with open(CARDS_JSON, "w", encoding="utf-8") as f:
        json.dump(merged_list, f, indent=2, sort_keys=WF.sort_key)

    # Reload into WV.cards so downstream phases work correctly
    WF.loadCards()

    elapsed = time.time() - t0
    stats.phase_times["merge_cards"] = elapsed
    logger.info(
        "Phase 4 complete in %.1fs: %d new, %d updated, %d unchanged, %d kept (not scraped)",
        elapsed, stats.cards_new, stats.cards_updated, stats.cards_unchanged, stats.cards_kept,
    )


# ═══════════════════════════════════════════════════════════════════════════
# Phase 5 — Fetch images
# ═══════════════════════════════════════════════════════════════════════════

def fetch_images(stats: PipelineStats) -> None:
    """Download card images from gallery pages."""
    logger.info("═══ Phase 5: Fetch images ═══")
    t0 = time.time()

    GetCardImages.getCardImages()

    WF.setNotes()
    WF.saveCards()

    stats.images_downloaded = GetCardImages.download_stats.get("downloaded", 0)
    stats.images_skipped = GetCardImages.download_stats.get("skipped", 0)

    elapsed = time.time() - t0
    stats.phase_times["fetch_images"] = elapsed
    logger.info(
        "Phase 5 complete in %.1fs: %d downloaded, %d skipped",
        elapsed, stats.images_downloaded, stats.images_skipped,
    )


# ═══════════════════════════════════════════════════════════════════════════
# Phase 6 — Format cards
# ═══════════════════════════════════════════════════════════════════════════

def format_cards(stats: PipelineStats) -> None:
    """Apply string replacements, remove keyword explanations, clean whitespace."""
    logger.info("═══ Phase 6: Format cards ═══")
    t0 = time.time()

    FormatCards.replaceStrings()

    for replacement in WV.replacements:
        FormatCards.replace_string_in_json(replacement, "")

    # Collapse multiple spaces
    for _ in range(3):
        FormatCards.replace_string_in_json("    ", " ")
        FormatCards.replace_string_in_json("   ", " ")
        FormatCards.replace_string_in_json("  ", " ")
    FormatCards.replace_string_in_json(" .", ".")

    FormatCards.removeSamples()

    elapsed = time.time() - t0
    stats.phase_times["format_cards"] = elapsed
    logger.info("Phase 6 complete in %.1fs", elapsed)


# ═══════════════════════════════════════════════════════════════════════════
# Phase 7 — Prepare output + cleanup
# ═══════════════════════════════════════════════════════════════════════════

def prepare_output(stats: PipelineStats) -> None:
    """Convert PNG→WebP, build ENG/JAP JSONs, move files to assets, cleanup."""
    logger.info("═══ Phase 7: Prepare output & cleanup ═══")
    t0 = time.time()

    logger.info("Converting PNG → WebP")
    TransformPNG.pngToWebP()

    logger.info("Preparing ENG/JAP card JSONs")
    PrepareCards.prepareCards()

    logger.info("Moving files to asset directories")
    MoveFiles.moveFiles()

    logger.info("Cleaning up temporary PNGs")
    DeletePNGs.deletePNGs()

    elapsed = time.time() - t0
    stats.phase_times["prepare_output"] = elapsed
    logger.info("Phase 7 complete in %.1fs", elapsed)


# ═══════════════════════════════════════════════════════════════════════════
# Pipeline orchestrator
# ═══════════════════════════════════════════════════════════════════════════

# Phase registry — order matters
PHASES = [
    ("fetch_links", fetch_links),
    ("scrape_cards", scrape_cards),
    ("fetch_rulings", fetch_rulings),
    ("merge_cards", merge_cards),
    ("fetch_images", fetch_images),
    ("format_cards", format_cards),
    ("prepare_output", prepare_output),
]

PHASE_NAMES = [name for name, _ in PHASES]


def run_pipeline(
    only: Optional[str] = None,
    skip: Optional[Set[str]] = None,
) -> PipelineStats:
    """
    Execute the card data pipeline.

    Args:
        only: If set, run only this single phase (for debugging).
        skip: Set of phase names to skip.
    """
    stats = PipelineStats()
    skip = skip or set()
    total_start = time.time()

    logger.info("Starting Digimon Card Wiki Data Extraction")
    logger.info("=" * 60)

    for phase_name, phase_fn in PHASES:
        if only and phase_name != only:
            continue
        if phase_name in skip:
            logger.info("SKIPPING phase: %s", phase_name)
            continue

        try:
            phase_fn(stats)
        except Exception:
            logger.exception("Phase '%s' FAILED — continuing with next phase", phase_name)

    total_time = time.time() - total_start

    # Summary
    logger.info("=" * 60)
    logger.info("Pipeline complete in %.1fs (%.1f minutes)", total_time, total_time / 60)
    logger.info("  Links found:     %d", stats.links_found)
    logger.info("  Cards scraped:   %d", stats.cards_scraped)
    logger.info("  Rulings found:   %d", stats.rulings_found)
    logger.info("  Cards new:       %d", stats.cards_new)
    logger.info("  Cards updated:   %d", stats.cards_updated)
    logger.info("  Cards unchanged: %d", stats.cards_unchanged)
    logger.info("  Cards kept:      %d (not scraped this run)", stats.cards_kept)
    logger.info("  Images:          %d downloaded, %d skipped", stats.images_downloaded, stats.images_skipped)
    for name, elapsed in stats.phase_times.items():
        logger.info("  Phase %-16s %.1fs", name, elapsed)
    logger.info("=" * 60)

    return stats


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Digimon Card Wiki Data Extraction Pipeline")
    parser.add_argument(
        "--phase",
        choices=PHASE_NAMES,
        help="Run only a single phase (for debugging)",
    )
    parser.add_argument(
        "--skip",
        nargs="*",
        choices=PHASE_NAMES,
        default=[],
        help="Skip one or more phases",
    )
    args = parser.parse_args()

    run_pipeline(only=args.phase, skip=set(args.skip))


if __name__ == "__main__":
    main()
