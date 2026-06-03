"""
GetDataFromWikiSingle.py - Fetch card data for a single set from the wiki.

Usage:
    python GetDataFromWikiSingle.py EX-12
    python GetDataFromWikiSingle.py BT-25
    python GetDataFromWikiSingle.py ST-24

This script runs the full pipeline (links → data → images → format → prepare → move)
for only the specified set, then merges the results into the existing shared JSON files.
Cards from other sets remain untouched.
"""

import sys
import time
import json
import re

import TransformPNG
import MoveFiles
import DeletePNGs
import FormatCards
import GetCardData
import GetCardImages
import GetLinks
import PrepareCards

import WikiVariables
import WikiFunctions


def find_set_entry(set_code):
    """
    Find the matching wikiPageLinks entry for a given set code (e.g. 'EX-12').
    Searches for '[EX-12]' or '[EX12]' patterns in the entry names.
    """
    # Normalize: try both with and without hyphen in brackets
    patterns = [
        f'[{set_code}]',
        f'[{set_code.replace("-", "")}]',
    ]

    for entry in WikiVariables.wikiPageLinks:
        name = entry['name']
        for pattern in patterns:
            if pattern.upper() in name.upper():
                return entry

    return None


def get_card_id_prefix(set_code):
    """
    Derive the card ID prefix from a set code.
    E.g. 'EX-12' → 'EX12-', 'BT-25' → 'BT25-', 'ST-24' → 'ST24-'
    Special cases like 'BT01-03' → 'BT01-03' (kept as-is with trailing hyphen not added).
    """
    # Remove the hyphen to get the card prefix (EX-12 → EX12)
    prefix = set_code.replace("-", "")
    return prefix


def merge_cards_into_existing(new_cards_json_path, card_prefix):
    """
    Merge newly fetched cards into the existing DigimonCards.json.
    Removes old entries matching the card prefix, adds new ones.
    """
    with open(new_cards_json_path, 'r') as f:
        new_cards = json.load(f)

    # Load existing cards from the assets (the "live" data)
    existing_path = './src/assets/cardlists/DigimonCards.json'
    try:
        with open(existing_path, 'r') as f:
            existing_cards = json.load(f)
    except FileNotFoundError:
        print(f"⚠️  No existing file at {existing_path}, using new cards only.")
        existing_cards = []

    # Remove old cards with the same prefix from existing data
    prefix_upper = card_prefix.upper()
    filtered = [c for c in existing_cards if not c.get('id', '').upper().startswith(prefix_upper)]

    removed_count = len(existing_cards) - len(filtered)
    print(f"  Removed {removed_count} old cards with prefix '{card_prefix}'")

    # Add new cards
    filtered.extend(new_cards)
    print(f"  Added {len(new_cards)} new/updated cards")

    # Sort by id
    filtered.sort(key=lambda c: c.get('id', ''))

    # Write back to the working json (which will be moved by MoveFiles)
    with open(new_cards_json_path, 'w') as f:
        json.dump(filtered, f, indent=2)

    print(f"  Total cards in file: {len(filtered)}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python GetDataFromWikiSingle.py <SET_CODE>")
        print("Example: python GetDataFromWikiSingle.py EX-12")
        sys.exit(1)

    set_code = sys.argv[1].strip()
    print(f"🃏 Single-Set Digimon Card Wiki Data Extraction: {set_code}")
    print("=" * 60)

    # Find the matching set entry
    entry = find_set_entry(set_code)
    if entry is None:
        print(f"❌ Could not find set '{set_code}' in wikiPageLinks.")
        print("Available sets:")
        for e in WikiVariables.wikiPageLinks:
            # Extract bracket code from name
            match = re.search(r'\[([^\]]+)\]', e['name'])
            if match:
                print(f"  {match.group(1)}")
        sys.exit(1)

    card_prefix = get_card_id_prefix(set_code)
    print(f"📋 Set: {entry['name']}")
    print(f"🔗 URL: {entry['url']}")
    print(f"🏷️  Card prefix: {card_prefix}")
    print()

    total_start_time = time.time()

    # === GetLinks ===
    print('🔗 Fetching card links...')
    start_time = time.time()

    GetLinks.getLinks(entry)

    # No promo links - only the specified set
    WikiVariables.cardLinks = sorted(list(set(WikiVariables.cardLinks)))
    WikiVariables.cardCount = len(WikiVariables.cardLinks)

    link_time = time.time() - start_time
    print(f'✅ Found {WikiVariables.cardCount} cards in {link_time:.1f}s')

    if WikiVariables.cardCount == 0:
        print(f"❌ No cards found for set '{set_code}'. The wiki page may not have card data yet.")
        sys.exit(1)

    # === GetCardData ===
    print(f'\n📊 Processing {WikiVariables.cardCount} cards...')
    card_start_time = time.time()

    GetCardData.getCardData()

    card_time = time.time() - card_start_time
    print(f'✅ Processed {len(WikiVariables.cards)} cards in {card_time:.1f}s')

    # === Get Rulings ===
    print('\n📜 Getting card rulings...')
    WikiFunctions.getRulings()

    # === Save Cards (initial save of just the new set's cards) ===
    print('\n💾 Saving cards...')
    WikiFunctions.saveCards()

    # === GetCardImages ===
    print('\n🖼️  Fetching card images...')
    image_start_time = time.time()

    GetCardImages.getCardImages()
    WikiFunctions.setNotes()
    WikiFunctions.saveCards()

    image_time = time.time() - image_start_time
    print(f'✅ Image processing completed in {image_time:.1f}s')

    # === FormatCards ===
    print('\n🔧 Formatting card data...')
    format_start_time = time.time()

    FormatCards.replaceStrings()

    for replacement in WikiVariables.replacements:
        FormatCards.replace_string_in_json(replacement, '')

    FormatCards.replace_string_in_json('    ', ' ')
    FormatCards.replace_string_in_json('   ', ' ')
    FormatCards.replace_string_in_json('   ', ' ')
    FormatCards.replace_string_in_json('  ', ' ')
    FormatCards.replace_string_in_json(' .', '.')

    FormatCards.removeSamples()

    format_time = time.time() - format_start_time
    print(f'✅ Formatting completed in {format_time:.1f}s')

    # === Merge into existing data ===
    print('\n🔀 Merging with existing card data...')
    merge_cards_into_existing('./scripts/python/Wiki/jsons/DigimonCards.json', card_prefix)

    # === TransformPNG ===
    print('\n🖼️  Converting PNGs to WebP...')
    TransformPNG.pngToWebP()

    # === Move images first so PrepareCards can find them in src/assets ===
    print('\n🧹 Moving files...')
    MoveFiles.moveFiles()

    # === PrepareCards (needs images in src/assets to detect Sample variants) ===
    print('\n📦 Preparing card lists...')
    PrepareCards.prepareCards()

    # === Move the prepared JSONs (PrepareCards wrote new ones) and cleanup ===
    MoveFiles.moveFiles()
    DeletePNGs.deletePNGs()

    total_time = time.time() - total_start_time
    print(f'\n🎉 Done! Set {set_code} updated successfully in {total_time:.1f}s')
    print("=" * 60)


if __name__ == '__main__':
    main()
