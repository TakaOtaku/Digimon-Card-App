import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd

listsOfCardIds = [
  'BT1-003_P3',
  'BT1-006_P1',
  'BT1-007_P1',
  'BT1-010_P3',
  'BT1-048_P2',
  'BT1-060_P2',
  'BT1-067_P2',
  'BT1-085_P3',
  'BT1-087_P3',
  'BT1-089_P3',
  'BT1-114_P2',
  'BT2-006_P1',
  'BT2-032_P4',
  'BT2-034_P2',
  'BT2-038_P3',
  'BT2-041_P2',
  'BT2-055_P1',
  'BT2-069_P2',
  'BT2-070_P2',
  'BT2-074_P2',
  'BT2-090_P3',
  'BT2-112_P2',
  'BT3-002_P1',
  'BT3-003_P1',
  'BT3-006_P2',
  'BT3-021_P4',
  'BT3-039_P2',
  'BT3-046_P3',
  'BT3-047_P2',
  'BT3-054_P1',
  'BT3-061_P2',
  'BT3-075_P2',
  'BT3-088_P2',
  'BT3-091_P2',
  'BT3-097_P1',
  'BT3-103_P1',
  'BT4-006_P1',
  'BT4-011_P3',
  'BT4-017_P2',
  'BT4-025_P2',
  'BT4-062_P2',
  'BT4-079_P1',
  'BT4-096_P3',
  'BT4-097_P2',
  'BT4-104_P1',
  'BT4-111_P1',
  'BT4-115_P2',
  'BT5-001_P2',
  'BT5-021_P1',
  'BT5-050_P1',
  'BT5-062_P1',
  'BT5-065_P1',
  'BT5-086_P6',
  'BT5-087_P3',
  'BT5-088_P2',
  'BT5-092_P2',
  'BT5-105_P1',
  'BT5-111_P2',
  'BT5-112_P3',
  'P-007_P1',
  'P-008_P1',
  'P-011_P1',
  'P-012_P1',
  'P-013_P1',
  'P-016_P1',
  'P-017_P1',
  'P-028_P2',
  'P-032_P1',
  'P-035_P2',
  'P-035_P3',
  'P-036_P2',
  'P-036_P3',
  'P-037_P2',
  'P-037_P3',
  'P-038_P2',
  'P-038_P3',
  'P-039_P2',
  'P-039_P3',
  'P-040_P2',
  'P-040_P3',
  'P-047_P1',
  'P-048_P1',
  'P-066_P1',
  'P-066_P2',
  'P-067_P1',
  'P-067_P2',
  'P-068_P1',
  'P-068_P2',
  'P-069_P1',
  'P-069_P2',
  'P-070_P1',
  'P-070_P2',
  'P-071_P1',
  'P-071_P2',
  'ST1-07_P3',
  'ST2-16_P2',
  'ST3-04_P3',
  'ST5-11_P1',
]

blocks = ['01', '02']

cards = []
cardsWithBlocks = []
with open('jsons/test.json', encoding='utf-8') as fh:
  cards = json.load(fh)

index = 0
for card in cards:
    card['id'] = listsOfCardIds[index]
    card['version'] = 'Reprint'
    cardsWithBlocks.append(card)
    index = index + 1

with open('jsons/test.json', 'w') as f:
    f.write("%s\n" % json.dumps(cardsWithBlocks))
