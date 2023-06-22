import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd


names = ['BT12']
for name in names:
    cards = list()
    engCards = []
    with open(name+'.json', encoding='utf-8') as fh:
        engCards = json.load(fh)

    for card in engCards:
        if card['version'] == 'Normal':
            if card['rarity'] == 'R' or card['rarity'] == 'U':
                card['id'] = card['id'] + '_P1'
                card['cardImage'] = re.sub('.webp', '.webp', card['cardImage'])
                card['version'] = 'Foil'
                card['note'] = '▹BOOSTER DIMENSIONAL PHASE [BT-11]'
                cards.append(card)

    with open(name+'-pre.json', 'w') as f:
        for card in cards:
            f.write("%s\n" % json.dumps(card))
