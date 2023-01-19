import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd

listsOfCardIds = [
  'BT1-003',
  'BT1-006',
  'BT1-007',
  'BT2-006',
  'BT3-002',
  'BT3-003',
  'BT3-006',
  'BT4-006',
  'BT5-001',
  'BT1-010',
  'BT1-048',
  'BT1-060',
  'BT1-067',
  'BT1-114',
  'BT2-032',
  'BT2-034',
  'BT2-038',
  'BT2-041',
  'BT2-055',
  'BT2-069',
  'BT2-070',
  'BT2-074',
  'BT2-112',
  'BT3-021',
  'BT3-039',
  'BT3-046',
  'BT3-047',
  'BT3-054',
  'BT3-061',
  'BT3-075',
  'BT3-088',
  'BT3-091',
  'BT4-011',
  'BT4-017',
  'BT4-025',
  'BT4-062',
  'BT4-079',
  'BT4-115',
  'BT5-021',
  'BT5-050',
  'BT5-062',
  'BT5-065',
  'BT5-086',
  'BT5-087',
  'BT5-111',
  'BT5-112',
  'ST1-07',
  'ST3-04',
  'ST5-11',
  'P-007',
  'P-008',
  'P-011',
  'P-013',
  'P-016',
  'P-017',
  'P-028',
  'P-032',
  'P-047',
  'P-048',
  'P-066',
  'P-067',
  'P-068',
  'P-069',
  'P-070',
  'P-071',
  'BT1-085',
  'BT1-087',
  'BT1-089',
  'BT2-090',
  'BT4-096',
  'BT4-097',
  'BT5-088',
  'BT5-092',
  'P-012',
  'BT3-097',
  'BT3-103',
  'BT4-104',
  'BT4-111',
  'BT5-105',
  'ST2-16',
  'P-035',
  'P-036',
  'P-037',
  'P-038',
  'P-039',
  'P-040'
]

cardLists = [

]

blocks = ['01', '02']

for cardList in cardLists:
    cards = []
    cardsWithBlocks = []
    with open(cardList, encoding='utf-8') as fh:
      cards = json.load(fh)

    index = 0
    for card in cards:
        card['block'] = blocks
        cardsWithBlocks.append(card)

    with open(cardList, 'w') as f:
        f.write("%s\n" % json.dumps(cardsWithBlocks))
