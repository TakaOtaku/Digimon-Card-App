"""
UpdateUserDecks — Phased pipeline for syncing user-embedded decks to the decks collection.

Phases (each is an independent, testable function):
  1. fetch_users()      — Pull all users from the API
  2. extract_decks()    — Parse & validate embedded decks, enrich with tags/owner info
  3. deduplicate()      — Remove duplicate decks (by card composition)
  4. fetch_remote()     — Pull existing deck state from the API for diffing
  5. diff()             — Compare local vs remote, decide what to create/update/skip
  6. sync()             — Push only changed decks to the API

Run the full pipeline with:  python UpdateUserDecks.py
Run a single phase for debugging:  python -c "from UpdateUserDecks import *; print(len(fetch_users()))"
"""

import hashlib
import logging
import json
import sys
from dataclasses import dataclass, field
from typing import Dict, FrozenSet, List, Optional, Tuple

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# HTTP session with automatic retries
# ---------------------------------------------------------------------------

def _create_session() -> requests.Session:
    session = requests.Session()
    retry = Retry(
        total=5,
        backoff_factor=1.5,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET", "PUT", "POST", "DELETE"],
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    session.headers.update({
        "User-Agent": "DigimonCardApp-UpdateDecks/1.0",
        "Content-Type": "application/json",
    })
    return session

http = _create_session()

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BACKEND_URL = "http://digimoncardapp.backend.takaotaku.de/api/"
MONGO_BACKEND_URL = "http://localhost:3001/api/"
MONGO_MIGRATION_URL = "http://localhost:3001/api/migration/"
USERS_API = BACKEND_URL + "users"
DECKS_API = MONGO_BACKEND_URL + "decks"

RELEASE_ORDER = [
    'EX12', 'BT25', 'ST24', 'ST23', 'AD1', 'EX11', 'BT24', 'BT23', 'EX10',
    'BT22', 'EX09', 'EX9', 'BT21', 'ST21', 'ST20', 'BT20', 'BT19', 'BT18',
    'EX08', 'EX8', 'EX07', 'EX7', 'ST19', 'ST18', 'BT17', 'EX06', 'EX6',
    'BT16', 'ST17', 'BT15', 'EX05', 'EX5', 'BT14', 'ST16', 'ST15', 'RB1',
    'BT13', 'EX4', 'BT12', 'ST14', 'BT11', 'EX3', 'BT10', 'ST13', 'ST12',
    'BT9', 'EX2', 'BT8', 'ST10', 'ST9', 'BT7', 'EX1', 'BT6', 'ST8', 'ST7',
    'BT5', 'BT4', 'ST6', 'ST5', 'ST4', 'BT3', 'BT2', 'BT1', 'ST3', 'ST2', 'ST1',
]

RESTRICTED_CARDS = frozenset([
    'ST2-13',
    'BT2-047', 'BT2-069', 'BT3-054', 'BT3-103', 'BT6-100',
    'BT7-038', 'BT7-064', 'BT7-069', 'BT7-072', 'BT7-107',
    'BT9-098', 'BT9-099', 'BT10-009', 'BT11-064', 'BT13-012',
    'BT14-002', 'BT14-084', 'BT15-057', 'BT15-102',
    'EX1-068', 'EX2-039', 'EX4-019', 'EX5-015', 'EX5-018', 'EX5-062',
    'P-008', 'P-025', 'P-123', 'P-130',
])

BANNED_CARDS = frozenset(['BT5-109'])

CARDS_UNLIMITED_COUNT = frozenset([
    'BT6-085', 'BT11-061', 'EX2-046', 'BT22-079', 'EX9-048', 'EX11-027',
])

# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------

@dataclass
class SyncStats:
    """Accumulates results across all pipeline phases."""
    users_fetched: int = 0
    decks_extracted: int = 0
    decks_invalid: int = 0
    decks_after_dedup: int = 0
    remote_decks_fetched: int = 0
    created: int = 0
    updated: int = 0
    skipped: int = 0
    failed: int = 0

# ---------------------------------------------------------------------------
# Helper functions (pure, no side-effects)
# ---------------------------------------------------------------------------

def _set_newest_set(cards: List[Dict]) -> Dict:
    for release in RELEASE_ORDER:
        for card in cards:
            if release in card['id']:
                return {'name': release, 'color': 'Primary'}
    return {'name': 'Unknown', 'color': 'Primary'}


def _has_banned_cards(cards: List[Dict]) -> bool:
    return any(card['id'] in BANNED_CARDS for card in cards)


def _has_too_many_restricted(cards: List[Dict]) -> bool:
    return any(
        card['id'] in RESTRICTED_CARDS and card['count'] > 1
        for card in cards
    )


def compute_tags(deck: Dict) -> List[Dict]:
    """Compute tags for a deck based on its cards."""
    tags = [_set_newest_set(deck['cards'])]
    if _has_banned_cards(deck['cards']):
        tags.append({'name': 'Illegal', 'color': 'Primary'})
    if _has_too_many_restricted(deck['cards']):
        if not any(t['name'] == 'Illegal' for t in tags):
            tags.append({'name': 'Illegal', 'color': 'Primary'})
    return tags


def compute_image_card_id(deck: Dict) -> str:
    """
    Pick the highest-level Digimon card as the deck image.
    Mirrors the frontend setDeckImage() logic.
    Falls back to the first card ID if no Digimon-type cards are found.
    """
    cards = deck.get('cards', [])
    if not cards:
        return 'BT1-001'

    # We don't have card type info in the deck data, so use a heuristic:
    # Digimon cards have IDs like BT1-001 through BT1-060ish (lower numbers).
    # The best proxy without full card DB: pick the card whose ID appears
    # in the most sets from release order (newest set, highest number).
    # Simple approach: just use the first card from the newest set.
    for release in RELEASE_ORDER:
        set_cards = [c for c in cards if release in c['id']]
        if set_cards:
            # Sort by card number descending to get higher-level cards
            set_cards.sort(key=lambda c: c['id'], reverse=True)
            return set_cards[0]['id']

    return cards[0]['id'] if cards else 'BT1-001'


def is_deck_valid(deck: Dict) -> bool:
    """Check structural validity: has cards/title/date, 50-55 total, max 4 per card."""
    if not deck.get('cards') or not deck.get('title') or not deck.get('date'):
        return False

    total = 0
    for card in deck['cards']:
        total += card['count']
        if card['count'] > 4 and card['id'] not in CARDS_UNLIMITED_COUNT \
                and not any(card['id'].startswith(x) for x in CARDS_UNLIMITED_COUNT):
            return False
    return 50 <= total <= 55


def cards_signature(cards: List[Dict]) -> FrozenSet[Tuple[str, int]]:
    """AA-normalised, order-independent fingerprint for deduplication."""
    return frozenset(
        (c['id'].split('_P')[0] if '_P' in c['id'] else c['id'], c['count'])
        for c in cards
    )


def deck_content_hash(deck: Dict) -> str:
    """
    Stable hash of the fields that matter for change-detection.
    If this hash matches the remote deck, there's nothing to update.
    """
    relevant = {
        'cards': sorted(
            [{'id': c['id'], 'count': c['count']} for c in (deck.get('cards') or [])],
            key=lambda c: c['id'],
        ),
        'sideDeck': sorted(
            [{'id': c['id'], 'count': c['count']} for c in (deck.get('sideDeck') or [])],
            key=lambda c: c['id'],
        ),
        'tags': sorted(
            [{'name': t['name'], 'color': t['color']} for t in (deck.get('tags') or [])],
            key=lambda t: t['name'],
        ),
        'title': deck.get('title', ''),
        'color': deck.get('color', {}),
        'user': deck.get('user', ''),
    }
    return hashlib.sha256(json.dumps(relevant, sort_keys=True).encode()).hexdigest()


def _fetch_paginated(base_url: str, item_key: str, limit: int = 500) -> List[Dict]:
    """Generic paginated fetch — works with both list and paginated responses."""
    all_items: List[Dict] = []
    page = 1

    while True:
        url = f"{base_url}?page={page}&limit={limit}"
        logger.info("Fetching %s page %d...", item_key, page)
        response = http.get(url, timeout=30)
        response.raise_for_status()
        data = response.json()

        if isinstance(data, list):
            all_items.extend(data)
            break
        elif item_key in data and isinstance(data[item_key], list):
            items = data[item_key]
            all_items.extend(items)
            pagination = data.get('pagination', {})
            total_pages = pagination.get('totalPages', 1)
            logger.info("  Got %d %s (page %d/%d)", len(items), item_key, page, total_pages)
            if page >= total_pages:
                break
            page += 1
        else:
            logger.warning("Unknown response format for %s", item_key)
            break

    logger.info("Total %s fetched: %d", item_key, len(all_items))
    return all_items


# ═══════════════════════════════════════════════════════════════════════════
# Phase 1 — Fetch users
# ═══════════════════════════════════════════════════════════════════════════

def fetch_users() -> List[Dict]:
    """Phase 1: Pull all users from the API."""
    logger.info("── Phase 1: Fetch users ──")
    users = _fetch_paginated(USERS_API, 'users', limit=1000)
    logger.info("Fetched %d users", len(users))
    return users


# ═══════════════════════════════════════════════════════════════════════════
# Phase 2 — Extract & validate decks from user data
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class ExtractionResult:
    valid_decks: List[Dict] = field(default_factory=list)
    invalid_decks: List[Dict] = field(default_factory=list)


def extract_decks(users: List[Dict]) -> ExtractionResult:
    """
    Phase 2: Parse embedded deck JSON, validate, enrich with tags & owner info.

    Returns an ExtractionResult with valid and invalid decks separated.
    """
    logger.info("── Phase 2: Extract & validate decks ──")
    result = ExtractionResult()

    for user in users:
        raw = user.get('decks', '[]')
        decks = json.loads(raw) if isinstance(raw, str) else (raw or [])
        uid = user.get('uid', '')
        name = user.get('displayName', '')
        photo = user.get('photoURL', user.get('photoUrl', ''))

        logger.info("User %s (%s): %d decks", name, uid, len(decks))

        if len(decks) > 100:
            logger.warning("User %s has %d decks — skipping", name, len(decks))
            continue

        for deck in decks:
            if not is_deck_valid(deck):
                result.invalid_decks.append(deck)
                continue

            deck['tags'] = compute_tags(deck)
            deck['userId'] = uid
            deck['user'] = name
            deck['photoUrl'] = photo

            # Set imageCardId if missing or default
            if not deck.get('imageCardId') or deck['imageCardId'] == 'BT1-001':
                deck['imageCardId'] = compute_image_card_id(deck)

            result.valid_decks.append(deck)

    logger.info(
        "Extracted %d valid decks, %d invalid",
        len(result.valid_decks), len(result.invalid_decks),
    )
    return result


# ═══════════════════════════════════════════════════════════════════════════
# Phase 3 — Deduplicate
# ═══════════════════════════════════════════════════════════════════════════

def deduplicate(decks: List[Dict]) -> List[Dict]:
    """
    Phase 3: Remove duplicate decks (same card composition).
    Keeps the oldest deck for each unique card signature.
    """
    logger.info("── Phase 3: Deduplicate ──")
    seen: Dict[FrozenSet, Dict] = {}

    for deck in decks:
        sig = cards_signature(deck['cards'])
        if sig not in seen:
            seen[sig] = deck
        else:
            existing = seen[sig]
            if deck['date'] < existing['date']:
                logger.debug("Replacing '%s' with older duplicate '%s'", existing['title'], deck['title'])
                seen[sig] = deck
            else:
                logger.debug("Dropping duplicate '%s' (keeping '%s')", deck['title'], existing['title'])

    unique = list(seen.values())
    logger.info("%d unique decks (removed %d duplicates)", len(unique), len(decks) - len(unique))
    return unique


# ═══════════════════════════════════════════════════════════════════════════
# Phase 4 — Fetch existing deck state from DB
# ═══════════════════════════════════════════════════════════════════════════

def fetch_remote_decks() -> Dict[str, Dict]:
    """
    Phase 4: Fetch all decks currently stored in the database.
    Returns a dict keyed by deck ID for O(1) lookup.
    """
    logger.info("── Phase 4: Fetch remote deck state ──")
    remote_list = _fetch_paginated(DECKS_API, 'decks', limit=500)
    remote_map = {d.get('id', d.get('_id', '')): d for d in remote_list}
    logger.info("Fetched %d remote decks for comparison", len(remote_map))
    return remote_map


# ═══════════════════════════════════════════════════════════════════════════
# Phase 5 — Diff: decide what needs to be created / updated / skipped
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class DiffResult:
    to_create: List[Dict] = field(default_factory=list)
    to_update: List[Dict] = field(default_factory=list)
    unchanged: List[str] = field(default_factory=list)


def diff(local_decks: List[Dict], remote_decks: Dict[str, Dict]) -> DiffResult:
    """
    Phase 5: Compare local (from users) vs remote (from DB).

    - New decks (ID not in remote) → create
    - Changed decks (content hash differs) → update
    - Unchanged decks → skip

    Decks that exist remotely but NOT locally are left untouched —
    this prevents data loss when fewer users/decks are returned in a run.
    """
    logger.info("── Phase 5: Diff local vs remote ──")
    result = DiffResult()

    for deck in local_decks:
        deck_id = deck.get('id', '')
        if not deck_id:
            continue

        remote = remote_decks.get(deck_id)
        if remote is None:
            result.to_create.append(deck)
        else:
            local_hash = deck_content_hash(deck)
            remote_hash = deck_content_hash(remote)
            if local_hash != remote_hash:
                result.to_update.append(deck)
            else:
                result.unchanged.append(deck_id)

    logger.info(
        "Diff result: %d to create, %d to update, %d unchanged",
        len(result.to_create), len(result.to_update), len(result.unchanged),
    )
    return result


# ═══════════════════════════════════════════════════════════════════════════
# Phase 6 — Sync: push changes to API
# ═══════════════════════════════════════════════════════════════════════════

def sync(diff_result: DiffResult, stats: SyncStats) -> None:
    """
    Phase 6: Push only new and changed decks to the API using bulk requests.
    Unchanged decks + remote-only decks are left untouched.
    """
    logger.info("── Phase 6: Sync to database ──")

    all_to_push = diff_result.to_create + diff_result.to_update
    stats.skipped = len(diff_result.unchanged)

    if not all_to_push:
        logger.info("Nothing to sync — all decks are up to date")
        return

    BATCH_SIZE = 500
    for i in range(0, len(all_to_push), BATCH_SIZE):
        batch = all_to_push[i:i + BATCH_SIZE]
        batch_num = (i // BATCH_SIZE) + 1
        total_batches = (len(all_to_push) + BATCH_SIZE - 1) // BATCH_SIZE

        logger.info("Sending batch %d/%d (%d decks)...", batch_num, total_batches, len(batch))
        try:
            url = f"{MONGO_MIGRATION_URL}decks/bulk"
            response = http.post(url, json=batch, timeout=120)
            response.raise_for_status()
            result = response.json()
            upserted = result.get('upserted', 0)
            modified = result.get('modified', 0)
            stats.created += upserted
            stats.updated += modified
            logger.info("  Batch %d: %d upserted, %d modified", batch_num, upserted, modified)
        except requests.RequestException as exc:
            stats.failed += len(batch)
            logger.error("  Batch %d failed: %s", batch_num, exc)


# ═══════════════════════════════════════════════════════════════════════════
# Pipeline orchestrator
# ═══════════════════════════════════════════════════════════════════════════

def run_pipeline() -> SyncStats:
    """Execute all phases in order and return aggregated stats."""
    stats = SyncStats()

    logger.info("═══ Starting deck sync pipeline ═══")

    # Phase 1
    users = fetch_users()
    stats.users_fetched = len(users)

    # Phase 2
    extraction = extract_decks(users)
    stats.decks_extracted = len(extraction.valid_decks)
    stats.decks_invalid = len(extraction.invalid_decks)

    # Phase 3
    unique_decks = deduplicate(extraction.valid_decks)
    stats.decks_after_dedup = len(unique_decks)

    # Phase 4
    remote_decks = fetch_remote_decks()
    stats.remote_decks_fetched = len(remote_decks)

    # Phase 5
    diff_result = diff(unique_decks, remote_decks)

    # Phase 6
    sync(diff_result, stats)

    logger.info("═══ Pipeline complete ═══")
    logger.info(
        "  Users: %d | Extracted: %d | Invalid: %d | After dedup: %d",
        stats.users_fetched, stats.decks_extracted, stats.decks_invalid, stats.decks_after_dedup,
    )
    logger.info(
        "  Remote: %d | Created: %d | Updated: %d | Skipped: %d | Failed: %d",
        stats.remote_decks_fetched, stats.created, stats.updated, stats.skipped, stats.failed,
    )
    return stats


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    run_pipeline()
