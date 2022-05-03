import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd


cards = list()
allCards = []

with open('japanese.json', encoding='utf-8') as fh:
    allCards = json.load(fh)

for card in allCards:
    if card['illustrator'] in cards:
        print('duplicate')
    else:
    	cards.append(card['illustrator'])

with open('illustrators.json', 'w') as f:
    f.write("%s\n" % json.dumps(cards))
