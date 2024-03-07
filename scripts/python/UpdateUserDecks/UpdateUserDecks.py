import requests
from typing import List, Dict
import json

# Update all User Decks
# 1. Get all Decks from the Users, update the Tags, check if the deck is valid
# 2. Update the Tags from the Decks
# 3. Check if the Deck is valid
# 4. Check if there are duplicate Decks, delete all but the oldest one
# 5. Drop the decks from the database
# 6. Add the decks to the database

def set_tags(deck: Dict) -> List[Dict]:
    tags = []

    tags.append(set_newest_set(deck['cards']))

    if banned_cards_included(deck['cards']):
        tags.append({'name': 'Banned', 'color': 'Danger'})

    if too_many_restricted_cards_included(deck['cards']):
        tags.append({'name': 'Restricted', 'color': 'Danger'})

    return tags

def set_newest_set(cards: List[Dict]) -> Dict:
    release_order = [
        'BT17', 'EX06', 'BT16', 'ST17', 'BT15','EX05', 'BT14', 'ST16', 'ST15', 'RB1', 'BT13', 'EX4', 'BT12',
        'ST14', 'BT11', 'EX3', 'BT10', 'ST13', 'ST12', 'BT9', 'EX2', 'BT8', 'ST10', 'ST9', 'BT7', 'EX1',
        'BT6', 'ST8', 'ST7', 'BT5', 'BT4', 'ST6', 'ST5', 'ST4', 'BT3', 'BT2', 'BT1', 'ST3', 'ST2', 'ST1'
    ]
    # Check each card in the deck and see what the newest card id is based on the release order
    # Then add a tag with the newest set
    for release in release_order:
        for card in cards:
            if card['id'].startswith(release):
                return {'name': release, 'color': 'Success'}
    return {'name': 'Unknown', 'color': 'Warning'}

def banned_cards_included(cards: List[Dict]) -> bool:
    banned = False
    if not cards:
        return False
    for card in cards:
        if card['id'] in banned_cards:
            return True
    return banned

def too_many_restricted_cards_included(cards: List[Dict]) -> bool:
    restricted = False
    if not cards:
        return False
    # Check if a card is in the deck is included more than once from the restricted cards list
    for card in cards:
        if card['id'] in restricted_cards:
            if card['count'] > 1:
                return True
    return restricted

def is_deck_valid(deck: Dict) -> bool:
    # Check if the Deck has the cards attribute and if cards is not None
    if 'cards' not in deck or deck['cards'] is None:
        return False

    if 'title' not in deck or deck['title'] is None:
        return False

    if 'date' not in deck or deck['date'] is None:
        return False

    # Check if the added count of cards in the deck are more than 50 and less than 55 and each card id should have a count of 4 or less
    count = 0
    for card in deck['cards']:
        count += card['count']
        if card['count'] > 4 and any(card['id'].startswith(x) for x in cards_that_can_be_included_50) == False:
            return False
    if count < 50 or count > 55:
        return False

    return True

def withoutAA(cards):
  cardsWithoutAA = []
  for card in cards:
    cardID = card['id']
    if ('_P' in card['id']):
      cardID = card['id'].split('_P')[0]
    newCard = card
    newCard['id'] = cardID
    cardsWithoutAA.append(newCard)
  return cardsWithoutAA



restricted_cards = [
    'ST6-03',

    'BT2-047',
    'BT2-069',
    'BT3-054',
    'BT3-103',
    'BT6-100',
    'BT7-038',
    'BT7-064',
    'BT7-069',
    'BT7-072',
    'BT7-107',
    'BT9-099',
    'BT10-009',
    'BT11-064',
    'BT13-012',

    'EX1-068',
    'EX2-039',
    'EX4-019',

    'P-008',
    'P-025'
]
banned_cards = [
    'BT5-109'
]

cards_that_can_be_included_50 = [
    'BT6-085',
    'BT11-061',
    'EX2-046'
]


usersAPI = 'https://backend.digimoncard.app/api/users'
decksAPI = 'https://backend.digimoncard.app/api/decks'

# Get all users from the database and wait for the response
response = requests.get(usersAPI)
users = response.json()

decksToAdd = []
decksInValid = []

#Iterate through every user and his decks
for user in users:
    deckString = user['decks']
    decks = json.loads(deckString)
    print("Checking User: " + user['displayName'] + "|" + user['uid'] + " with " + str(len(decks)) + " decks")

    if (len(decks) > 100):
        print("User " + user['displayName'] + " has more than 100 decks and will be skipped")

    userId = user['uid']
    userName = user['displayName']
    photoUrl = user['photoURL']
    # JSON Parse the decks
    for deck in decks:
        if is_deck_valid(deck) == False:
            decksInValid.append(deck)
            break
        set_tags(deck)
        deck["userId"] = userId
        deck["user"] = userName
        deck["photoUrl"] = photoUrl
        decksToAdd.append(deck)

# Check the decksToAdd for decks with the same cards and delete all but the oldest one
index = 1
for deck in decksToAdd:
    for deck2 in decksToAdd:
        if withoutAA(deck['cards']) == withoutAA(deck2['cards']) and deck['date'] > deck2['date']:
            print("Deck " + deck['title'] + " is a duplicate of " + deck2['title'] + " and will be removed from the Array.")
            decksToAdd.remove(deck2)
    print(str(index) + " decks checked. " + str(len(decksToAdd) - index) + " decks left.")
    index = index + 1

# Post each deck to the database
for deck in decksToAdd:
    print("Adding deck " + deck['title'] + " to the database")
    url = decksAPI + "/" + deck['id']
    response = requests.put(url, json=deck)
    print(response.reason)
