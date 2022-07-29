import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd

jsons = [
    'BT1.json',
    'BT2.json',
    'BT3.json',
    'BT4.json',
    'BT5.json',
    'BT6.json',
    'BT7.json',
    'BT8.json',
    'BT9.json',
    'BT10.json',
    'EX1.json',
    'EX2.json',
    'ST1.json',
    'ST2.json',
    'ST3.json',
    'ST4.json',
    'ST5.json',
    'ST6.json',
    'ST7.json',
    'ST8.json',
    'ST9.json',
    'ST10.json',
    'ST12.json',
    'ST13.json',
    'P.json',
]

cards = list()
allCards = []
notes = []
for current in jsons:
    with open('jsons/' + current, encoding='utf-8') as fh:
        allCards = json.load(fh)

    for card in allCards:
        if card['notes'] in notes:
            print('duplicate')
        else:
            notes.append(card['notes'])

with open('notes.json', 'w') as f:
    f.write("%s\n" % json.dumps(notes))
