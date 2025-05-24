import json
import requests
from bs4 import BeautifulSoup

import WikiVariables as WV


def getLinks(wikiPageLink):
  page = requests.get(wikiPageLink['url'])
  soup = BeautifulSoup(page.content, "html.parser")

  # Get all Cardslinks from the Wiki
  cardTable = soup.find('table', class_='cardlist')
  cardTableBody = cardTable.find('tbody')
  cardTableBodyA = cardTableBody.find_all('a')

  # Filter Card Links for all <a></a> tags that don't contain "Card_Types" in their link
  for cardLink in cardTableBodyA:
    if "Card_Types" not in cardLink["href"]:
      WV.cardLinks.append(cardLink["href"])


def getPromoLinks():
  promolink = WV.wikiLink + WV.promo
  start_id = 150
  max_id = 999

  for iterator in range(start_id, max_id + 1):
    url = f"{promolink}{iterator:03}"

    print(f"Checking {url}")

    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")

    cardTable = soup.find('div', class_='ctable')

    if cardTable is not None:
      WV.cardLinks.append(f"/wiki/P-{iterator:03}")
    else:
      print(f"Link doesn't exist: {url}")
      break  # Stop the loop when you encounter nothing


# Read Links.json and append new Links to the Array then save it again
def saveLinks():
  # Open the JSON file and load its contents
  with open('./scripts/python/Wiki/jsons/Links.json', 'r') as file:
    data = json.load(file)

    # Add all new Links to the Array
    for link in WV.cardLinks:
      if link not in data:
        data.append(link)

    # Save the Links to a JSON file
    with open('./scripts/python/Wiki/jsons/Links.json', 'w') as file:
      json.dump(data, file, indent=2)

    # Set current Links to the new Links
    WV.cardLinks = data

def addLinks():
  # Open the JSON file and load its contents
  with open('./scripts/python/Wiki/jsons/Links.json', 'r') as file:
    data = json.load(file)

    # Add all new Links to the Array
    for link in WV.cardLinks:
      if link not in data:
        data.append(link)

    # Set current Links to the new Links
    WV.cardLinks = data
