import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd

listsOfCardIds = [
    'BT1-085_P1',
    'BT1-086_P1',
    'BT1-087_P1',
    'BT1-088_P1',
    'BT1-089_P1',
    'BT2-084_P1',
    'BT2-085_P1',
    'BT2-087_P1',
    'BT2-089_P1',
    'BT2-090_P1',
    'BT3-011_P1',
    'BT3-024_P1',
    'BT3-036_P1',
    'BT3-049_P1',
    'BT3-065_P1',
    'BT3-082_P1',
    'BT4-092_P1',
    'BT4-093_P1',
    'BT4-094_P1',
    'BT4-095_P1',
    'BT4-096_P1',
    'BT4-097_P1',
    'BT5-088_P1',
    'BT5-089_P1',
    'BT5-090_P1',
    'BT5-091_P1',
    'BT5-092_P1',
    'BT5-093_P1',
    'BT6-001_P1',
    'BT6-002_P1',
    'BT6-003_P1',
    'BT6-004_P1',
    'BT6-005_P1',
    'BT6-006_P1',
    'BT7-085_P1',
    'BT7-086_P1',
    'BT7-087_P1',
    'BT7-088_P1',
    'BT7-089_P1',
    'BT7-091_P1',
    'BT8-085_P1',
    'BT8-087_P1',
    'BT8-088_P1',
    'BT8-089_P1',
    'BT8-090_P1',
    'BT8-091_P1',
    'BT9-001_P1',
    'BT9-002_P1',
    'BT9-003_P1',
    'BT9-004_P1',
    'BT9-005_P1',
    'BT9-006_P1',
    'BT10-087_P1',
    'BT10-088_P1',
    'BT10-089_P1',
    'BT10-090_P1',
    'BT10-092_P1',
    'BT10-093_P1',
    'EX3-010_P1',
    'EX3-020_P1',
    'EX3-031_P1',
    'EX3-041_P1',
    'EX3-049_P1',
    'EX3-061_P1',
    'BT3-111_P2',
    'BT1-003_P1',
    'BT3-021_P1',
    'BT3-046_P1',
    'BT2-074_P1',
    'BT4-016_P1',
    'BT3-039_P1',
    'BT3-057_P1',
    'BT2-083_P1',
    'BT4-091_P1',
    'ST1-10_P1',
    'BT8-008_P3',
    'ST1-03_P6',
    'P-005_P1',
    'EX2-025_P2',
    'BT2-056_P1',
    'ST6-08_P6',
    'EX1-039_P2',
    'ST5-12_P1',
]

cards = []
changedCards = []
with open('jsons/AAs.json', encoding='utf-8') as fh:
    cards = json.load(fh)

for card in cards:
    if card['id'] in listsOfCardIds:
        card['version'] = 'Box-Topper'
    changedCards.append(card)

with open('jsons/AAs.json', 'w') as f:
    f.write("%s\n" % json.dumps(changedCards))
