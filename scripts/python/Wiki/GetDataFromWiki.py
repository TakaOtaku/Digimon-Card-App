import json
import time

import re

import requests
from bs4 import BeautifulSoup
import urllib.request

from DigimonCard import DigimonCard
from DigivolveCondition import DigivolveCondition

wikiLink = 'https://digimoncardgame.fandom.com'
promo = '/wiki/P-'
gallery = '/Gallery'
ruling = '/Rulings'
wikiPageLinks = [
    {'name': '▹RELEASE SPECIAL BOOSTER 1.0 [BT1-BT3]',
     'url': 'https://digimoncardgame.fandom.com/wiki/BT01-03:_Release_Special_Booster_Ver.1.0'},
    {'name': '▹RELEASE SPECIAL BOOSTER 1.5 [BT1-BT3]',
        'url': 'https://digimoncardgame.fandom.com/wiki/BT01-03:_Release_Special_Booster_Ver.1.5'},
    {'name': '▹BOOSTER GREAT LEGEND [BT4]',
        'url': 'https://digimoncardgame.fandom.com/wiki/BT-04:_Booster_Great_Legend'},
    {'name': '▹BOOSTER BATTLE OF OMNI [BT5]',
        'url': 'https://digimoncardgame.fandom.com/wiki/BT-05:_Booster_Battle_Of_Omni'},
    {'name': '▹BOOSTER DOUBLE DIAMOND [BT6]',
        'url': 'https://digimoncardgame.fandom.com/wiki/BT-06:_Booster_Double_Diamond'},
    {'name': '▹BOOSTER NEXT ADVENTURE [BT7]',
        'url': 'https://digimoncardgame.fandom.com/wiki/BT-07:_Booster_Next_Adventure'},
    {'name': '▹BOOSTER NEW AWAKENING [BT8]',
        'url': 'https://digimoncardgame.fandom.com/wiki/BT-08:_Booster_New_Awakening'},
    {'name': '▹BOOSTER X RECORD [BT9]',
        'url': 'https://digimoncardgame.fandom.com/wiki/BT-09:_Booster_X_Record'},
    {'name': '▹BOOSTER XROS ENCOUNTER [BT10]',
        'url': 'https://digimoncardgame.fandom.com/wiki/BT-10:_Booster_Xros_Encounter'},
    {'name': '▹BOOSTER DIMENSIONAL PHASE [BT11]',
        'url': 'https://digimoncardgame.fandom.com/wiki/BT-11:_Booster_Dimensional_Phase'},
    {'name': '▹BOOSTER ACROSS TIME [BT12]',
        'url': 'https://digimoncardgame.fandom.com/wiki/BT-12:_Booster_Across_Time'},
    {'name': '▹BOOSTER VERSUS ROYAL KNIGHT [BT13]',
        'url': 'https://digimoncardgame.fandom.com/wiki/BT-13:_Booster_Versus_Royal_Knights'},
    {'name': '▹BOOSTER BLAST ACE [BT14]',
        'url': 'https://digimoncardgame.fandom.com/wiki/BT-14:_Booster_Blast_Ace'},

    {'name': '▹THEME BOOSTER CLASSIC COLLECTION [EX1]',
        'url': 'https://digimoncardgame.fandom.com/wiki/EX-01:_Theme_Booster_Classic_Collection'},
    {'name': '▹THEME BOOSTER DIGITAL HAZARD [EX2]',
        'url': 'https://digimoncardgame.fandom.com/wiki/EX-02:_Theme_Booster_Digital_Hazard'},
    {'name': '▹THEME BOOSTER DRAGONIC ROAR [EX3]',
        'url': 'https://digimoncardgame.fandom.com/wiki/EX-03:_Theme_Booster_Draconic_Roar'},
    {'name': '▹THEME BOOSTER ALTERNATIVE BEING [EX4]',
        'url': 'https://digimoncardgame.fandom.com/wiki/EX-04:_Theme_Booster_Alternative_Being'},
    {'name': '▹THEME BOOSTER ANIMAL COLOSSEUM [EX5]',
        'url': 'https://digimoncardgame.fandom.com/wiki/EX-05:_Theme_Booster_Animal_Colosseum'},

    {'name': 'BOOSTER RESURGENCE BOOSTER [RB1]',
        'url': 'https://digimoncardgame.fandom.com/wiki/RB-01:_Resurgence_Booster'},

    {'name': 'STARTER DECK GAIA RED [ST1]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-1:_Starter_Deck_Gaia_Red'},
    {'name': 'STARTER DECK COCYTUS BLUE [ST2]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-2:_Starter_Deck_Cocytus_Blue'},
    {'name': 'STARTER DECK HEAVEN\'S Yellow[ST3]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-3:_Starter_Deck_Heaven%27s_Yellow'},
    {'name': 'STARTER DECK GIGA GREEN [ST4]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-4:_Starter_Deck_Giga_Green'},
    {'name': 'STARTER DECK MACHINE BLACK [ST5]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-5:_Starter_Deck_Machine_Black'},
    {'name': 'STARTER DECK VENOMOUS VIOLET [ST6]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-6:_Starter_Deck_Venomous_Violet'},
    {'name': 'STARTER DECK GALLANTMON [ST7]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-7:_Starter_Deck_Gallantmon'},
    {'name': 'STARTER DECK ULLFORCEVEEDRAMON [ST8]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-8:_Starter_Deck_UlforceVeedramon'},
    {'name': 'STARTER DECK ULTIMATE ANCIENT DRAGON [ST9]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-9:_Starter_Deck_Ultimate_Ancient_Dragon'},
    {'name': 'STARTER DECK PARALLEL WORLD TACTICIAN [ST10]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-10:_Starter_Deck_Parallel_World_Tactician'},
    {'name': 'STARTER DECK JESMON [ST12]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-12:_Starter_Deck_Jesmon'},
    {'name': 'STARTER DECK RAGNALOARDMON[ST13]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-13:_Starter_Deck_RagnaLoardmon'},
    {'name': 'ADVANCE DECK BEELZEMON [ST14]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-14:_Advanced_Deck_Set_Beelzemon'},
    {'name': 'STARTER DECK DRAGON OF COURAGE [ST15]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-15:_Starter_Deck_Dragon_of_Courage'},
    {'name': 'STARTER DECK WOLF OF FRIENDSHIP [ST16]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-16:_Starter_Deck_Wolf_of_Friendship'},
    {'name': 'STARTER DECK DOUBLE TYPHOON [ST17]',
        'url': 'https://digimoncardgame.fandom.com/wiki/ST-17:_Advanced_Deck_Set_Double_Typhoon'},

    {'name': 'LIMITED PACK DIGIMON GHOST GAME',
        'url': 'https://digimoncardgame.fandom.com/wiki/LM-01:_Limited_Pack_Digimon_Ghost_Game'}
]

NoteDictionary = {
    'BT01-03: Release Special Booster Ver.1.0': '▹RELEASE SPECIAL BOOSTER 1.0 [BT01-B0T3]',
    'BT01-03: Release Special Booster Ver.1.5': '▹RELEASE SPECIAL BOOSTER 1.5 [BT01-B0T3]',
    'BT-04: Booster Great Legend': '▹BOOSTER GREAT LEGEND [BT04]',
    'BT-05: Booster Battle Of Omni': '▹BOOSTER BATTLE OF OMNI [BT05]',
    'BT-06: Booster Double Diamond': '▹BOOSTER DOUBLE DIAMOND [BT06]',
    'BT-07: Booster Next Adventure': '▹BOOSTER NEXT ADVENTURE [BT07]',
    'BT-08: Booster New Awakening': '▹BOOSTER NEW AWAKENING [BT08]',
    'BT-09: Booster X Record': '▹BOOSTER X RECORD [BT09]',
    'BT-10: Booster Xros Encounter': '▹BOOSTER XROS ENCOUNTER [BT10]',
    'BT-11: Booster Dimensional Phase': '▹BOOSTER DIMENSIONAL PHASE [BT11]',
    'BT-12: Booster Across Time': '▹BOOSTER ACROSS TIME [BT12]',
    'BT-13: Booster Versus Royal Knights': '▹BOOSTER VERSUS ROYAL KNIGHT [BT13]',
    'BT-14: Booster Blast Ace': '▹BOOSTER BLAST ACE [BT14]',

    'EX-01: Theme Booster Classic Collection': '▹THEME BOOSTER CLASSIC COLLECTION [EX01]',
    'EX-02: Theme Booster Digital Hazard': '▹THEME BOOSTER DIGITAL HAZARD [EX02]',
    'EX-03: Theme Booster Draconic Roar': '▹THEME BOOSTER DRAGONIC ROAR [EX03]',
    'EX-04: Theme Booster Alternative Being': '▹THEME BOOSTER ALTERNATIVE BEING [EX04]',
    'EX-05: Theme Booster Animal Colosseum': '▹THEME BOOSTER ANIMAL COLOSSEUM [EX05]',

    'RB-01: Resurgence Booster': 'BOOSTER RESURGENCE BOOSTER [RB01]',

    'ST-1: Starter Deck Gaia Red': 'STARTER DECK GAIA RED [ST01]',
    'ST-2: Starter Deck Cocytus Blue': 'STARTER DECK COCYTUS BLUE [ST02]',
    'ST-3: Starter Deck Heaven\'s Yellow': 'STARTER DECK HEAVEN\'S Yellow[ST03]',
    'ST-4: Starter Deck Giga Green': 'STARTER DECK GIGA GREEN [ST04]',
    'ST-5: Starter Deck Machine Black': 'STARTER DECK MACHINE BLACK [ST05]',
    'ST-6: Starter Deck Venomous Violet': 'STARTER DECK VENOMOUS VIOLET [ST06]',
    'ST-7: Starter Deck Gallantmon': 'STARTER DECK GALLANTMON [ST07]',
    'ST-8: Starter Deck UlforceVeedramon': 'STARTER DECK ULLFORCEVEEDRAMON [ST08]',
    'ST-9: Starter Deck Ultimate Ancient Dragon': 'STARTER DECK ULTIMATE ANCIENT DRAGON [ST09]',
    'ST-10: Starter Deck Parallel World Tactician': 'STARTER DECK PARALLEL WORLD TACTICIAN [ST10]',
    'ST-12: Starter Deck Jesmon': 'STARTER DECK JESMON [ST12]',
    'ST-13: Starter Deck RagnaLoardmon': 'STARTER DECK RAGNALOARDMON[ST13]',
    'ST-14: Advanced Deck Set Beelzemon': 'ADVANCE DECK BEELZEMON [ST14]',
    'ST-15: Starter Deck Dragon of Courage': 'STARTER DECK DRAGON OF COURAGE [ST15]',
    'ST-16: Starter Deck Wolf of Friendship': 'STARTER DECK WOLF OF FRIENDSHIP [ST16]',
    'ST-17: Advanced Deck Set Double Typhoon': 'STARTER DECK DOUBLE TYPHOON [ST17]',

    'LM-01: Limited Pack Digimon Ghost Game': 'LIMITED PACK DIGIMON GHOST GAME [LM01]',
}

cardLinks = []
normalCards = []
cards = []
rulings = {}


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
            cardLinks.append(cardLink["href"])


def getPromoLinks():
    promolink = wikiLink + promo
    max_id = 999

    for i in range(max_id + 1):
        if i == 0:
            continue

        url = f"{promolink}{i:03}"

        print(f"Checking {url}")

        page = requests.get(url)
        soup = BeautifulSoup(page.content, "html.parser")

        cardTable = soup.find('div', class_='ctable')

        if cardTable is not None:
            cardLinks.append(f"/wiki/P-{i:03}")
        else:
            print(f"Link doesn't exist: {url}")
            break  # Stop the loop when you encounte


def splitCellsInPair(cells):
    array = []
    for i in range(0, len(cells), 2):
        array.append([cells[i], cells[i + 1]])
    return array


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
                digimoncard.digiXros = specialEvo
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

        if th.text.find("Inherited Effect") != -1:
            td = table.find("td")
            digimoncard.digivolveEffect = td.text

        if th.text.find("Security Effect") != -1:
            td = table.find("td")
            digimoncard.digivolveEffect = td.text

        if th.text.find("Ace") != -1:
            td = table.find("td")
            digimoncard.aceEffect = td.text

    return digimoncard


def getEnglishIllustrator(rows, digimoncard):
    illustratorCount = 0
    for row in rows:
        cells = row.find_all("td")

        if cells is None or illustratorCount == 0:
            illustratorCount += 1
            continue

        if illustratorCount == 1:
            digimoncard.illustrator = cells[0].text
            digimoncard.notes = cells[1].text
        else:
            if 'Pre Release' in cells[2].text:
                illustratorCount -= 1
                digimoncard.AAs.append(
                    {'id': '_P0', 'illustrator': cells[0].text, 'note': cells[1].text, 'preRelease': cells[2].text})
            else:
                digimoncard.AAs.append(
                    {'id': '_P' + str(illustratorCount - 1), 'illustrator': cells[0].text, 'note': cells[1].text})
        illustratorCount += 1


def getJapaneseIllustrator(rows, digimoncard):
    illustratorCount = 0
    for row in rows:
        cells = row.find_all("td")

        if cells is None or illustratorCount == 0:
            illustratorCount += 1
            continue

        if illustratorCount != 1:
            if 'Pre Release' in cells[2].text:
                illustratorCount -= 1
                digimoncard.JAAs.append(
                    {'id': '_P0', 'illustrator': cells[0].text, 'note': cells[1].text, 'preRelease': cells[2].text})
            else:
                digimoncard.JAAs.append(
                    {'id': '_P' + str(illustratorCount - 1), 'illustrator': cells[0].text, 'note': cells[1].text})
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
        "Promo": "P"
    }

    digimoncard.rarity = rarityDict[digimoncard.rarity]
    return digimoncard


def setImageAndDownload(digimoncard, url):
    splitUrl = url.split("/")
    digimoncard.id = splitUrl[2]
    digimoncard.cardNumber = splitUrl[2]
    digimoncard.cardImage = 'assets/images/cards/' + \
                            digimoncard.cardImage + digimoncard.id + ".webp"

    return digimoncard


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
    with open('jsons/DigimonCards.json', 'r') as file:
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
    with open('jsons/DigimonCardsSetDictionary.json', 'w') as file:
        json.dump(sorted_cards_dict, file, indent=2, sort_keys=sort_key)


def replace_string_in_json(search_string, replaceString):
    # Open the JSON file and load its contents
    with open('jsons/DigimonCards.json', 'r') as file:
        data = json.load(file)

    # Replace the search_string with replace_string recursively in the JSON data
    def replace_string(obj):
        if isinstance(obj, dict):
            return {key: replace_string(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [replace_string(item) for item in obj]
        elif isinstance(obj, str):
            return obj.replace(search_string, replaceString)
        else:
            return obj

    updated_data = replace_string(data)

    # Save the updated JSON back to the file
    with open('jsons/DigimonCards.json', 'w') as file:
        json.dump(updated_data, file, indent=2, sort_keys=sort_key)


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


def download_image_with_retry(url, save_directory, id, max_retries=5, retry_delay=5):
    retries = 0

    while retries < max_retries:
        try:
            urllib.request.urlretrieve(url, save_directory)
            print(f"Downloaded image ${id} successfully.")
            return
        except urllib.error.HTTPError as e:
            if e.code == 503:
                print(
                    f"HTTP Error 503: Service Unavailable. Retrying in {retry_delay} seconds...")
                retries += 1
                time.sleep(retry_delay)
            else:
                print(f"HTTP Error {e.code}: {e.reason}")
                break

    print("Failed to download the image after multiple attempts.")


def remove_suffix_and_extension(input_string):
    # Remove the ".webp" extension
    without_extension = re.sub(r'\.png$', '', input_string)

    # Remove the "_Px" suffix (where x can be any number)
    without_suffix = re.sub(r'_P\d+', '', without_extension)

    return without_suffix


def remove_item_at_index(arr, index):
    if index < 0 or index >= len(arr):
        raise IndexError("Index out of range")

    arr.pop(index)
    return arr

# Open each Link for the Cards and get the Data


def getCardData():
    count = 0
    for link in cardLinks:
        count += 1

        page = requests.get(wikiLink + link)
        soup = BeautifulSoup(page.content, "html.parser")

        currentDigimon = DigimonCard()

        cardTable = soup.find('div', class_='ctable')

        if cardTable is None:
            print("No Card Table found for: " + link)
            continue

        infoMain = cardTable.find("div", class_="info-main")
        infoDigivolve = cardTable.find("div", class_="info-digivolve")
        infoExtra = cardTable.find("div", class_="info-extra")
        infoRestricted = cardTable.find("div", class_="info-restricted")

        infoIllustrator = soup.find_all("table", class_="settable")

        currentDigimon = getMainInfo(infoMain, currentDigimon)
        currentDigimon = getDigivolveInfo(infoDigivolve, currentDigimon)
        currentDigimon = getExtraInfo(infoExtra, currentDigimon)
        currentDigimon = getRestrictedInfo(infoRestricted, currentDigimon)

        currentDigimon = getIllustratorsInfo(infoIllustrator, currentDigimon)

        currentDigimon = setRarity(currentDigimon)
        currentDigimon = setImageAndDownload(currentDigimon, link)

        print('[' + str(count) + '/' + str(cardCount) + ']' +
              currentDigimon.id + ' - ' + currentDigimon.name.english)
        cards.append(currentDigimon)

# Add correct note to each Card


def setNotes():
    for card in cards:
        if card.notes in NoteDictionary:
            card.notes = NoteDictionary[card.notes]


def getRulings():
    rulingCount = 0
    for link in cardLinks:
        rulingCount += 1
        page = requests.get(wikiLink + link + ruling)
        soup = BeautifulSoup(page.content, "html.parser")

        id = link.split("/")[2]

        questions = soup.find_all("div", class_="ruling-question")
        answers = soup.find_all("div", class_="ruling-answer")

        if len(questions) == 0:
            print('Rulings for: ' + id + ' - Found ' +
                  str(len(questions)) + ' Rulings')
            continue

        rulings[id] = []

        questionCount = 0
        for question in questions:
            questionText = question.text
            answerText = answers[questionCount].text
            rulings[id].append(
                {'question': questionText, 'answer': answerText})
            questionCount += 1
        print('[' + str(rulingCount) + '/' + str(cardCount) + ']')
        print('Rulings for: ' + id + ' - Found ' +
              str(len(questions)) + ' Rulings')

    print('Saving Rulings JSON!')
    with open('jsons/Rulings.json', 'w') as fp:
        json.dump(rulings, fp, indent=2, sort_keys=sort_key)


def formatCards():
    formatedCards = []
    for card in cards:
        formatedCards.append(class_to_dict(card))

    formatedCards = remove_underscores(formatedCards)
    print('Saving DigimonCard JSON!')
    with open('jsons/DigimonCards.json', 'w') as fp:
        json.dump(formatedCards, fp, indent=2, sort_keys=sort_key)


# Get all Links to all Cards
for wikiPageLink in wikiPageLinks:
    print('Getting Links for: ' + wikiPageLink['name'])
    getLinks(wikiPageLink)
print('Getting Promo Links')
getPromoLinks()
cardLinks = sorted(list(set(cardLinks)))
cardCount = len(cardLinks)

getCardData()

# getRulings()

backupAAs = []
backupJAAs = []
for link in cardLinks:
    print('Checking' + link)
    backupAAs = []
    page = requests.get(wikiLink + link + gallery)
    soup = BeautifulSoup(page.content, "html.parser")

    id = link.split("/")[2]
    idWithoutP = remove_suffix_and_extension(id)

    card = None
    for obj in cards:
        if obj.id == idWithoutP:
            card = obj
    if card is None:
        continue

    backupAAs = card.AAs
    backupJAAs = card.JAAs

    # Remove the AAs or the JAAs from the Card
    card.AAs = []
    card.JAAs = []

    # English Gallery
    div = soup.find("div", id="gallery-0")
    if div is not None:
        galleryItems = div.find_all("div", class_="wikia-gallery-item")

        for item in galleryItems:
            img = item.find("img")
            if img is None:
                continue

            idWithP = re.sub(r'\.png$', '', img['data-image-key'])
            src = img['src'].split("/latest")[0]

            saveLocation = src + '/latest'
            saveLocation = saveLocation.replace('-j', '-J')

            download_image_with_retry(saveLocation, 'digimon-images/' + img['data-image-key'], img['data-image-key'])

            captions = item.find("div", class_="lightbox-caption")
            notes = captions.find_all("a")

            if notes is None or len(notes) == 0:
                continue

            noteArray = []
            for note in notes:
                noteArray.append(note.text)
            combined_notes = " / ".join(noteArray)

            # The NA
            if card.notes == noteArray[0]:
                card.notes = combined_notes
            # The AAs
            for aa in backupAAs:
                if aa['note'] == noteArray[0]:
                    if '_P' in idWithP:
                        newAA = {
                            'id': idWithP, 'illustrator': aa['illustrator'], 'note': combined_notes}
                        card.AAs.append(newAA)
                    else:
                        card.notes = combined_notes
    # Japanese Gallery
    divJ = soup.find("div", id="gallery-1")
    if divJ is not None:
        galleryItemsJ = divJ.find_all("div", class_="wikia-gallery-item")

        for item in galleryItemsJ:
            img = item.find("img")
            if img is None:
                continue

            idWithP = re.sub(r'\.png$', '', img['data-image-key'])
            src = img['src'].split("/latest")[0]

            saveLocation = src + '/latest'
            saveLocation = saveLocation.replace('-j', '-J')

            download_image_with_retry(saveLocation, 'digimon-images/' + img['data-image-key'], img['data-image-key'])

            captions = item.find("div", class_="lightbox-caption")
            notes = captions.find_all("a")

            if notes is None or len(notes) == 0:
                continue

            noteArray = []
            for note in notes:
                noteArray.append(note.text)
            combined_notes = " / ".join(noteArray)

            # NA
            if card.notes == noteArray[0]:
                card.notes = combined_notes
            # AAs
            for aa in backupJAAs:
                if aa['note'] == noteArray[0]:
                    if '_P' in idWithP:
                        newAA = {
                            'id': idWithP, 'illustrator': aa['illustrator'], 'note': combined_notes}
                        card.JAAs.append(newAA)
                    else:
                        card.notes = combined_notes
    index = 0
    for obj in cards:
        if obj.id == card.id:
            cards[index] = card
        index += 1

setNotes()

formatCards()

print('Formatting DigimonCard JSON!')
replace_string_in_json('\n', '')
replace_string_in_json(')[', ')\n[')
replace_string_in_json(') [', ')\n[')
replace_string_in_json(').[', ')\n[')
replace_string_in_json(') .[', ')\n[')
replace_string_in_json('.[', '.\n[')
replace_string_in_json('. [', '.\n[')
replace_string_in_json('＞＜', '＞\n＜')
replace_string_in_json(')＜', ')\n＜')
replace_string_in_json(') ＜', ')\n＜')
replace_string_in_json('・', '\n・')
replace_string_in_json(')＜', '\n・')
replace_string_in_json(') ＜', '\n・')
replace_string_in_json('.＜', '.\n＜')
replace_string_in_json('＞.', '＞\n')

print('Removing Keyword Explanations!')

replacements = [
    '(This Digimon can attack the turn it comes into play)',
    '(At blocker timing, by suspending this Digimon, it becomes the attack target)',
    '(Trash this card in your battle area to activate the effect below. You can\'t activate this effect the turn this card enters play.)',
    '(When this Digimon attacks and deletes an opponent\'s Digimon and survives the battle, it performs any security checks it normally would)',
    '(Place the top card of your deck on top of your security stack)',
    '(This Digimon can\'t be deleted in battles against Security Digimon)',
    '(Trash all of the digivolution cards on that Digimon.)',
    '(This Digimon checks 1 additional security card.)',
    '(This Digimon checks 1 fewer security cards)',
    '(This Digimon checks 1 additional security card)',
    '(This Digimon checks 2 fewer security cards)',
    '(This Digimon checks 3 fewer security cards)',
    '(This Digimon checks 2 additional security cards)',
    '(Trash up to 2 cards from the top of one of your opponent\'s Digimon. If it has no digivolution cards, or becomes a level 3 Digimon, you can\'t trash any more cards)',
    '(Unsuspend this Digimon during your opponent\'s unsuspend phase)',
    '(Trash up to 4 cards from the top of one of your opponent\'s Digimon. If it has no digivolution cards, or becomes a level 3 Digimon, you can\'t trash any more cards)',
    '(Draw 1 card from your deck.)',
    '(Draw 1 card from your deck)',
    '(Draw 2 cards from your deck)',
    '(Draw 3 cards from your deck)',
    '(When one of your Digimon digivolves into this card from your hand, you may suspend 1 of your Digimon to reduce the memory cost of the digivolution by 2)',
    '(When one of your Digimon digivolves into this card from your hand, you may suspend 1 of your Digimon to reduce the memory cost of the digivolution by 3)',
    '(Trash up to 1 card from the top of one of your opponent\'s Digimon. If it has no digivolution cards, or becomes a level 3 Digimon, you can\'t trash any more cards)',
    '(When this Digimon is deleted after losing a battle, delete the Digimon it was battling)',
    '(This Digimon checks 1 fewer security card)',
    '(Trash all of its digivolution cards.)',
    '(This Digimon can attack the turn it comes into play)',
    '(When this Digimon would be deleted, you may trash the top card of this Digimon to prevent that deletion)',
    '(You may place this card under one of your Tamers)',
    '(If your opponent has 1 or more memory, this Digimon may attack)',
    '(When this Digimon would be deleted, you may place 1 card in this Digimon\'s DigiXros requirements from this Digimon\'s digivolution cards under 1 of your Tamers)',
    '(When this Digimon would be deleted, you may place 2 cards in this Digimon\'s DigiXros requirements from this Digimon\'s digivolution cards under 1 of your Tamers)',
    '(When this Digimon would be deleted, you may place 3 cards in this Digimon\'s DigiXros requirements from this Digimon\'s digivolution cards under 1 of your Tamers)',
    '(When this Digimon would be deleted, you may place 4 cards in this Digimon\'s DigiXros requirements from this Digimon\'s digivolution cards under 1 of your Tamers)',
    '(When one of your other Digimon with [Bagra Army]\u00a0trait would be deleted by an opponent\'s effect, you may delete this Digimon to prevent that deletion)',
    '(When this Digimon attacks, you may switch the target of attack to 1 of your opponent\'s unsuspended Digimon with the highest DP)',
    '(When this Digimon would be deleted, you may suspend it to prevent that deletion)',
    '(When this Digimon would be deleted in battle, by trashing the top card of your security stack, prevent that deletion)',
    '(Your Digimon may digivolve into this card without paying the cost)',
    '(When this card is sent from battle area or under your card to another area, lose 3 memory',
    '(Place this Tamer under 1 of your Digimon without a Tamer in its digivolution cards)',
    '(Place the top 2 cards of your deck on top of your security stack)',
    '(You may trash 1 of this Digimon\'s digivolution cards to activate the effect below)',
    '(You may trash 2 of this Digimon\'s digivolution cards to activate the effect below)',
    '(You may trash 4 of this Digimon\'s digivolution cards to activate the effect below)',
    '(When this Digimon is deleted after losing a battle, delete the Digimon it was battling.)',
    '(When this Digimon attacks, by suspending 1 of your other Digimon, add the suspended Digimon\'s DP to this Digimon and it gains \uff1cSecurity Attack +1\uff1e for the attack)',
    '(Trash up to 3 cards from the top of one of your opponent\'s Digimon. If it has no digivolution cards, or becomes a level 3 Digimon, you can\'t trash any more cards)',
    '(When one of your Digimon digivolves into this card from your hand, you may suspend 1 of your Digimon to reduce the memory cost of the digivolution by 3)',
    '(You may trash 3 of this Digimon\'s digivolution cards to activate the effect below)',
    '(When your other black Digimon would be deleted by an opponent\'s effect, you may delete this Digimon to prevent you may delete this Digimon to prevent 1 of those Digimon\'s deletion)',
    '(You may trash up to 4 of this Digimon\'s digivolution cards to activate the effect below)',
    '(When one of your other Digimon with [D-Brigade]\u00a0trait would be deleted by an opponent\'s effect, you may delete this Digimon to prevent that deletion)',
    '(When this card is sent from battle area or under your card to another area, lose 4 memory)',
    '(When this Digimon is deleted while it has digivolution cards, play it without paying its cost)'
]

for replacement in replacements:
    replace_string_in_json(replacement, '')

replace_string_in_json('  ', '')
replace_string_in_json('  ', '')
replace_string_in_json('  ', '')
replace_string_in_json('  ', '')
replace_string_in_json(' .', '.')

# Remove all AAs and JAAs from every Card that include Sample in the id
with open('jsons/DigimonCards.json', 'r') as file:
    data = json.load(file)

    for card in data:
        for aa in card['AAs']:
            if 'Sample' in aa['id']:
                card['AAs'].remove(aa)
        for jaa in card['JAAs']:
            if 'Sample' in jaa['id']:
                card['JAAs'].remove(jaa)

    # Save the updated JSON back to the file
    with open('jsons/DigimonCards.json', 'w') as file:
        json.dump(data, file, indent=2, sort_keys=sort_key)
