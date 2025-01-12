import copy
import json
import requests
import urllib
from bs4 import BeautifulSoup

# 'https://digimoncardgame.fandom.com/wiki/ST-14:_Advanced_Deck_Beelzemon/Gallery#Japanese'

wikiLink = 'https://digimoncardgame.fandom.com'
wikiPageLinks = [
    # 'https://digimoncardgame.fandom.com/wiki/Digimon_Illustration_Competition_Promotion_Pack'
    # 'https://digimoncardgame.fandom.com/wiki/PB-12E:_Digimon_Card_Game_2nd_Anniversary_Set#Card_List'
    # 'https://digimoncardgame.fandom.com/wiki/BT-12:_Booster_Across_Time',
    # 'https://digimoncardgame.fandom.com/wiki/BT-13:_Booster_Versus_Royal_Knights'
    # 'https://digimoncardgame.fandom.com/wiki/ST-14:_Advanced_Deck_Beelzemon'
    # 'https://digimoncardgame.fandom.com/wiki/EX-04:_Theme_Booster_Alternative_Being',
    # 'https://digimoncardgame.fandom.com/wiki/RB-01:_Reboot_Booster_Rising_Wind'
    # 'https://digimoncardgame.fandom.com/wiki/ST-15:_Starter_Deck_Dragon_of_Courage',
    # 'https://digimoncardgame.fandom.com/wiki/ST-16:_Starter_Deck_Wolf_of_Friendship'
    'https://digimoncardgame.fandom.com/wiki/LM-01:_Limited_Pack_Digimon_Ghost_Game'
]
setName = "▹LIMITED PACK DIGIMON GHOST GAME [LM-01]"
cardLinks = []
NormalCards = []
AACards = []
cards = []


# Get all Tables and add the Links to the cards to an Array
def getLinksFromWiki():
    for wikiPage in wikiPageLinks:
        page = requests.get(wikiPage)
        soup = BeautifulSoup(page.content, "html.parser")

        cardLists = soup.find_all("table", class_="cardlist")

        for cardList in cardLists:
            cardLinksUnfiltered = cardList.find_all("a")
            # Filter Card Links for all <a></a> tags that don't contain "Card_Types" in their link
            for cardLink in cardLinksUnfiltered:
                if "Card_Types" not in cardLink["href"]:
                    cardLinks.append(cardLink["href"])


# Iterate through the card links and put them in normal array and if already there in the aa array
def splitCardsForNormalAndAA():
    for cardLink in cardLinks:
        if cardLink not in NormalCards:
            NormalCards.append(cardLink)
        else:
            AACards.append(cardLink)


# Get the Data from the main table and return it as an digimon card
def getMainInfo(html, digimoncard):
    if html == None:
        return digimoncard

    cellData = []
    cells = html.find_all("td")
    for cell in cells:
        cellData.append(cell.text.replace("\n", "").strip())

    infoArray = []

    for i in range(0, len(cellData), 2):
        infoArray.append([cellData[i], cellData[i + 1]])

    for data in infoArray:
        match (data[0]):
            case 'Name':
                digimoncard['name'] = data[1]
            case 'Colour':
                digimoncard['color'] = data[1].replace(" / ", "/")
            case 'Card Type':
                digimoncard['cardType'] = data[1]
            case 'Play Cost':
                digimoncard['playCost'] = data[1]
            case 'Use Cost':
                digimoncard['playCost'] = data[1]
            case 'DP':
                digimoncard['dp'] = data[1].replace(" DP", "")
            case 'Level':
                digimoncard['cardLv'] = "Lv." + data[1]
            case 'Form':
                digimoncard['form'] = data[1]
            case 'Attribute':
                digimoncard['attribute'] = data[1]
            case 'Type':
                digimoncard['type'] = data[1]
            case 'Rarity':
                digimoncard['rarity'] = data[1]
    return digimoncard


# Get digivolve requirements and return the digimon card
def getDigivolveInfo(html, digimoncard):
    if html == None:
        return digimoncard
    evoCons = html.find_all("table", class_="evocon")
    specialEvoCons = html.find_all("table", class_="effect")

    evoNumber = 1
    for evoCon in evoCons:
        cells = evoCon.find_all("td")
        digimoncard["digivolveColor" +
                    str(evoNumber)] = cells[1].text.replace("\n", "").strip()
        digimoncard["digivolveCost" +
                    str(evoNumber)] = cells[5].text.replace("\n", "").strip() + ' from Lv.' + cells[3].text.replace("\n",
                                                                                                                    "").strip()
        digimoncard["digivolveLevel" +
                    str(evoNumber)] = cells[3].text.replace("\n", "").strip()
        evoNumber += 1

    for specialEvoCon in specialEvoCons:
        cells = specialEvoCon.find_all("b")
        if len(cells) > 0:
            specialEvo = cells[0].text.replace("\n", "")
            if (specialEvo.find("DNA Digivolution") != -1):
                digimoncard['dnaDigivolve'] = specialEvo
            if (specialEvo.find("Digivolve") != -1):
                digimoncard['specialDigivolve'] = specialEvo

    return digimoncard


def getExtraInfo(html, digimoncard):
    if html == None:
        return digimoncard
    tables = html.find_all("table")
    for table in tables:
        th = table.find("th")
        # if th includes Card Effect
        if th is not None and th.text.find("Card Effect") != -1:
            td = table.find("td")
            digimoncard['effect'] = td.text.replace("\n", "").strip()
        if th is not None and th.text.find("Inherited Effect") != -1:
            td = table.find("td")
            digimoncard['digivolveEffect'] = td.text.replace("\n", "").strip()
        if th is not None and th.text.find("Security Effect") != -1:
            td = table.find("td")
            digimoncard['digivolveEffect'] = td.text.replace("\n", "").strip()
        if th is not None and th.text.find("Rule") != -1:
            td = table.find("td")
            digimoncard['rule'] = td.text.replace("\n", "").strip()
 
     return digimoncard

 
def getIllustratorsInfo(html, digimoncard):
    if html == None:
        return digimoncard
    tr = html.find_all("tr")
    # if th includes Card Effect
    if tr[1] is not None:
        td = tr[1].find_all("td")
        if td[0] is not None:
            digimoncard['illustrator'] = td[0].text.replace("\n", "").strip()

    return digimoncard


def getCardDataFromWiki():
    for url in NormalCards:
        print("Getting Data for:" + url)
        page = requests.get(wikiLink + url)
        soup = BeautifulSoup(page.content, "html.parser")

        infoMain = soup.find("div", class_="info-main")
        infoDigivolve = soup.find("div", class_="info-digivolve")
        infoExtra = soup.find("div", class_="info-extra")
        infoSets = soup.find("table", class_="settable")

        digimoncard = {
            "id": "-",
            "name": "-",
            "cardImage": "assets/images/cards/jap/",
            "cardType": "-",
            "dp": "-",
            "playCost": "-",
            "digivolveCost1": "-",
            "digivolveColor1": "-",
            "digivolveLevel1": "-",
            "digivolveCost2": "-",
            "digivolveColor2": "-",
            "digivolveLevel2": "-",
            "cardLv": "-",
            "form": "-",
            "attribute": "-",
            "type": "-",
            "rarity": "-",
            "cardNumber": "-",
            "digiXros": "-",
            "specialDigivolve": "-",
            "dnaDigivolve": "-",
            "effect": "-",
            "digivolveEffect": "-",
            "securityEffect": "-",
            "aceEffect": '-',
            "notes": setName,
            "color": "-",
            "version": "Normal",
            "illustrator": "-",
            "block": ["03"],
            "restriction": "-",
            "rule", "-",
        }

        digimoncard = getMainInfo(infoMain, digimoncard)
        digimoncard = getDigivolveInfo(infoDigivolve, digimoncard)
        digimoncard = getExtraInfo(infoExtra, digimoncard)

        digimoncard = getIllustratorsInfo(infoSets, digimoncard)

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

        digimoncard['rarity'] = rarityDict[digimoncard['rarity']]

        splitUrl = url.split("/")
        digimoncard['id'] = splitUrl[2]
        digimoncard['cardNumber'] = splitUrl[2]
        digimoncard['cardImage'] = digimoncard['cardImage'] + \
            digimoncard['id'] + ".webp"

        imagediv = soup.find("div", class_="image")
        if imagediv:
            image = imagediv.find("img")
        if (image is not None):
            imageSrc = image['src']
            # Change URL depending on if you want Japanese Cards or English Cards
            urllib.request.urlretrieve(
                imageSrc, digimoncard['cardNumber'] + ".webp")
        print(digimoncard['name'])
        cards.append(digimoncard)


def makeAACardDatas():
    for aaCard in AACards:
        splitUrl = aaCard.split("/")
        cardID = splitUrl[2]

        newCard = {}

        for card in cards:
            if (card['cardNumber'] == cardID):
                newCard = copy.deepcopy(card)
                newCard['version'] = "AA"
                newCard['id'] = cardID + "_P1"
                newCard['cardImage'] = 'assets/images/cards/jap/' + \
                                       newCard['id'] + ".webp"
                cards.append(newCard)
                break


def saveCardsToJSON():
    print('Saving now!')
    with open('LM01.json', 'w') as fp:
        json.dump(cards, fp)


def replace_string_in_json(file_path, search_string, replaceString):
    # Open the JSON file and load its contents
    with open(file_path, 'r') as file:
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
    with open(file_path, 'w') as file:
        json.dump(updated_data, file, indent=4)


getLinksFromWiki()
splitCardsForNormalAndAA()
getCardDataFromWiki()
makeAACardDatas()
saveCardsToJSON()

replace_string_in_json('LM01.json', ')[', ')\n[')
replace_string_in_json('LM01.json', ').[', ')\n[')
replace_string_in_json('LM01.json', '.[', '.[\n')
replace_string_in_json('LM01.json', '＞＜', '＞\n＜')
replace_string_in_json('LM01.json', ')＜', ')\n＜')
