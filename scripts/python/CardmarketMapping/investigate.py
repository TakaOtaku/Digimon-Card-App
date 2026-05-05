"""Investigate the expansion structure for NA vs AA mapping."""
import json
import re
from collections import defaultdict

with open('src/assets/cardmarket/products_singles_17.json', 'r', encoding='utf-8') as f:
    products_data = json.load(f)
products = products_data.get('products', [])

CARD_NUM_RE = re.compile(r'\(([A-Z0-9]+-\d+[a-z]?)\)\s*$')
products_by_card_num = defaultdict(list)
for p in products:
    m = CARD_NUM_RE.search(p['name'])
    if m:
        products_by_card_num[m.group(1)].append(p)

# Compare cards
print('=== BT8-001 (common card) ===')
for p in sorted(products_by_card_num.get('BT8-001', []), key=lambda x: x['idProduct']):
    print(f"  id={p['idProduct']}, exp={p['idExpansion']}, date={p['dateAdded']}")

print()
print('=== BT8-112 (secret rare with expensive AA) ===')
for p in sorted(products_by_card_num.get('BT8-112', []), key=lambda x: x['idProduct']):
    print(f"  id={p['idProduct']}, exp={p['idExpansion']}, date={p['dateAdded']}")

print()
print('=== BT8-050 (mid card with AA) ===')
for p in sorted(products_by_card_num.get('BT8-050', []), key=lambda x: x['idProduct']):
    print(f"  id={p['idProduct']}, exp={p['idExpansion']}, date={p['dateAdded']}")

# Check which card numbers are in exp 5050
exp_5050_cards = [p for p in products if p['idExpansion'] == 5050]
print(f'\nCards in exp 5050: {len(exp_5050_cards)}')
exp_5050_nums = set()
for p in exp_5050_cards:
    m = CARD_NUM_RE.search(p['name'])
    if m:
        exp_5050_nums.add(m.group(1))
print(f'Unique card numbers in 5050: {len(exp_5050_nums)}')
print('Sample:', sorted(list(exp_5050_nums))[:15])

# Also check expansion 5011
exp_5011_cards = [p for p in products if p['idExpansion'] == 5011]
print(f'\nCards in exp 5011: {len(exp_5011_cards)}')
exp_5011_nums = set()
for p in exp_5011_cards:
    m = CARD_NUM_RE.search(p['name'])
    if m:
        exp_5011_nums.add(m.group(1))
print(f'Unique card numbers in 5011: {len(exp_5011_nums)}')
prefixes = defaultdict(int)
for cn in exp_5011_nums:
    prefix = re.match(r'([A-Za-z]+\d*)', cn).group(1)
    prefixes[prefix] += 1
print('Prefix distribution in 5011:', dict(prefixes))
