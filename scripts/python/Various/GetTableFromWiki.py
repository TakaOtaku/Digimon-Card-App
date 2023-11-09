import json
import time

import os
import re

import requests
from bs4 import BeautifulSoup
import urllib.request


page = requests.get(
    'https://digimoncardgame.fandom.com/wiki/Ultimate_Cup_2023/December_2023_%26_January_2024_Eligible_Cards_List')
soup = BeautifulSoup(page.content, "html.parser")

ids = []

# Get all Cardslinks from the Wiki
cardTables = soup.find_all('table', class_='cardlist')

for cardTable in cardTables:
    cardTableBody = cardTable.find('tbody')
    cardTableRows = cardTableBody.find_all('tr')
    for rows in cardTableRows:
        cardCell = rows.find('a')
        if cardCell != -1 and cardCell != None:
            # Append the title attribute of the cell to the ids if there is such an attribute
            title = cardCell.get('title')
            if title != None:
                ids.append(title)

print(ids)

#Save Ids to a Json nicely formated
with open('ids.json', 'w') as outfile:
    json.dump(ids, outfile, indent=4)
