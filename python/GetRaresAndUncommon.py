import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd


cards = list()
engCards = []

with open('BT8.json', encoding='utf-8') as fh:
    engCards = json.load(fh)

for card in engCards:
	if card['version'] == 'Normal':
		if card['rarity'] == 'R' or card['rarity'] == 'UC':
			card['id']  = card['id'] + '_P0'
			card['cardImage']  = re.sub(r'eng', 'pre-release/png', card['cardImage'])
			card['cardImage']  = re.sub(r'.jpg', '_P0.jpg', card['cardImage'])
			card['version']  = 'Pre-Release'
			cards.append(card)

with open('BT8.json', 'w') as f:
    for card in cards:
        f.write("%s\n" % json.dumps(card))
