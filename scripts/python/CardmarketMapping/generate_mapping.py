"""
Generate a mapping from Cardmarket idProduct to exact app card IDs.

This script:
1. Loads products_singles_17.json (Cardmarket products)
2. Loads PreparedDigimonCardsENG.json (app card data)
3. Optionally loads cardmarket-id-overrides.json (manual corrections)
4. Groups products by card number, sorts chronologically by idProduct
5. Assigns: 1st product → base ID, 2nd → _P1, 3rd → _P2, etc.
6. Outputs cardmarket-id-map.json (idProduct → cardId mapping)
7. Outputs a mismatch report for manual review

Usage:
    python generate_mapping.py
"""

import json
import os
import re
from collections import defaultdict

# Paths relative to repo root
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
PRODUCTS_PATH = os.path.join(REPO_ROOT, 'src', 'assets', 'cardmarket', 'products_singles_17.json')
PRICE_GUIDE_PATH = os.path.join(REPO_ROOT, 'src', 'assets', 'cardmarket', 'price_guide_17.json')
CARDS_PATH = os.path.join(REPO_ROOT, 'src', 'assets', 'cardlists', 'PreparedDigimonCardsENG.json')
OVERRIDES_PATH = os.path.join(REPO_ROOT, 'src', 'assets', 'cardmarket', 'cardmarket-id-overrides.json')
OUTPUT_PATH = os.path.join(REPO_ROOT, 'src', 'assets', 'cardmarket', 'cardmarket-id-map.json')
REPORT_PATH = os.path.join(os.path.dirname(__file__), 'mapping_report.txt')

# Regex to extract card number from product name, e.g. "Agumon (BT1-010)" → "BT1-010"
CARD_NUMBER_REGEX = re.compile(r'\(([A-Z0-9]+-\d+[a-z]?)\)\s*$')


def load_json(path: str):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def get_app_card_ids(cards: list) -> dict:
    """
    Build a dict: cardNumber → list of full IDs sorted (base first, then _P1, _P2...)
    e.g. "BT1-010" → ["BT1-010", "BT1-010_P1", "BT1-010_P2", ...]
    """
    card_ids_by_number = defaultdict(list)
    for card in cards:
        card_id = card.get('id', '')
        card_number = card.get('cardNumber', '')
        if card_number and card_id:
            card_ids_by_number[card_number].append(card_id)

    # Sort each group: base first (no underscore), then _P1, _P2, etc.
    def sort_key(card_id: str):
        if '_' not in card_id:
            return (0, 0, '')
        # Extract P number from suffixes like _P1, _P2-J, _P1-Errata, etc.
        suffix = card_id.split('_', 1)[1]  # e.g. "P1", "P2-J", "P1-Errata"
        match = re.match(r'P(\d+)', suffix)
        if match:
            return (1, int(match.group(1)), suffix)
        return (2, 0, suffix)

    for card_number in card_ids_by_number:
        card_ids_by_number[card_number].sort(key=sort_key)

    return dict(card_ids_by_number)


def extract_card_number(product_name: str) -> str | None:
    """Extract the card number from a Cardmarket product name."""
    match = CARD_NUMBER_REGEX.search(product_name)
    return match.group(1) if match else None


def main():
    print("Loading products singles...")
    products_data = load_json(PRODUCTS_PATH)
    products = products_data.get('products', [])
    print(f"  Loaded {len(products)} products")

    print("Loading price guide...")
    price_data = load_json(PRICE_GUIDE_PATH)
    prices_by_id = {p['idProduct']: p.get('low') or 0 for p in price_data.get('priceGuides', [])}
    print(f"  Loaded {len(prices_by_id)} price entries")

    print("Loading app card data...")
    cards = load_json(CARDS_PATH)
    print(f"  Loaded {len(cards)} cards")

    # Build app card ID lookup
    app_ids_by_number = get_app_card_ids(cards)
    print(f"  Found {len(app_ids_by_number)} unique card numbers in app")

    # Load overrides if they exist
    overrides = {}
    if os.path.exists(OVERRIDES_PATH):
        print("Loading manual overrides...")
        overrides = load_json(OVERRIDES_PATH)
        print(f"  Loaded {len(overrides)} overrides")

    # Group products by card number
    products_by_card_number = defaultdict(list)
    unrecognized_products = []

    for product in products:
        card_number = extract_card_number(product['name'])
        if card_number:
            products_by_card_number[card_number].append(product)
        else:
            unrecognized_products.append(product)

    # Determine the "main" expansion for each set prefix (the one with the most products).
    # Products in the main expansion are normal arts; other expansions contain alt arts/promos.
    prefix_expansion_counts = defaultdict(lambda: defaultdict(int))
    for card_number, prods in products_by_card_number.items():
        prefix_match = re.match(r'([A-Za-z]+\d*)', card_number)
        prefix = prefix_match.group(1) if prefix_match else card_number
        for p in prods:
            prefix_expansion_counts[prefix][p['idExpansion']] += 1

    main_expansion_by_prefix = {}
    for prefix, exp_counts in prefix_expansion_counts.items():
        main_exp = max(exp_counts, key=exp_counts.get)
        main_expansion_by_prefix[prefix] = main_exp

    print(f"  Determined main expansions for {len(main_expansion_by_prefix)} set prefixes")

    # Sort each group by price ascending (cheapest = normal art / base card).
    # The cheapest product gets mapped to the base card ID, more expensive
    # ones map to _P1, _P2, etc. This is a simple heuristic that can be
    # corrected with manual overrides.
    for card_number in products_by_card_number:
        def sort_key_product(p):
            price = prices_by_id.get(p['idProduct'], 0)
            return (price, p['idProduct'])

        products_by_card_number[card_number].sort(key=sort_key_product)

    # Generate mapping
    mapping = {}  # idProduct (as string) → cardId
    unmapped_products = []  # Products with no matching app ID
    extra_cm_products = []  # Products beyond what the app has variants for
    missing_in_cm = []  # App card IDs with no Cardmarket match

    for card_number, product_group in products_by_card_number.items():
        app_ids = app_ids_by_number.get(card_number, [])

        if not app_ids:
            # Card number exists in Cardmarket but not in app
            for product in product_group:
                unmapped_products.append(product)
            continue

        for i, product in enumerate(product_group):
            id_product_str = str(product['idProduct'])

            # Check if this product has a manual override
            if id_product_str in overrides:
                override_value = overrides[id_product_str]
                if override_value is not None:
                    mapping[id_product_str] = override_value
                # If None, explicitly unmapped - skip
                continue

            if i < len(app_ids):
                mapping[id_product_str] = app_ids[i]
            else:
                # More Cardmarket products than app variants
                extra_cm_products.append({
                    'product': product,
                    'card_number': card_number,
                    'app_variant_count': len(app_ids),
                    'cm_position': i + 1
                })

    # Check for app IDs that have no Cardmarket mapping
    mapped_card_ids = set(mapping.values())
    for card_number, app_ids in app_ids_by_number.items():
        for app_id in app_ids:
            if app_id not in mapped_card_ids:
                missing_in_cm.append(app_id)

    # Apply any remaining overrides that weren't in product groups
    for id_product_str, card_id in overrides.items():
        if id_product_str not in mapping and card_id is not None:
            mapping[id_product_str] = card_id

    # Output the mapping
    print(f"\nWriting mapping to {OUTPUT_PATH}")
    print(f"  Total mapped: {len(mapping)}")
    print(f"  Unmapped (no app card): {len(unmapped_products)}")
    print(f"  Extra CM products (beyond app variants): {len(extra_cm_products)}")
    print(f"  App IDs missing from CM: {len(missing_in_cm)}")
    print(f"  Unrecognized product names: {len(unrecognized_products)}")

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, indent=2, sort_keys=True)

    # Write report
    print(f"Writing report to {REPORT_PATH}")
    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("CARDMARKET → APP CARD ID MAPPING REPORT\n")
        f.write("=" * 80 + "\n\n")

        f.write(f"Total products: {len(products)}\n")
        f.write(f"Total app cards: {len(cards)}\n")
        f.write(f"Unique card numbers in app: {len(app_ids_by_number)}\n")
        f.write(f"Successfully mapped: {len(mapping)}\n")
        f.write(f"Manual overrides applied: {len(overrides)}\n\n")

        f.write("-" * 80 + "\n")
        f.write(f"UNRECOGNIZED PRODUCT NAMES ({len(unrecognized_products)})\n")
        f.write("These products could not have a card number extracted from their name.\n")
        f.write("-" * 80 + "\n")
        for p in unrecognized_products[:50]:
            f.write(f"  idProduct={p['idProduct']}: {p['name']}\n")
        if len(unrecognized_products) > 50:
            f.write(f"  ... and {len(unrecognized_products) - 50} more\n")
        f.write("\n")

        f.write("-" * 80 + "\n")
        f.write(f"UNMAPPED PRODUCTS ({len(unmapped_products)})\n")
        f.write("Card number found in Cardmarket but not in app data.\n")
        f.write("-" * 80 + "\n")
        for p in unmapped_products[:50]:
            cn = extract_card_number(p['name'])
            f.write(f"  idProduct={p['idProduct']}: {p['name']} (card: {cn})\n")
        if len(unmapped_products) > 50:
            f.write(f"  ... and {len(unmapped_products) - 50} more\n")
        f.write("\n")

        f.write("-" * 80 + "\n")
        f.write(f"EXTRA CM PRODUCTS ({len(extra_cm_products)})\n")
        f.write("More Cardmarket products than app variants for a card number.\n")
        f.write("These need manual overrides or the app needs more _P variants.\n")
        f.write("-" * 80 + "\n")
        for item in extra_cm_products[:100]:
            p = item['product']
            f.write(f"  idProduct={p['idProduct']}: {p['name']} "
                    f"(exp={p['idExpansion']}, position #{item['cm_position']}, "
                    f"app has {item['app_variant_count']} variants)\n")
        if len(extra_cm_products) > 100:
            f.write(f"  ... and {len(extra_cm_products) - 100} more\n")
        f.write("\n")

        f.write("-" * 80 + "\n")
        f.write(f"APP IDS MISSING FROM CARDMARKET ({len(missing_in_cm)})\n")
        f.write("App card IDs that have no Cardmarket product mapped to them.\n")
        f.write("-" * 80 + "\n")
        for card_id in sorted(missing_in_cm)[:100]:
            f.write(f"  {card_id}\n")
        if len(missing_in_cm) > 100:
            f.write(f"  ... and {len(missing_in_cm) - 100} more\n")

    print("\nDone!")


if __name__ == '__main__':
    main()
