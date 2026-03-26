import json
import time
import random

import WikiVariables as WV
import WikiFunctions as WF


def getLinks(wikiPageLink):
    """
    Get card links from a booster/starter deck wiki page using MediaWiki API.
    
    Args:
        wikiPageLink: Dictionary with 'name' and 'url' keys
    """
    # Extract page title from URL
    # URL format: https://digimoncardgame.fandom.com/wiki/BT-01:_Booster_New_Evolution
    url = wikiPageLink['url']
    page_title = url.split('/wiki/')[-1] if '/wiki/' in url else url
    
    print(f"Fetching cards from: {wikiPageLink['name']}")
    
    card_links = WF.get_card_links_from_set_page(page_title, delay=random.uniform(0.3, 0.6))
    
    if not card_links:
        print(f"No cards found for: {wikiPageLink['name']}")
        return
    
    print(f"  Found {len(card_links)} cards")
    
    # Add unique links to the global list
    for link in card_links:
        if link not in WV.cardLinks:
            WV.cardLinks.append(link)


def getPromoLinks():
    """
    Get promo card links by checking which P-XXX pages exist using MediaWiki API.
    """
    start_id = 150
    max_id = 999
    consecutive_missing = 0
    max_consecutive_missing = 5
    
    print(f"Checking promo cards starting from P-{start_id:03}...")
    
    for iterator in range(start_id, max_id + 1):
        page_title = f"P-{iterator:03}"
        
        print(f"Checking {page_title}...")
        
        # Use API to check if page exists
        if WF.get_page_exists(page_title, delay=random.uniform(0.2, 0.4)):
            # Verify it's actually a card page by checking for the card table
            soup = WF.get_page_html(page_title, delay=0.2)
            if soup and soup.find('div', class_='ctable'):
                WV.cardLinks.append(f"/wiki/{page_title}")
                print(f"  ✓ Found: {page_title}")
                consecutive_missing = 0
            else:
                print(f"  ✗ Page exists but no card data: {page_title}")
                consecutive_missing += 1
        else:
            print(f"  ✗ Not found: {page_title}")
            consecutive_missing += 1
        
        if consecutive_missing >= max_consecutive_missing:
            print(f"Stopping after {max_consecutive_missing} consecutive missing cards")
            break
    
    print(f"Promo check complete. Found {len([l for l in WV.cardLinks if '/wiki/P-' in l])} promo cards.")


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
