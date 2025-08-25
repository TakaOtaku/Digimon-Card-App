"""
Module for extracting Digimon card data from the wiki.

This module contains functions to parse HTML content from the Digimon Card Game Wiki
and extract card information into structured data objects.
"""
from typing import List, Optional, Dict, Any
import requests
import time
import random
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from bs4 import BeautifulSoup, Tag

from classes.DigimonCard import DigimonCard
from classes.DigivolveCondition import DigivolveCondition

import WikiVariables as WV

# Configure requests session with retry strategy
def create_robust_session():
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
        'User-Agent': 'Digimon Card App Data Scraper 1.0 (digimoncard.app@gmail.de)',
        'Connection': 'keep-alive',
    })

    return session

# Constants for parsing
RARITY_MAPPING = {
    "-": "-",
    "": "-",
    "Common": "C",
    "Uncommon": "U",
    "Rare": "R",
    "Super Rare": "SR",
    "Secret Rare": "SEC",
    "Alternative Art": "AA",
    "Promo": "P",
    "Special Rare": "SP"
}

# Field mappings for main info parsing
MAIN_INFO_MAPPINGS = {
    "Name": ("name.english", str),
    "Japanese": ("name.japanese", str),
    "Traditional Chinese": ("name.traditionalChinese", str),
    "Simplified Chinese": ("name.simplifiedChinese", str),
    "Korean": ("name.korean", str),
    "Colour": ("color", lambda x: x.replace(" / ", "/")),
    "Card Type": ("cardType", str),
    "Play Cost": ("playCost", str),
    "Use Cost": ("playCost", str),
    "DP": ("dp", lambda x: x.replace(" DP", "")),
    "Level": ("cardLv", lambda x: "Lv." + x),
    "Form": ("form", str),
    "Attribute": ("attribute", str),
    "Type": ("type", str),
    "Rarity": ("rarity", str),
}

# Field mappings for extra info parsing
EXTRA_INFO_MAPPINGS = {
    "Card Effect": "effect",
    "Rule": "rule",
    "Inherited Effect": "digivolveEffect",
    "Security Effect": "securityEffect",
    "Ace": "aceEffect",
    "Link DP": "linkDP",
    "Link Effect": "linkEffect",
    "Link Requirements": "linkRequirement",
}


def splitCellsInPair(cells: List[str]) -> List[List[str]]:
    """
    Split a list of cells into pairs (header, value).

    Args:
        cells: List of cell text content

    Returns:
        List of [header, value] pairs
    """
    return [[cells[i], cells[i + 1]] for i in range(0, len(cells), 2)]


def set_nested_attribute(obj: Any, path: str, value: Any, transform_func=None) -> None:
    """
    Set a nested attribute on an object using dot notation.

    Args:
        obj: The object to set the attribute on
        path: Dot-separated path to the attribute (e.g., "name.english")
        value: The value to set
        transform_func: Optional function to transform the value before setting
    """
    if transform_func:
        value = transform_func(value)

    parts = path.split('.')
    current = obj
    for part in parts[:-1]:
        current = getattr(current, part)
    setattr(current, parts[-1], value)



def getMainInfo(html: Optional[Tag], digimoncard: DigimonCard) -> DigimonCard:
    """
    Extract main card information from HTML.

    Args:
        html: BeautifulSoup HTML element containing main card info
        digimoncard: DigimonCard object to populate

    Returns:
        Updated DigimonCard object
    """
    if html is None:
        return digimoncard

    # Get all the Data from the Table Cells
    cellData = []
    cells = html.find_all("td")
    for cell in cells:
        cellData.append(cell.text.replace("\n", "").strip())

    # Add all Data in Pairs of 2 (Header and Value)
    infoArray = splitCellsInPair(cellData)

    for header, value in infoArray:
        for key, (path, transform) in MAIN_INFO_MAPPINGS.items():
            if key in header:
                set_nested_attribute(digimoncard, path, value, transform)
                break

    return digimoncard


def addCorrectSpecialDigivolve(digimoncard: DigimonCard, specialDigivolve: Tag) -> None:
    """
    Add special digivolve information to the card based on the type.

    Args:
        digimoncard: DigimonCard object to update
        specialDigivolve: HTML element containing special digivolve info
    """
    td = specialDigivolve.find("td")
    if td is None:
        return

    text = td.text
    if 'DNA' in text:
        digimoncard.dnaDigivolve = text
    elif 'Burst' in text:
        digimoncard.burstDigivolve = text
    else:
        digimoncard.specialDigivolve = text


def getDigivolveInfo(html: Optional[Tag], digimoncard: DigimonCard) -> DigimonCard:
    """
    Extract digivolution information from HTML.

    Args:
        html: BeautifulSoup HTML element containing digivolve info
        digimoncard: DigimonCard object to populate

    Returns:
        Updated DigimonCard object
    """
    if html is None:
        return digimoncard

    # Process evolution conditions
    evoCons = html.find_all("table", class_="evocon")
    for evoCon in evoCons:
        cellData = []
        cells = evoCon.find_all("td")
        for cell in cells:
            cellData.append(cell.text.replace("\n", "").strip())
        infoArray = splitCellsInPair(cellData)

        newDigivolveCondition = DigivolveCondition()
        for header, value in infoArray:
            if header == 'Colour':
                newDigivolveCondition.color = value
            elif header in ['Level', 'Form']:
                newDigivolveCondition.level = value
            elif header == 'Digivolve Cost':
                newDigivolveCondition.cost = value
        digimoncard.digivolveCondition.append(newDigivolveCondition)

    # Process special evolution conditions
    specialEvoCons = html.find_all("table", class_="effect")
    for specialEvoCon in specialEvoCons:
        th = specialEvoCon.find("th")
        if th is None:
            continue

        specialEvo = th.text.replace("\n", "").strip()
        td = specialEvoCon.find("td")

        if td is None:
            continue

        if "DigiXros Requirements" in specialEvo:
            digimoncard.digiXros = td.text
        elif "Assembly Requirements" in specialEvo:
            digimoncard.assembly = td.text
        elif "Alt. Digivolution Requirements" in specialEvo:
            addCorrectSpecialDigivolve(digimoncard, specialEvoCon)

    return digimoncard


def getExtraInfo(html: Optional[Tag], digimoncard: DigimonCard) -> DigimonCard:
    """
    Extract extra card information from HTML.

    Args:
        html: BeautifulSoup HTML element containing extra card info
        digimoncard: DigimonCard object to populate

    Returns:
        Updated DigimonCard object
    """
    if html is None:
        return digimoncard

    tables = html.find_all("table")
    for table in tables:
        th = table.find("th")
        td = table.find("td")

        if th is None or td is None:
            continue

        header_text = th.text.strip()

        # Check against our mapping dictionary
        for key, attribute in EXTRA_INFO_MAPPINGS.items():
            if key in header_text:
                setattr(digimoncard, attribute, td.text)
                break

    return digimoncard


def getEnglishIllustrator(rows: List[Tag], digimoncard: DigimonCard) -> None:
    """
    Extract English illustrator information from table rows.

    Args:
        rows: List of HTML table row elements
        digimoncard: DigimonCard object to populate
    """
    for illustratorCount, row in enumerate(rows):
        cells = row.find_all("td")

        if not cells or illustratorCount == 0:
            continue

        # Ensure we have enough cells to process
        if len(cells) < 3:
            continue

        # The first Illustrator is the Main Illustrator
        if illustratorCount == 1:
            digimoncard.illustrator = cells[0].text
            digimoncard.notes = cells[1].text
        else:
            cell_type = cells[2].text if len(cells) > 2 else ""
            cell_note = cells[1].text

            # Pre-Release and Revision Packs don't count as AAs
            if 'Pre Release' in cell_type or 'Pre Release' in cell_note:
                aa_id = '_P0'
            elif 'Errata' in cell_type or 'Errata' in cell_note:
                aa_id = '-Errata'
            else:
                aa_id = f'_P{illustratorCount - 1}'

            digimoncard.AAs.append({
                'id': aa_id,
                'illustrator': cells[0].text,
                'note': cell_note,
                'type': cell_type
            })


def getJapaneseIllustrator(rows: List[Tag], digimoncard: DigimonCard) -> None:
    """
    Extract Japanese illustrator information from table rows.

    Args:
        rows: List of HTML table row elements
        digimoncard: DigimonCard object to populate
    """
    for illustratorCount, row in enumerate(rows):
        cells = row.find_all("td")

        if not cells or illustratorCount == 0:
            continue

        # Ensure we have enough cells to process
        if len(cells) < 3:
            continue

        if illustratorCount != 1:
            digimoncard.JAAs.append({
                'id': f'_P{illustratorCount - 1}',
                'illustrator': cells[0].text,
                'note': cells[1].text,
                'type': cells[2].text
            })


def getIllustratorsInfo(html: Optional[List[Tag]], digimoncard: DigimonCard) -> DigimonCard:
    """
    Extract illustrator information from HTML tables.

    Args:
        html: List of HTML table elements containing illustrator info
        digimoncard: DigimonCard object to populate

    Returns:
        Updated DigimonCard object
    """
    if html is None or len(html) == 0:
        return digimoncard

    # If len is 1 there is only a Japanese Release
    if len(html) == 1:
        rowsJ = html[0].find_all("tr")
        getJapaneseIllustrator(rowsJ, digimoncard)
    else:
        # The first Table is for English Sets
        rows = html[0].find_all("tr")
        # The second Table is for Japanese Sets
        rowsJ = html[1].find_all("tr")

        getEnglishIllustrator(rows, digimoncard)
        getJapaneseIllustrator(rowsJ, digimoncard)

    return digimoncard


def getRestrictedInfo(html: Optional[Tag], digimoncard: DigimonCard) -> DigimonCard:
    """
    Extract restriction and block information from HTML.

    Args:
        html: BeautifulSoup HTML element containing restriction info
        digimoncard: DigimonCard object to populate

    Returns:
        Updated DigimonCard object
    """
    if html is None:
        return digimoncard

    # The order of the restrictions is always the same (English, Japanese, Chinese, Korean)
    tds = html.find_all("td")

    if not tds or len(tds) < 5:
        return digimoncard

    digimoncard.restrictions.english = tds[0].text
    digimoncard.restrictions.japanese = tds[1].text
    digimoncard.restrictions.chinese = tds[2].text
    digimoncard.restrictions.korean = tds[3].text

    blocks = tds[4].find_all("span", class_="block_circle")
    for block in blocks:
        block_text = block.text.strip()
        if block_text != "-":
            digimoncard.block.append(block_text)

    return digimoncard


def setRarity(digimoncard: DigimonCard) -> DigimonCard:
    """
    Convert rarity text to abbreviated format.

    Args:
        digimoncard: DigimonCard object to update

    Returns:
        Updated DigimonCard object
    """
    digimoncard.rarity = RARITY_MAPPING.get(digimoncard.rarity, digimoncard.rarity)
    return digimoncard


def setCardImage(digimoncard: DigimonCard, url: str) -> DigimonCard:
    """
    Set card ID and image path from URL.

    Args:
        digimoncard: DigimonCard object to update
        url: Wiki URL for the card

    Returns:
        Updated DigimonCard object
    """
    splitUrl = url.split("/")
    if len(splitUrl) >= 3:
        card_id = splitUrl[2]
        digimoncard.id = card_id
        digimoncard.cardNumber = card_id
        digimoncard.cardImage = f'assets/images/cards/{card_id}.webp'

    return digimoncard

def getCardData() -> None:
    """
    Main function to extract card data from all wiki links.

    Processes each card link, extracts data, and adds to WV.cards list.
    """
    count = 0
    errors = []

    # Create a session for connection reuse (simple optimization)
    session = create_robust_session()

    print(f"📊 Processing {len(WV.cardLinks)} cards...")
    start_time = time.time()

    for link in WV.cardLinks:
        try:
            count += 1

            # Add delay between requests to be respectful to the server
            if count > 1:  # Skip delay for first request
                time.sleep(random.uniform(0.1, 0.3))

            # Use session instead of requests.get for better performance
            page = session.get(WV.wikiLink + link, timeout=20)
            page.raise_for_status()

            # Use lxml parser for better performance
            soup = BeautifulSoup(page.content, "lxml")

            currentDigimon = DigimonCard()

            cardTable = soup.find('div', class_='ctable')

            if cardTable is None:
                print(f"No Card Table found for: {link}")
                continue

            # Extract different sections of card information
            infoMain = cardTable.find("div", class_="info-main")
            infoDigivolve = cardTable.find("div", class_="info-digivolve")
            infoExtra = cardTable.find("div", class_="info-extra")
            infoRestricted = cardTable.find("div", class_="info-restricted")
            infoIllustrator = soup.find_all("table", class_="settable")

            # Process each section
            currentDigimon = getMainInfo(infoMain, currentDigimon)
            currentDigimon = getDigivolveInfo(infoDigivolve, currentDigimon)
            currentDigimon = getExtraInfo(infoExtra, currentDigimon)
            currentDigimon = getRestrictedInfo(infoRestricted, currentDigimon)
            currentDigimon = getIllustratorsInfo(infoIllustrator, currentDigimon)

            # Final processing
            currentDigimon = setRarity(currentDigimon)
            currentDigimon = setCardImage(currentDigimon, link)

            # Progress indicator every 50 cards
            if count % 50 == 0:
                elapsed = time.time() - start_time
                rate = count / elapsed if elapsed > 0 else 0
                print(f'⚡ [{count}/{WV.cardCount}] Progress: {count/WV.cardCount*100:.1f}% '
                      f'({rate:.1f} cards/sec)')
            else:
                print(f'[{count}/{WV.cardCount}] {currentDigimon.id} - {currentDigimon.name.english}')

            WV.cards.append(currentDigimon)

        except requests.exceptions.RequestException as e:
            error_msg = f"Network error for {link}: {e}"
            print(error_msg)
            errors.append(error_msg)
        except Exception as e:
            error_msg = f"Processing error for {link}: {e}"
            print(error_msg)
            errors.append(error_msg)

    # Final statistics
    total_time = time.time() - start_time
    success_count = len(WV.cards)

    print(f"\n✅ Card data extraction completed!")
    print(f"📈 Successfully processed: {success_count} cards")
    print(f"❌ Errors: {len(errors)}")
    print(f"⏱️  Total time: {total_time:.1f}s")
    print(f"🚀 Average speed: {success_count/total_time:.1f} cards/sec")

    if errors:
        print(f"\n⚠️  Recent errors:")
        for error in errors[-3:]:  # Show last 3 errors
            print(f"  - {error}")

def getCardDataFast() -> None:
    """
    Fast version using the optimized parallel fetcher.
    For maximum performance, use GetCardDataFast.py directly.
    """
    try:
        from GetCardDataFast import getCardDataOptimized
        print("🚀 Using optimized parallel card fetcher...")
        getCardDataOptimized("normal")
    except ImportError:
        print("⚠️  Fast fetcher not available, using standard method...")
        getCardData()
