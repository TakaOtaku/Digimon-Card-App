import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd

allChanges = [
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
 'BT3-111_P2'
]

japChanges = [
  'BT11-008_P1',
  'BT11-023_P1',
  'BT11-034_P1',
  'BT11-046_P1',
  'BT11-06_P1',
  'BT11-076_P1',
  'BT1-115_P2',
  'BT12-051_P1',
  'BT12-077_P1',
  'BT12-014_P1',
  'BT12-041_P1',
  'BT12-064_P1',
  'BT12-081_P1',
  'BT5-086_P5'
]

engChanges = [
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
  'ST5-12_P1'
]

cardLists = [
  'eng/BT/BT1',
  'eng/BT/BT2',
  'eng/BT/BT3',
  'eng/BT/BT4',
  'eng/BT/BT5',
  'eng/BT/BT6',
  'eng/BT/BT7',
  'eng/BT/BT8',
  'eng/BT/BT9',
  'eng/BT/BT10',
  'eng/EX/EX1',
  'eng/EX/EX2',
  'eng/EX/EX3',
  'eng/ST/ST1',
  'eng/ST/ST2',
  'eng/ST/ST3',
  'eng/ST/ST4',
  'eng/ST/ST5',
  'eng/ST/ST6',
  'eng/ST/ST7',
  'eng/ST/ST8',
  'eng/ST/ST9',
  'eng/ST/ST10',
  'eng/ST/ST12',
  'eng/ST/ST13',
  'eng/AAs',
  'eng/P',
  'eng/PreRelease',

  'jap/BT/BT1',
  'jap/BT/BT2',
  'jap/BT/BT3',
  'jap/BT/BT4',
  'jap/BT/BT5',
  'jap/BT/BT6',
  'jap/BT/BT7',
  'jap/BT/BT8',
  'jap/BT/BT9',
  'jap/BT/BT10',
  'jap/BT/BT11',
  'jap/BT/BT12',
  'jap/EX/EX1',
  'jap/EX/EX2',
  'jap/EX/EX3',
  'jap/EX/EX4',
  'jap/ST/ST1',
  'jap/ST/ST2',
  'jap/ST/ST3',
  'jap/ST/ST4',
  'jap/ST/ST5',
  'jap/ST/ST6',
  'jap/ST/ST7',
  'jap/ST/ST8',
  'jap/ST/ST9',
  'jap/ST/ST10',
  'jap/ST/ST12',
  'jap/ST/ST13',
  'jap/ST/ST14',
  'jap/AAs',
  'jap/P',
]

for cardList in cardLists:
    cards = []
    cahngedCards = []
    with open('jsons/' + cardList + '.json', encoding='utf-8') as fh:
      cards = json.load(fh)

    index = 0
    for card in cards:
      if card['cardNumber'] in allChanges:
          card['version'] = 'Boxtopper'
          cahngedCards.append(card)
      else:
        cahngedCards.append(card)

    with open('jsons/' + cardList + '.json', 'w') as f:
        f.write("%s\n" % json.dumps(cahngedCards))
