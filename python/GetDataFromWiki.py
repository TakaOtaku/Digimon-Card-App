from ast import Break
import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd
import copy

wikiLink = 'https://digimoncardgame.fandom.com'
wikiPageLinks = [
    'https://digimoncardgame.fandom.com/wiki/EX-03:_Theme_Booster_Draconic_Roar'
]
cardLinks = []
NormalCards = []
AACards = []
cards = []


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


def splitCardsForNormalAndAA():
    for cardLink in cardLinks:
        if cardLink not in NormalCards:
            NormalCards.append(cardLink)
        else:
            AACards.append(cardLink)


def getMainInfo(html, digimoncard):
    rows = html.find_all("tr")

    for row in rows:
        rowData = []
        cells = row.find_all("td")
        for cell in cells:
            rowData.append(cell.text.replace("\n", "").strip())

        match(rowData[0]):
            case 'Name':
                digimoncard['name'] = rowData[1]
            case 'Colour':
                digimoncard['color'] = rowData[1]
            case 'Card Type':
                digimoncard['cardType'] = rowData[1]
            case 'Play Cost':
                digimoncard['playCost'] = rowData[1]
            case 'DP':
                digimoncard['dp'] = rowData[1]
            case 'Level':
                digimoncard['cardLv'] = rowData[1]
            case 'Form':
                digimoncard['form'] = rowData[1]
            case 'Attribute':
                digimoncard['attribute'] = rowData[1]
            case 'Type':
                digimoncard['type'] = rowData[1]
            case 'Illustrator':
                digimoncard['illustrator'] = rowData[1]
    return digimoncard


def getDigivolveInfo(html, digimoncard):
    evoCons = html.find_all("table", class_="evocon")
    specialEvoCons = html.find_all("table", class_="effect")

    evoNumber = 1
    for evoCon in evoCons:
        cells = evoCon.find_all("td")
        digimoncard["digivolveColor" +
                    str(evoNumber)] = cells[1].text.replace("\n", "").strip()
        digimoncard["digivolveLevel" +
                    str(evoNumber)] = cells[3].text.replace("\n", "").strip()
        digimoncard["digivolveCost" +
                    str(evoNumber)] = cells[5].text.replace("\n", "").strip()
        evoNumber += 1

    for specialEvoCon in specialEvoCons:
        cells = specialEvoCon.find_all("b")
        if len(cells) > 0:
            specialEvo = cells[0].text.replace("\n", "")
            if(specialEvo.find("DNA Digivolution") != -1):
                digimoncard['dnaDigivolve'] = specialEvo
            if(specialEvo.find("Digivolve") != -1):
                digimoncard['specialDigivolve'] = specialEvo

    return digimoncard


def getExtraInfo(html, digimoncard):
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

    return digimoncard


def getRestrictedInfo(html, digimoncard):
    return digimoncard


def getRarityInfo(html, digimoncard):
    rows = html.find_all("tr")
    cells = rows[1].find_all("td")

    rarity = cells[2].text.replace("\n", "").strip()

    rarityDict = {
        "": "",
        "Common": "C",
        "Uncommon": "U",
        "Rare": 'R',
        "Super Rare": 'SR',
        "Secret Rare": 'SEC',
    }

    digimoncard['rarity'] = rarityDict[rarity]
    return digimoncard


def getCardDataFromWiki():
    for url in NormalCards:
        page = requests.get(wikiLink + url)
        soup = BeautifulSoup(page.content, "html.parser")

        infoMain = soup.find("div", class_="info-main")
        infoDigivolve = soup.find("div", class_="info-digivolve")
        infoExtra = soup.find("div", class_="info-extra")
        infoRestricted = soup.find("div", class_="info-restricted")
        infoRarity = soup.find("table", class_="settable")

        digimoncard = {
            "id": "",
            "name": "",
            "cardImage": "assets/images/cards/jap/",
            "cardType": "",
            "dp": 0,
            "playCost": 0,
            "digivolveCost1": "",
            "digivolveColor1": "",
            "digivolveLevel1": "",
            "digivolveCost2": "",
            "digivolveColor2": "",
            "digivolveLevel2": "",
            "cardLv": 0,
            "form": "",
            "attribute": "",
            "type": "",
            "rarity": "",
            "cardNumber": "",
            "digiXros": "-",
            "specialDigivolve": "-",
            "dnaDigivolve": "-",
            "effect": "",
            "digivolveEffect": "",
            "securityEffect": "",
            "notes": "▹THEME BOOSTER DRACONIC ROAR [EX-03]",
            "color": "",
            "version": "Normal",
            "illustrator": "",
            "block": ["02"],
            "restriction": "",
        }

        digimoncard = getMainInfo(infoMain, digimoncard)
        digimoncard = getDigivolveInfo(infoDigivolve, digimoncard)
        digimoncard = getExtraInfo(infoExtra, digimoncard)
        digimoncard = getRestrictedInfo(infoRestricted, digimoncard)
        digimoncard = getRarityInfo(infoRarity, digimoncard)

        splitUrl = url.split("/")
        digimoncard['id'] = splitUrl[2]
        digimoncard['cardNumber'] = splitUrl[2]
        digimoncard['cardImage'] = digimoncard['cardImage'] + \
            digimoncard['id']+".webp"

        imagediv = soup.find("div", class_="image")
        image = imagediv.find("img")
        if(image is not None):
            imageSrc = image['src']
            # Change URL depending on if you want Japanese Cards or English Cards
            urllib.request.urlretrieve(
                imageSrc, digimoncard['cardNumber']+".png")

        cards.append(digimoncard)


def makeAACardDatas():
    for aaCard in AACards:
        splitUrl = aaCard.split("/")
        cardID = splitUrl[2]

        newCard = {}

        for card in cards:
            if(card['cardNumber'] == cardID):
                newCard = copy.deepcopy(card)
                newCard['version'] = "AA"
                newCard['id'] = cardID + "_P1"
                newCard['cardImage'] = 'assets/images/cards/jap/' + \
                    newCard['id']+".webp"
                cards.append(newCard)
                break


def saveCardsToJSON():
    with open('ex3.json', 'w') as fp:
        json.dump(cards, fp)


getLinksFromWiki()
splitCardsForNormalAndAA()
getCardDataFromWiki()
makeAACardDatas()
saveCardsToJSON()
