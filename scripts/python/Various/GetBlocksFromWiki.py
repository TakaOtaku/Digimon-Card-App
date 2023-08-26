import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd

lists = []

for listitem in lists:
    cards = []
    cardsWithBlocks = []
    with open(listitem, encoding='utf-8') as fh:
      cards = json.load(fh)

    index = 0
    for card in cards:
        page = requests.get('https://digimoncardgame.fandom.com/wiki/'+card['cardNumber'])
        soup = BeautifulSoup(page.content, "html.parser")

        cardHTML = soup.find("div", class_="info-restricted")

        blockHTML = cardHTML.find("span", class_="block_circle")
        blocks = blockHTML.text.split('-')

        card['block'] = blocks
        cardsWithBlocks.append(card)

    with open(listitem, 'w') as f:
        f.write("%s\n" % json.dumps(cardsWithBlocks))
