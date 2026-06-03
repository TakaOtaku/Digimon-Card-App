import json
import os
import requests
from bs4 import BeautifulSoup
from classes.DigimonCard import DigimonCard

import WikiVariables as WV
import time
import random
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# MediaWiki API endpoint for Fandom
WIKI_API_URL = 'https://digimoncardgame.fandom.com/api.php'

def check_if_image_exists(image_path):
    return os.path.exists(image_path)


# ============================================
# MediaWiki API Functions
# ============================================

def create_api_session():
    """Create a requests session optimized for MediaWiki API calls"""
    session = requests.Session()
    
    retry_strategy = Retry(
        total=5,
        backoff_factor=1.5,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["HEAD", "GET", "POST", "OPTIONS"]
    )
    
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    
    # MediaWiki API is more lenient with bot-like User-Agents when using the API
    session.headers.update({
        'User-Agent': 'DigimonCardApp/1.0 (https://digimoncard.app; contact@digimoncard.app) Python/requests',
        'Accept': 'application/json',
    })
    
    return session

# Global API session
api_session = create_api_session()


def api_request(params, delay=0.5):
    """
    Make a request to the MediaWiki API.
    
    Args:
        params: Dictionary of API parameters
        delay: Delay between requests in seconds (default 0.5s)
    
    Returns:
        JSON response or None on error
    """
    if delay:
        time.sleep(delay)
    
    # Always request JSON format
    params['format'] = 'json'
    
    try:
        response = api_session.get(WIKI_API_URL, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"API request error: {e}")
        time.sleep(random.uniform(2, 5))
        return None


def get_page_html(page_title, delay=0.5):
    """
    Get the HTML content of a wiki page using the parse API.
    
    Args:
        page_title: The title of the wiki page (e.g., 'BT1-001' or 'BT-01:_Booster_New_Evolution')
        delay: Delay between requests
    
    Returns:
        BeautifulSoup object of the page content, or None on error
    """
    params = {
        'action': 'parse',
        'page': page_title,
        'prop': 'text',
        'redirects': 'true',
        'disablelimitreport': 'true',
        'disableeditsection': 'true',
    }
    
    result = api_request(params, delay)
    
    if result and 'parse' in result and 'text' in result['parse']:
        html_content = result['parse']['text']['*']
        return BeautifulSoup(html_content, 'lxml')
    
    return None


def get_category_members(category_name, delay=0.3):
    """
    Get all pages in a category using the API.
    
    Args:
        category_name: Category name (without 'Category:' prefix)
        delay: Delay between requests
    
    Returns:
        List of page titles in the category
    """
    pages = []
    params = {
        'action': 'query',
        'list': 'categorymembers',
        'cmtitle': f'Category:{category_name}',
        'cmlimit': 500,
    }
    
    while True:
        result = api_request(params, delay)
        
        if not result or 'query' not in result:
            break
        
        for member in result['query'].get('categorymembers', []):
            pages.append(member['title'])
        
        # Handle continuation for large categories
        if 'continue' in result:
            params['cmcontinue'] = result['continue']['cmcontinue']
        else:
            break
    
    return pages


def get_links_from_page(page_title, delay=0.5):
    """
    Get all links from a wiki page using the parse API.
    
    Args:
        page_title: The title of the wiki page
        delay: Delay between requests
    
    Returns:
        List of link hrefs found in the page
    """
    soup = get_page_html(page_title, delay)
    if not soup:
        return []
    
    links = []
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        # Filter for wiki links
        if href.startswith('/wiki/') and ':' not in href:
            links.append(href)
    
    return links


def get_card_links_from_set_page(page_title, delay=0.5):
    """
    Get all card links from a booster/starter deck page.
    
    Args:
        page_title: The title of the set page (e.g., 'BT-01:_Booster_New_Evolution')
        delay: Delay between requests
    
    Returns:
        List of card link paths (e.g., ['/wiki/BT1-001', '/wiki/BT1-002', ...])
    """
    soup = get_page_html(page_title, delay)
    if not soup:
        print(f"Failed to fetch page: {page_title}")
        return []
    
    card_links = []
    
    # Find the card list table
    card_table = soup.find('table', class_='cardlist')
    if not card_table:
        print(f"No card table found for: {page_title}")
        return []
    
    card_table_body = card_table.find('tbody')
    if not card_table_body:
        print(f"No table body found for: {page_title}")
        return []
    
    # Get all links from the table
    for link in card_table_body.find_all('a', href=True):
        href = link['href']
        # Filter out non-card links
        if href and 'Card_Types' not in href and href.startswith('/wiki/'):
            if href not in card_links:
                card_links.append(href)
    
    return card_links


def get_page_exists(page_title, delay=0.3):
    """
    Check if a wiki page exists using the API.
    
    Args:
        page_title: The title of the page to check
        delay: Delay between requests
    
    Returns:
        True if page exists, False otherwise
    """
    params = {
        'action': 'query',
        'titles': page_title,
        'prop': 'info',
    }
    
    result = api_request(params, delay)
    
    if result and 'query' in result and 'pages' in result['query']:
        pages = result['query']['pages']
        # If page doesn't exist, the key is '-1'
        return '-1' not in pages
    
    return False

def class_to_dict(obj):
    if isinstance(obj, dict):
        return {k: class_to_dict(v) for k, v in obj.items()}
    elif hasattr(obj, "__dict__"):
        return class_to_dict(obj.__dict__)
    elif isinstance(obj, list):
        return [class_to_dict(item) for item in obj]
    else:
        return obj

def formatJsonToSetDictionary():
    # Open the JSON file and load its contents
    with open('./scripts/python/Wiki/jsons/DigimonCards.json', 'r') as file:
        data = json.load(file)

    def group_cards_by_prefix(cards):
        grouped_cards = {}
        for card in cards:
            card_id = card["id"]
            prefix = card_id.split("-")[0]  # Get the first part of the id
            if prefix not in grouped_cards:
                grouped_cards[prefix] = []
            grouped_cards[prefix].append(card)
        return grouped_cards

    # Call the function and get the sorted dictionary
    sorted_cards_dict = group_cards_by_prefix(data)

    # Save the updated JSON back to the file
    with open('./scripts/python/Wiki/jsons/DigimonCardsSetDictionary.json', 'w') as file:
        json.dump(sorted_cards_dict, file, indent=2, sort_keys=sort_key)

def remove_underscores(json_obj):
    if isinstance(json_obj, dict):
        return {
            key.replace('_', ''): remove_underscores(value)
            for key, value in json_obj.items()
        }
    elif isinstance(json_obj, list):
        return [remove_underscores(item) for item in json_obj]
    else:
        return json_obj

def sort_key(card):
    return card["_id"]

def remove_item_at_index(arr, index):
    if index < 0 or index >= len(arr):
        raise IndexError("Index out of range")

    arr.pop(index)
    return arr


def setNotes():
    for card in WV.cards:
        if card.notes in WV.NoteDictionary:
            card.notes = WV.NoteDictionary[card.notes]


def getRulings():
    """Get rulings for all cards using MediaWiki API"""
    rulingCount = 0
    for link in WV.cardLinks:
        rulingCount += 1

        # Extract page title and add /Rulings suffix
        page_title = link.split('/wiki/')[-1] if '/wiki/' in link else link.lstrip('/')
        rulings_page_title = page_title + '/Rulings'

        soup = get_page_html(rulings_page_title, delay=random.uniform(0.2, 0.5))
        if not soup:
            print(f"Failed to fetch rulings for: {link}")
            continue

        id = link.split("/")[2]

        questions = soup.find_all("div", class_="ruling-question")
        answers = soup.find_all("div", class_="ruling-answer")

        if len(questions) == 0:
            print('Rulings for: ' + id + ' - Found ' +
                  str(len(questions)) + ' Rulings')
            continue

        WV.rulings[id] = []

        questionCount = 0
        for question in questions:
            questionText = question.text
            answerText = answers[questionCount].text
            WV.rulings[id].append(
                {'question': questionText, 'answer': answerText})
            questionCount += 1
        print('[' + str(rulingCount) + '/' + str(WV.cardCount) + ']')
        print('Rulings for: ' + id + ' - Found ' +
              str(len(questions)) + ' Rulings')

    print('Saving Rulings JSON!')
    with open('./scripts/python/Wiki/jsons/Rulings.json', 'w') as fp:
        json.dump(WV.rulings, fp, indent=2, sort_keys=sort_key)


def saveCards():
    formatedCards = []
    for card in WV.cards:
        formatedCards.append(class_to_dict(card))

    formatedCards = remove_underscores(formatedCards)
    print('Saving DigimonCard JSON!')
    with open('./scripts/python/Wiki/jsons/DigimonCards.json', 'w') as fp:
        json.dump(formatedCards, fp, indent=2, sort_keys=sort_key)

def loadCards():
  # Open the JSON file and load its contents
  with open('./scripts/python/Wiki/jsons/DigimonCards.json', 'r') as file:
    data = json.load(file)
    # Data is an Array of DigimonCards and they should be added to WV.Cards with the correct Class
    cards = []
    for card in data:
        currentDigimon = DigimonCard()
        aas = []
        for aa in card['AAs']:
          aas.append({'id': aa['id'], 'illustrator': aa['illustrator'], 'note': aa['note'], 'type': aa['type']})
        currentDigimon.AAs = aas
        jaas = []
        for aa in card['JAAs']:
          jaas.append({'id': aa['id'], 'illustrator': aa['illustrator'], 'note': aa['note'], 'type': aa['type']})
        currentDigimon.JAAs = jaas
        currentDigimon.aceEffect = card['aceEffect']
        currentDigimon.attribute = card['attribute']
        currentDigimon.block = card['block']
        currentDigimon.burstDigivolve = card['burstDigivolve']
        currentDigimon.cardImage = card['cardImage']
        currentDigimon.cardLv = card['cardLv']
        currentDigimon.cardNumber = card['cardNumber']
        currentDigimon.cardType = card['cardType']
        currentDigimon.color = card['color']
        currentDigimon.digiXros = card['digiXros']
        currentDigimon.assembly = card['assembly']
        currentDigimon.digivolveCondition = card['digivolveCondition']
        currentDigimon.digivolveEffect = card['digivolveEffect']
        currentDigimon.dnaDigivolve = card['dnaDigivolve']
        currentDigimon.dp = card['dp']
        currentDigimon.effect = card['effect']
        currentDigimon.form = card['form']
        currentDigimon.id = card['id']
        currentDigimon.illustrator = card['illustrator']
        currentDigimon.linkDP = card['linkDP']
        currentDigimon.linkEffect = card['linkEffect']
        currentDigimon.linkRequirement = card['linkRequirement']
        currentDigimon.name = card['name']
        currentDigimon.notes = card['notes']
        currentDigimon.playCost = card['playCost']
        currentDigimon.rarity = card['rarity']
        currentDigimon.restrictions = card['restrictions']
        currentDigimon.rule = card['rule']
        currentDigimon.securityEffect = card['securityEffect']
        currentDigimon.specialDigivolve = card['specialDigivolve']
        currentDigimon.type = card['type']
        currentDigimon.version = card['version']

        cards.append(currentDigimon)

    WV.cards = cards
    print("Cards Loaded!")
