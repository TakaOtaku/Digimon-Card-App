import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd

lists = [
    #'cardlists/preRelease.json',
    'cardlists/eng/BT1.json',
    'cardlists/eng/BT2.json',
    'cardlists/eng/BT3.json',
    'cardlists/eng/BT4.json',
    'cardlists/eng/BT5.json',
    'cardlists/eng/BT6.json',
    'cardlists/eng/BT7.json',
    'cardlists/eng/BT8.json',
    'cardlists/eng/EX1.json',
    'cardlists/eng/P.json',
    'cardlists/eng/ST1.json',
    'cardlists/eng/ST2.json',
    'cardlists/eng/ST3.json',
    'cardlists/eng/ST4.json',
    'cardlists/eng/ST5.json',
    'cardlists/eng/ST6.json',
    'cardlists/eng/ST7.json',
    'cardlists/eng/ST8.json',
    'cardlists/eng/ST9.json',
    'cardlists/eng/ST10.json',
    
    'cardlists/jap/BT1.json',
    'cardlists/jap/BT2.json',
    'cardlists/jap/BT3.json',
    'cardlists/jap/BT4.json',
    'cardlists/jap/BT5.json',
    'cardlists/jap/BT6.json',
    'cardlists/jap/BT7.json',
    'cardlists/jap/BT8.json',
    'cardlists/jap/BT9.json',
    'cardlists/jap/EX1.json',
    'cardlists/jap/EX2.json',
    'cardlists/jap/P.json',
    'cardlists/jap/ST1.json',
    'cardlists/jap/ST2.json',
    'cardlists/jap/ST3.json',
    'cardlists/jap/ST4.json',
    'cardlists/jap/ST5.json',
    'cardlists/jap/ST6.json',
    'cardlists/jap/ST7.json',
    'cardlists/jap/ST8.json',
    'cardlists/jap/ST9.json',
    'cardlists/jap/ST10.json',
    'cardlists/jap/ST12.json',
    'cardlists/jap/ST13.json',
    ]

for listitem in lists:
    cards = []
    cardsWithBlocks = []
    with open(listitem, encoding='utf-8') as fh:cards = json.load(fh)
    
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
