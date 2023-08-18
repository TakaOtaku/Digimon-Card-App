import json
import time

import re

import requests
from bs4 import BeautifulSoup
import urllib.request

from classes.DigimonCard import DigimonCard
from classes.DigivolveCondition import DigivolveCondition

import WikiVariables as WV


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
            WV.cardLinks.append(cardLink["href"])


def getPromoLinks():
    promolink = WV.wikiLink + WV.promo
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
            WV.cardLinks.append(f"/wiki/P-{i:03}")
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
                digimoncard.digiXros = specialEvoCon.find("td").text
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


def replace_string_in_json(search_string, replaceString):
    # Open the JSON file and load its contents
    with open('./scripts/python/Wiki/jsons/DigimonCards.json', 'r') as file:
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
    with open('./scripts/python/Wiki/jsons/DigimonCards.json', 'w') as file:
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


def getCardData():
    count = 0
    for link in WV.cardLinks:
        count += 1

        page = requests.get(WV.wikiLink + link)
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

        print('[' + str(count) + '/' + str(WV.cardCount) + ']' +
              currentDigimon.id + ' - ' + currentDigimon.name.english)
        WV.cards.append(currentDigimon)


def setNotes():
    for card in WV.cards:
        if card.notes in WV.NoteDictionary:
            card.notes = WV.NoteDictionary[card.notes]


def getRulings():
    rulingCount = 0
    for link in WV.cardLinks:
        rulingCount += 1
        page = requests.get(WV.wikiLink + link + WV.ruling)
        soup = BeautifulSoup(page.content, "html.parser")

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


def formatCards():
    formatedCards = []
    for card in WV.cards:
        formatedCards.append(class_to_dict(card))

    formatedCards = remove_underscores(formatedCards)
    print('Saving DigimonCard JSON!')
    with open('./scripts/python/Wiki/jsons/DigimonCards.json', 'w') as fp:
        json.dump(formatedCards, fp, indent=2, sort_keys=sort_key)


def getCardImages():
    backupAAs = []
    backupJAAs = []
    for link in WV.cardLinks:
        print('Checking' + link)
        backupAAs = []
        page = requests.get(WV.wikiLink + link + WV.gallery)
        soup = BeautifulSoup(page.content, "html.parser")

        id = link.split("/")[2]
        idWithoutP = remove_suffix_and_extension(id)

        card = None
        for obj in WV.cards:
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

                download_image_with_retry(
                    saveLocation, './scripts/python/Wiki/digimon-images/' + img['data-image-key'], img['data-image-key'])

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

                download_image_with_retry(
                    saveLocation, './scripts/python/Wiki/digimon-images/' + img['data-image-key'], img['data-image-key'])

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
        for obj in WV.cards:
            if obj.id == card.id:
                WV.cards[index] = card
            index += 1


def removeSamples():
    # Remove all AAs and JAAs from every Card that include Sample in the id
    with open('./scripts/python/Wiki/jsons/DigimonCards.json', 'r') as file:
        data = json.load(file)

        for card in data:
            for aa in card['AAs']:
                if 'Sample' in aa['id']:
                    card['AAs'].remove(aa)
            for jaa in card['JAAs']:
                if 'Sample' in jaa['id']:
                    card['JAAs'].remove(jaa)

        # Save the updated JSON back to the file
        with open('./scripts/python/Wiki/jsons/DigimonCards.json', 'w') as file:
            json.dump(data, file, indent=2, sort_keys=sort_key)
