import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd


names = ['BT11']
for name in names:
    cards = list()
    engCards = []
    with open(name+'.json', encoding='utf-8') as fh:
        engCards = json.load(fh)

    for card in engCards:
        if card['version'] == 'Stamp':
            if card['rarity'] == 'C' or card['rarity'] == 'U':
                card['id'] = card['id'] + '_P1'
                card['cardImage'] = re.sub(
                    r'.webp', '.webp', card['cardImage'])
                card['version'] = 'Foil'
                card['note'] = '▹BOOSTER DIMENSIONAL PHASE [BT-11]'
                cards.append(card)

    with open(name+'.json', 'w') as f:
        for card in cards:
            f.write("%s\n" % json.dumps(card))
