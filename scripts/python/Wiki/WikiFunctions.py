import json
import os
import requests
from bs4 import BeautifulSoup
from classes.DigimonCard import DigimonCard

import WikiVariables as WV
import time
import random
from concurrent.futures import ThreadPoolExecutor
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# MediaWiki API endpoint for Fandom
WIKI_API_URL = 'https://digimoncardgame.fandom.com/api.php'
# Parallel page fetches; the session's Retry backs off on 429 if the wiki pushes back.
WIKI_WORKERS = max(1, int(os.environ.get('WIKI_WORKERS', '4')))

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
    
    adapter = HTTPAdapter(max_retries=retry_strategy, pool_maxsize=max(10, WIKI_WORKERS))
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
    
    params = {**params, 'format': 'json'}

    try:
        response = api_session.get(WIKI_API_URL, params=params, timeout=30)
        response.raise_for_status()
        result = response.json()
        if 'error' in result:
            print(f"API error for {params}: {result['error'].get('info', result['error'])}")
            return None
        return result
    except (requests.exceptions.RequestException, ValueError) as e:
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


def iter_pages_html(page_titles, delay_range=(0.2, 0.5), chunk_size=50):
    """
    Yield (title, soup or None) in input order, fetching WIKI_WORKERS pages at once.
    Works in chunks so a slow consumer never holds more than chunk_size parsed pages.
    """
    def fetch(title):
        return get_page_html(title, delay=random.uniform(*delay_range))

    with ThreadPoolExecutor(WIKI_WORKERS) as pool:
        for start in range(0, len(page_titles), chunk_size):
            chunk = page_titles[start:start + chunk_size]
            yield from zip(chunk, pool.map(fetch, chunk))


def get_existing_pages(page_titles, delay=0.2):
    """
    Return the subset of page_titles that exist, checking 50 titles per API call.
    A batch whose lookup fails counts as existing, so callers fetch it rather than drop it.
    """
    existing = set()
    for start in range(0, len(page_titles), 50):
        chunk = page_titles[start:start + 50]
        result = api_request({'action': 'query', 'titles': '|'.join(chunk)}, delay)
        if not result or 'query' not in result:
            existing.update(chunk)
            continue
        normalized = {n['from']: n['to'] for n in result['query'].get('normalized', [])}
        missing = {p['title'] for p in result['query'].get('pages', {}).values() if 'missing' in p or 'invalid' in p}
        existing.update(t for t in chunk if normalized.get(t, t) not in missing)
    return existing


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
    """
    Update Rulings.json for the cards in WV.cardLinks using the MediaWiki API.
    Only cards with a /Rulings page are fetched; cards whose fetch fails keep their saved rulings.
    """
    rulings_path = './scripts/python/Wiki/jsons/Rulings.json'
    if os.path.exists(rulings_path):
        with open(rulings_path, 'r', encoding='utf-8') as fp:
            WV.rulings = json.load(fp)

    ids = [link.split('/wiki/')[-1] if '/wiki/' in link else link.lstrip('/') for link in WV.cardLinks]
    titles = [card_id + '/Rulings' for card_id in ids]
    existing = get_existing_pages(titles)
    print(f'{len(existing)} of {len(titles)} cards have a rulings page')

    for card_id, title in zip(ids, titles):
        if title not in existing:
            WV.rulings.pop(card_id, None)

    fetch = [(card_id, title) for card_id, title in zip(ids, titles) if title in existing]
    for count, ((card_id, _), (title, soup)) in enumerate(zip(fetch, iter_pages_html([t for _, t in fetch])), 1):
        if not soup:
            print(f"Failed to fetch rulings for: {card_id} - keeping saved rulings")
            continue

        questions = soup.find_all("div", class_="ruling-question")
        answers = soup.find_all("div", class_="ruling-answer")
        if len(questions) != len(answers):
            print(f"Rulings for {card_id}: {len(questions)} questions but {len(answers)} answers")

        if questions:
            WV.rulings[card_id] = [{'question': q.text, 'answer': a.text} for q, a in zip(questions, answers)]
        else:
            WV.rulings.pop(card_id, None)
        print(f'[{count}/{len(fetch)}] Rulings for: {card_id} - Found {len(questions)} Rulings')

    print('Saving Rulings JSON!')
    with open(rulings_path, 'w') as fp:
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
        currentDigimon.optionCardColourRequirement = card.get('optionCardColourRequirement', '-')
        currentDigimon.optionCardEffect = card.get('optionCardEffect', '-')
        currentDigimon.dualEffect = card.get('dualEffect', '-')

        cards.append(currentDigimon)

    WV.cards = cards
    print("Cards Loaded!")
