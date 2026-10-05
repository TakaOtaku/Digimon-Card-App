"""Check how to construct Cardmarket URLs from product data."""
import json

data = json.load(open('src/assets/cardmarket/products_singles_17.json', 'r', encoding='utf-8'))
products = data.get('products', [])

print('Keys in first product:', list(products[0].keys()))

# Cardmarket URL format: /en/Digimon/Products/Singles/{expansion-name}/{product-slug}
# product-slug is typically the product name turned into a URL slug
def make_slug(name):
    slug = name.replace('(', '').replace(')', '').strip()
    slug = slug.replace(' ', '-')
    slug = slug.replace('---', '-').replace('--', '-')
    return slug

print('\nSample product slugs:')
for p in products[:10]:
    slug = make_slug(p['name'])
    print(f"  {p['name']} -> {slug}")
    print(f"    idExpansion={p['idExpansion']}, idProduct={p['idProduct']}")

# Check some products with special characters
special = [p for p in products if any(c in p['name'] for c in ['&', "'", ':', '.'])][:5]
print('\nProducts with special chars:')
for p in special:
    print(f"  {p['name']}")
