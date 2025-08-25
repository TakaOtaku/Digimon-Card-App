import json
import requests
from bs4 import BeautifulSoup
import time
import random
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

import WikiVariables as WV

# Configure requests session with retry strategy
def create_session():
    session = requests.Session()

    # Define retry strategy
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["HEAD", "GET", "OPTIONS"]
    )

    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)

    # Set a user agent to be polite
    session.headers.update({
        'User-Agent': 'Digimon Card App Data Scraper 1.0 (digimoncard.app@gmail.de)'
    })

    return session

# Global session
session = create_session()

def safe_request(url, delay=None):
    """Make a safe HTTP request with error handling and optional delay"""
    if delay:
        time.sleep(delay)

    try:
        response = session.get(url, timeout=30)
        response.raise_for_status()
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
        # Add exponential backoff on error
        time.sleep(random.uniform(2, 5))
        return None

def getLinks(wikiPageLink):
    response = safe_request(wikiPageLink['url'], delay=random.uniform(0.5, 1.5))
    if not response:
        print(f"Failed to fetch {wikiPageLink['name']}")
        return

    soup = BeautifulSoup(response.content, "html.parser")

    # Get all Cardslinks from the Wiki
    cardTable = soup.find('table', class_='cardlist')
    if not cardTable:
        print(f"No card table found for {wikiPageLink['name']}")
        return

    cardTableBody = cardTable.find('tbody')
    if not cardTableBody:
        print(f"No table body found for {wikiPageLink['name']}")
        return

    cardTableBodyA = cardTableBody.find_all('a')

    # Filter Card Links for all <a></a> tags that don't contain "Card_Types" in their link
    for cardLink in cardTableBodyA:
        if cardLink.get("href") and "Card_Types" not in cardLink["href"]:
            WV.cardLinks.append(cardLink["href"])


def getPromoLinks():
    promolink = WV.wikiLink + WV.promo
    start_id = 150
    max_id = 999
    consecutive_missing = 0
    max_consecutive_missing = 5

    for iterator in range(start_id, max_id + 1):
        url = f"{promolink}{iterator:03}"

        print(f"Checking {url}")

        response = safe_request(url, delay=random.uniform(0.3, 0.8))
        if not response:
            print(f"Failed to check {url}")
            consecutive_missing += 1
            if consecutive_missing >= max_consecutive_missing:
                print(f"Stopping after {max_consecutive_missing} consecutive failed requests")
                break
            continue

        soup = BeautifulSoup(response.content, "html.parser")

        cardTable = soup.find('div', class_='ctable')

        if cardTable is not None:
            WV.cardLinks.append(f"/wiki/P-{iterator:03}")
            consecutive_missing = 0  # Reset counter when we find a card
        else:
            print(f"Link doesn't exist: {url}")
            consecutive_missing += 1
            if consecutive_missing >= max_consecutive_missing:
                print(f"Stopping after {max_consecutive_missing} consecutive missing cards")
                break


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
