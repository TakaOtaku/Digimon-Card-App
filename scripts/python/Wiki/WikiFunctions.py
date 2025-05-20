import json
import os
import requests
from bs4 import BeautifulSoup
from classes.DigimonCard import DigimonCard

import WikiVariables as WV

def check_if_image_exists(image_path):
    return os.path.exists(image_path)

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
  """
  Loads Digimon card data from a JSON file and populates WV.cards with DigimonCard instances.
  
  Each card entry from the JSON is converted into a DigimonCard object, including nested attributes such as AAs and JAAs, and assigned to the global WV.cards list.
  """
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

        cards.append(currentDigimon)

    WV.cards = cards
    print("Cards Loaded!")



