import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd

cards = []
with open('BT10.json', encoding='utf-8') as fh:
    cards = json.load(fh)


illustrators = []
index = 0
for card in cards:
    page = requests.get('https://digimoncardgame.fandom.com/wiki/'+card['cardNumber'])
    soup = BeautifulSoup(page.content, "html.parser")

    cardHTML = soup.find("div", class_="info-main")
    
    illustrator = ''
    trs = cardHTML.select("tbody > tr")
    for tr in trs:
        tds = tr.findAll("td")
        for td in tds:
            text = td.text
            if card['version'] == 'Normal' or card['version'] == 'Stamp':
                if  text == 'Illustrator':
                    children = td.parent.findAll("td")
                    illustrator = children[1].text
            if card['version'] != 'Normal':
                if  text == 'Illustrator 2' and '_P1' in card['id']:
                    children = td.parent.findAll("td")
                    illustrator = children[1].text
                if  text == 'Illustrator 3' and '_P2' in card['id']:
                    children = td.parent.findAll("td")
                    illustrator = children[1].text
                if  text == 'Illustrator 4' and '_P3' in card['id']:
                    children = td.parent.findAll("td")
                    illustrator = children[1].text
                if  text == 'Illustrator 5' and '_P4' in card['id']:
                    children = td.parent.findAll("td")
                    illustrator = children[1].text
                if  text == 'Illustrator 6' and '_P5' in card['id']:
                    children = td.parent.findAll("td")
                    illustrator = children[1].text
    
    if '\n' in illustrator:
        illustrator = illustrator[:-1]
    card['illustrator'] = illustrator
    illustrators.append(card)

with open('BT10.json', 'w') as f:
	f.write("%s\n" % json.dumps(illustrators))
