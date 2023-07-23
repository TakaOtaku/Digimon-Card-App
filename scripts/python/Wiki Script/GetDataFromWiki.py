import copy
import json
import requests
import urllib
from bs4 import BeautifulSoup

from DigimonCard import DigimonCard
from DigivolveCondition import DigivolveCondition

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

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

# Open Wiki and get all Links to all Cards


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

# Get the Data from the main table and return it as an digimon card


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

# Get digivolve requirements and return the digimon card


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

# Get all Card Effects (Normal, Digivolve, Security)


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

# TODO Add Illustrator AAs of Japanese Cards seperatly
# Get Illustrator Info, for now take the first one


def getIllustratorsInfo(html, digimoncard):
    if html == None or len(html) == 0:
        return digimoncard

    # The first Table is for English Sets
    rows = html[0].find_all("tr")

    if rows is None:
        return digimoncard

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
                    {'id': '_P' + str(illustratorCount-1), 'illustrator': cells[0].text, 'note': cells[1].text})
        illustratorCount += 1

    return digimoncard

# Get Restricted Info and Block


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

# Set Rarity to the format used on digimoncard.app


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

# Set ID and Download Base Image


def setImageAndDownload(digimoncard, url):
    splitUrl = url.split("/")
    digimoncard.id = splitUrl[2]
    digimoncard.cardNumber = splitUrl[2]
    digimoncard.cardImage = 'assets/images/cards/eng/' + \
        digimoncard.cardImage + digimoncard.id + ".webp"

    imagediv = soup.find("div", class_="image")
    if imagediv:
        image = imagediv.find("img")
    if (image is not None):
        imageSrc = image['src']
        # Change URL depending on if you want Japanese Cards or English Cards
        # urllib.request.urlretrieve(imageSrc, 'digimon-images/' + digimoncard.cardNumber + ".webp")
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
    with open('DigimonCards.json', 'r') as file:
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
    with open('DigimonCardsSetDictionary.json', 'w') as file:
        json.dump(sorted_cards_dict, file, indent=2, sort_keys=sort_key)


def replace_string_in_json(search_string, replaceString):
    # Open the JSON file and load its contents
    with open('DigimonCards.json', 'r') as file:
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
    with open('DigimonCards.json', 'w') as file:
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

# Open each Link for the Card Rulings to get all Rulings and add the corresponding ID


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


# Get all Links to all Cards
for wikiPageLink in wikiPageLinks:
    print('Getting Links for: ' + wikiPageLink['name'])
    getLinks(wikiPageLink)
print('Getting Promo Links')
getPromoLinks()
cardLinks = sorted(list(set(cardLinks)))

# Open each Link for the Cards and get the Data
cardCount = len(cardLinks)
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
for card in cards:
    if card.notes in NoteDictionary:
        card.notes = NoteDictionary[card.notes]

getRulings()

# Open each Link for the Card Gallery to get all AAs and set the Notes and add the corresponding Illustrator
# driver = webdriver.Chrome(executable_path='chromedriver.exe')
# for link in cardLinks:
#    page = requests.get(wikiLink + link + gallery)
#    soup = BeautifulSoup(page.content, "html.parser")
#
#    id = link.split("/")[2]
#    aa = ''
#
#    div = soup.find("div", id="gallery-0")
#    galleryItems = div.find_all("div", class_="wikia-gallery-item")
#
#    maxCount = len(galleryItems)  # Because 1 is the Normal Artwork
#    for item in galleryItems:
#        caption = item.find(
#            "div", class_="lightbox-caption").text.replace(' (EN)', '')
#
#    for count in range(0, maxCount):
#        newLink = ''
#        aa = ''
#        if count == 0:
#            aa = ''
#            newLink = wikiLink + link + '?file=' + id + '.png'
#        else:
#            aa = '_P' + str(count)
#            newLink = wikiLink + link + '?file=' + \
#                id + aa + '.png'
#
#        driver.get(newLink)
#
#        wait = WebDriverWait(driver, 10)
#        lightbox = wait.until(EC.presence_of_element_located(
#            (By.CLASS_NAME, 'WikiaLightbox')))
#
#        image = driver.find_element(
#            By.CLASS_NAME, "WikiaLightbox").find_element(By.TAG_NAME, 'img')
#        if image is not None:
#            imageSrc = image.get_attribute('src')
#            filePath = id + aa + ".webp"
#            urllib.request.urlretrieve(imageSrc, filePath)
# driver.close()


formatedCards = []
for card in cards:
    formatedCards.append(class_to_dict(card))

formatedCards = remove_underscores(formatedCards)

print('Saving DigimonCard JSON!')
with open('DigimonCards.json', 'w') as fp:
    json.dump(formatedCards, fp, indent=2, sort_keys=sort_key)

print('Saving Rulings JSON!')
with open('Rulings.json', 'w') as fp:
    json.dump(rulings, fp, indent=2, sort_keys=sort_key)


print('Formatting DigimonCard JSON!')
replace_string_in_json('\n', '')
replace_string_in_json(')[', ')\n[')
replace_string_in_json(').[', ')\n[')
replace_string_in_json('.[', '.\n[')
replace_string_in_json('＞＜', '＞\n＜')
replace_string_in_json(')＜', ')\n＜')
replace_string_in_json(')＜', '\n・')

# TODO Remove Keyword Text
print('Removing Keyword Explanations!')
replace_string_in_json('(Draw 1 card from your deck)', '')
replace_string_in_json(
    '(This Digimon can attack the turn it comes into play)', '')
replace_string_in_json(
    '(At blocker timing, by suspending this Digimon, it becomes the attack target)', '')
replace_string_in_json(
    '(Trash this card in your battle area to activate the effect below. You can\'t activate this effect the turn this card enters play.)', '')

print('Saving Set Dictionary!')
formatJsonToSetDictionary()
