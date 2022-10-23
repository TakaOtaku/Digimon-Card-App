import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd


names = ['BT10']
for name in names:
    cards = list()
    engCards = []
    with open(name+'.json', encoding='utf-8') as fh:
        engCards = json.load(fh)

    for card in engCards:
        if card['version'] == 'Normal':
            if card['rarity'] == 'R' or card['rarity'] == 'U':
                card['id'] = card['id'] + '_P0'
                card['cardImage'] = re.sub(
                    r'eng', 'pre-release', card['cardImage'])
                card['cardImage'] = re.sub(
                    r'.webp', '_P0.webp', card['cardImage'])
                card['version'] = 'Pre-Release'
                cards.append(card)

    with open(name+'.json', 'w') as f:
        for card in cards:
            f.write("%s\n" % json.dumps(card))
