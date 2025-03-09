import requests
from bs4 import BeautifulSoup
import asyncio
import aiohttp
from typing import Optional, List, Dict

from classes.DigimonCard import DigimonCard
from classes.DigivolveCondition import DigivolveCondition

import WikiVariables as WV

from GetLinks import fetch_page


def splitCellsInPair(cells):
  array = []
  for i in range(0, len(cells), 2):
    array.append([cells[i], cells[i + 1]])
  return array

async def process_single_card(session: aiohttp.ClientSession, link: str, count: int, total: int) -> Optional[DigimonCard]:
  """Process a single card asynchronously"""
  try:
    content = await fetch_page(session, WV.wikiLink + link)
    if not content:
      return None

    soup = BeautifulSoup(content, "html.parser")
    current_digimon = DigimonCard()

    card_table = soup.find('div', class_='ctable')
    if card_table is None:
      print(f"No Card Table found for: {link}")
      return None

    # Extract all required sections
    info_main = card_table.find("div", class_="info-main")
    info_digivolve = card_table.find("div", class_="info-digivolve")
    info_extra = card_table.find("div", class_="info-extra")
    info_restricted = card_table.find("div", class_="info-restricted")
    info_illustrator = soup.find_all("table", class_="settable")

    # Process all sections
    current_digimon = getMainInfo(info_main, current_digimon)
    current_digimon = getDigivolveInfo(info_digivolve, current_digimon)
    current_digimon = getExtraInfo(info_extra, current_digimon)
    current_digimon = getRestrictedInfo(info_restricted, current_digimon)
    current_digimon = getIllustratorsInfo(info_illustrator, current_digimon)
    
    current_digimon = setRarity(current_digimon)
    current_digimon = setCardImage(current_digimon, link)

    print(f'[{count}/{total}] {current_digimon.id} - {current_digimon.name.english}')
    return current_digimon

  except Exception as e:
    print(f"Error processing {link}: {e}")
    return None

async def getCardData(session: aiohttp.ClientSession, batch_size: int = 30, sleep_time: float = 0.1):
  """Get card data using concurrent requests"""
  total_cards = len(WV.cardLinks)
  processed_cards = []

  # Process cards in batches to control concurrency
  for i in range(0, total_cards, batch_size):
    batch_links = WV.cardLinks[i:i + batch_size]
    tasks = [
      process_single_card(session, link, i + idx + 1, total_cards)
      for idx, link in enumerate(batch_links)
    ]
    
    # Process batch concurrently
    batch_results = await asyncio.gather(*tasks)
    
    # Filter out None results and add successful ones
    valid_cards = [card for card in batch_results if card is not None]
    processed_cards.extend(valid_cards)
    
    # Optional: Add a small delay between batches to be nice to the server
    if i + batch_size < total_cards:  # Don't sleep after the last batch
      await asyncio.sleep(sleep_time)

  # Update WikiVariables with processed cards
  WV.cards = processed_cards
  print(f"Successfully processed {len(processed_cards)} out of {total_cards} cards")

def getMainInfo(html, digimoncard):
  if html == None:
    return digimoncard

  # Get all the Data from the Table Cells
  cellData = []
  cells = html.find_all("td")
  for cell in cells:
    cellData.append(cell.text.replace("\n", "").strip())

  # Add all Data in Pairs of 2 (Header and Value)
  infoArray = splitCellsInPair(cellData)

  for data in infoArray:
    if 'Name' in data[0]:
      digimoncard.name.english = data[1]
    if 'Japanese' in data[0]:
      digimoncard.name.japanese = data[1]
    if 'Traditional Chinese' in data[0]:
      digimoncard.name.traditionalChinese = data[1]
    if 'Simplified Chinese' in data[0]:
      digimoncard.name.simplifiedChinese = data[1]
    if 'Korean' in data[0]:
      digimoncard.name.korean = data[1]

    if 'Colour' in data[0]:
      digimoncard.color = data[1].replace(" / ", "/")
    if 'Card Type' in data[0]:
      digimoncard.cardType = data[1]
    if 'Play Cost' in data[0]:
      digimoncard.playCost = data[1]
    if 'Use Cost' in data[0]:
      digimoncard.playCost = data[1]
    if 'DP' in data[0]:
      digimoncard.dp = data[1].replace(" DP", "")
    if 'Level' in data[0]:
      digimoncard.cardLv = "Lv." + data[1]
    if 'Form' in data[0]:
      digimoncard.form = data[1]
    if 'Attribute' in data[0]:
      digimoncard.attribute = data[1]
    if 'Type' in data[0]:
      digimoncard.type = data[1]
    if 'Rarity' in data[0]:
      digimoncard.rarity = data[1]
  return digimoncard

def addCorrectSpecialDigivolve(digimoncard, specialDigivolve):
  td = specialDigivolve.find("td")
  if 'DNA' in td.text:
    digimoncard.dnaDigivolve = td.text
    return
  if 'Burst' in td.text:
    digimoncard.burstDigivolve = td.text
    return
  digimoncard.specialDigivolve = td.text

def getDigivolveInfo(html, digimoncard):
  if html == None:
    return digimoncard

  evoCons = html.find_all("table", class_="evocon")
  for evoCon in evoCons:
    cellData = []
    cells = evoCon.find_all("td")
    for cell in cells:
      cellData.append(cell.text.replace("\n", "").strip())
    infoArray = splitCellsInPair(cellData)

    newDigivolveCondition = DigivolveCondition()
    for data in infoArray:
      match (data[0]):
        case 'Colour':
          newDigivolveCondition.color = data[1]
        case 'Level':
          newDigivolveCondition.level = data[1]
        case 'Digivolve Cost':
          newDigivolveCondition.cost = data[1]
    digimoncard.digivolveCondition.append(newDigivolveCondition)

  specialEvoCons = html.find_all("table", class_="effect")
  for specialEvoCon in specialEvoCons:
    th = specialEvoCon.find("th")
    if th is not None:
      specialEvo = th.text.replace("\n", "")
      if (specialEvo.find("DigiXros Requirements") != -1):
        xrosHeart = specialEvoCon.find("td")
        digimoncard.digiXros = xrosHeart.text
      if (specialEvo.find("Link Requirements") != -1):
        linkRequirements = specialEvoCon.find("td")
        digimoncard.linkRequirement = linkRequirements.text
      if (specialEvo.find("Alt. Digivolution Requirements") != -1):
        addCorrectSpecialDigivolve(digimoncard, specialEvoCon)

  return digimoncard

def getExtraInfo(html, digimoncard):
  if html == None:
    return digimoncard

  tables = html.find_all("table")
  for table in tables:
    th = table.find("th")

    if th is None:
      return digimoncard

    if th.text.find("Card Effect") != -1:
      td = table.find("td")
      digimoncard.effect = td.text

    if th.text.find("Rule") != -1:
      td = table.find("td")
      digimoncard.rule += td.text

    if th.text.find("Inherited Effect") != -1:
      td = table.find("td")
      digimoncard.digivolveEffect = td.text

    if th.text.find("Security Effect") != -1:
      td = table.find("td")
      digimoncard.securityEffect = td.text

    if th.text.find("Ace") != -1:
      td = table.find("td")
      digimoncard.aceEffect = td.text

    if th.text.find("Linked DP") != -1:
      td = table.find("td")
      digimoncard.linkDP = td.text

    if th.text.find("Linked Effect") != -1:
      td = table.find("td")
      digimoncard.linkEffect = td.text

  return digimoncard

def getEnglishIllustrator(rows, digimoncard):
  illustratorCount = 0
  for row in rows:
    cells = row.find_all("td")

    if cells is None or illustratorCount == 0:
      illustratorCount += 1
      continue

    # The first Illustrator is the Main Illustrator
    if illustratorCount == 1:
      digimoncard.illustrator = cells[0].text
      digimoncard.notes = cells[1].text
    else:
      #Pre-Release and Revision Packs dont Count as AAs
      if 'Pre Release' in cells[2].text or 'Pre Release' in cells[1].text:
        illustratorCount -= 1
        digimoncard.AAs.append(
          {'id': '_P0', 'illustrator': cells[0].text, 'note': cells[1].text, 'type': cells[2].text})
      elif 'Errata' in cells[2].text or 'Errata' in cells[1].text:
        illustratorCount -= 1
        digimoncard.AAs.append(
          {'id': '-Errata', 'illustrator': cells[0].text, 'note': cells[1].text, 'type': cells[2].text})
      else:
        digimoncard.AAs.append(
          {'id': '_P' + str(illustratorCount - 1), 'illustrator': cells[0].text, 'note': cells[1].text,
           'type': cells[2].text})
    illustratorCount += 1

def getJapaneseIllustrator(rows, digimoncard):
  illustratorCount = 0
  for row in rows:
    cells = row.find_all("td")

    if cells is None or illustratorCount == 0:
      illustratorCount += 1
      continue

    if illustratorCount != 1:
      digimoncard.JAAs.append(
        {'id': '_P' + str(illustratorCount - 1), 'illustrator': cells[0].text, 'note': cells[1].text,
         'type': cells[2].text})
    illustratorCount += 1

def getIllustratorsInfo(html, digimoncard):
  if html == None or len(html) == 0:
    return digimoncard

  # If len is 1 there is only a japanese Release
  if len(html) == 1:
    rowsJ = html[0].find_all("tr")
    rows = None
    getJapaneseIllustrator(rowsJ, digimoncard)
  else:
    # The first Table is for English Sets
    rows = html[0].find_all("tr")
    # The second Table is for Japanese Sets
    rowsJ = html[1].find_all("tr")

    getEnglishIllustrator(rows, digimoncard)
    getJapaneseIllustrator(rowsJ, digimoncard)

  return digimoncard

def getRestrictedInfo(html, digimoncard):
  if html == None:
    return digimoncard

  # The order of the restrictions is always the same (English, Japanese, Chinese, Korean)
  tds = html.find_all("td")

  if tds is None:
    return digimoncard

  digimoncard.restrictions.english = tds[0].text
  digimoncard.restrictions.japanese = tds[1].text
  digimoncard.restrictions.chinese = tds[2].text
  digimoncard.restrictions.korean = tds[3].text

  blocks = tds[4].find_all("span", class_="block_circle")
  for block in blocks:
    if (block.text == "-"):
      continue
    digimoncard.block.append(block.text)

  return digimoncard

def setRarity(digimoncard):
  rarityDict = {
    "-": "-",
    "": "-",
    "Common": "C",
    "Uncommon": "U",
    "Rare": 'R',
    "Super Rare": 'SR',
    "Secret Rare": 'SEC',
    "Alternative Art": "AA",
    "Promo": "P",
    "Special Rare": "SP"
  }

  digimoncard.rarity = rarityDict[digimoncard.rarity]
  return digimoncard

def setCardImage(digimoncard, url):
  splitUrl = url.split("/")
  digimoncard.id = splitUrl[2]
  digimoncard.cardNumber = splitUrl[2]
  digimoncard.cardImage = digimoncard.id

  return digimoncard
