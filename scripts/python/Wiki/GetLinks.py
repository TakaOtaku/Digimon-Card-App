import json
import asyncio
import aiohttp
from typing import List, Dict, Optional
import requests
from bs4 import BeautifulSoup
from typing import Dict, List

import WikiVariables as WV

async def fetch_page(session: aiohttp.ClientSession, url: str, max_retries: int = 3) -> Optional[str]:
  """Fetch a single page asynchronously with retries"""
  for attempt in range(max_retries):
    try:
      async with session.get(url) as response:
        if response.status == 200:
          return await response.text()
        # Handle rate limiting specifically
        if response.status == 429:
          # Exponential backoff
          wait_time = 2 ** attempt
          print(f"Rate limited, waiting {wait_time}s before retry...")
          await asyncio.sleep(wait_time)
          continue
        print(f"Error {response.status} for URL: {url}")
        return None
    except Exception as e:
      print(f"Error fetching {url} (attempt {attempt+1}/{max_retries}): {e}")
      if attempt < max_retries - 1:  # Don't sleep on the last attempt
        await asyncio.sleep(1)
  return None

async def process_wiki_page(session: aiohttp.ClientSession, wiki_page: Dict[str, str]) -> List[str]:
  """Process a single wiki page and extract card links"""
  print(f'Getting Links for: {wiki_page["name"]}')
  
  try:
    content = await fetch_page(session, wiki_page['url'])
    if not content:
      return []
        
    soup = BeautifulSoup(content, "html.parser")

    # Get all Cardslinks from the Wiki
    cardTable = soup.find('table', class_='cardlist')
    if not cardTable:
      print(f'No card table found for {wiki_page["name"]}')
      return []
        
    cardTableBody = cardTable.find('tbody')
    if not cardTableBody:
      print(f'No table body found for {wiki_page["name"]}')
      return []
        
    cardTableBodyA = cardTableBody.find_all('a')

    # Filter Card Links
    links = [
      link["href"] for link in cardTableBodyA 
      if "Card_Types" not in link.get("href", "")
    ]
    
    print(f'Found {len(links)} cards in {wiki_page["name"]}')
    return links
      
  except Exception as e:
    print(f'Error processing {wiki_page["name"]}: {e}')
    return []

async def getMainSetLinks(session: aiohttp.ClientSession):
    """Get all links from main sets concurrently"""
    # Create tasks for all wiki pages
    tasks = [
        process_wiki_page(session, wiki_page) 
        for wiki_page in WV.wikiPageLinks
    ]
    
    # Process all pages concurrently
    results = await asyncio.gather(*tasks)
    
    # Flatten the list of lists and add to cardLinks
    for links in results:
        WV.cardLinks.extend(links)
    
    print(f'Total cards found: {len(WV.cardLinks)}')

async def checkPromoLink(session: aiohttp.ClientSession, base_url: str, iterator: int) -> Optional[str]:
    """Check a single promo link asynchronously"""
    url = f"{base_url}{iterator:03}"
    try:
        content = await fetch_page(session, url)
        if not content:
            print(f"Link doesn't exist: {url}")
            return None
            
        soup = BeautifulSoup(content, "html.parser")
        cardTable = soup.find('div', class_='ctable')

        if cardTable is not None:
            print(f"Found valid card: P-{iterator:03}")
            return f"/wiki/P-{iterator:03}"
        
        print(f"Link exists but no card table: {url}")
        return None
    except Exception as e:
        print(f"Error checking {url}: {e}")
        return None

async def getPromoLinks(session: aiohttp.ClientSession, batch_size: int = 15) -> List[str]:
  """Get all promo links using async requests"""
  promolink = WV.wikiLink + WV.promo
  start_id = 175
  max_id = 999
  valid_links = []

  for batch_start in range(start_id, max_id + 1, batch_size):
    batch_end = min(batch_start + batch_size, max_id + 1)
    print(f"Checking batch {batch_start} to {batch_end-1}")

    # Create tasks for the current batch
    tasks = [
      checkPromoLink(session, promolink, i)
      for i in range(batch_start, batch_end)
    ]

    # Process the batch concurrently
    results = await asyncio.gather(*tasks)

    # Filter out None results and add valid links
    batch_links = [link for link in results if link is not None]
    valid_links.extend(batch_links)

    # If no valid links found in the batch, we've reached the end
    if not batch_links:
      consecutive_empty_batches += 1
      if consecutive_empty_batches >= 3:  # Give up after 3 empty batches
        print(f"No valid links found in last 3 batches, stopping search.")
        break
    else:
      consecutive_empty_batches = 0

  # Add valid links to the cardLinks array if not already present
  for link in valid_links:
    if link not in WV.cardLinks:
      WV.cardLinks.append(link)

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

def loadLinks():
  # Open the JSON file and load its contents
  with open('./scripts/python/Wiki/jsons/Links.json', 'r') as file:
    data = json.load(file)

    # Add all new Links to the Array
    for link in WV.cardLinks:
      if link not in data:
        data.append(link)

    # Set current Links to the new Links
    WV.cardLinks = data
