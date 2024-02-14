import json

import os

from copy import deepcopy

preparedCardsENG = []
preparedCardsJAP = []

def sort_key(card):
  return card["_id"]

def removeJ(id):
  if "-J" in id:
    # Remove "-J" from id and continue
    return id[:id.rfind("-J")]
  else:
    return id

def addSampleBeforeWebp(imagePath):
  """Adds a "Sample-J" before the ".webp" extension in a file path."""

  if imagePath.endswith(".webp") and not imagePath.endswith("-Sample-J.webp"):
    index = imagePath.rfind(".webp")
    return imagePath[:index] + "-Sample-J" + imagePath[index:]
  else:
    # If the imagePath does not end with ".webp", return it as is.
    return imagePath

def getP(code):
  """Returns the prefix for a given AA code."""
  return "_P" + code.split("_P")[1]

def addJBeforeWebp(imagePath):
  """Adds a "J" before the ".webp" extension in a file path."""

  if imagePath.endswith(".webp") and not imagePath.endswith("-J.webp"):
    # Use rfind() instead of lastIndexOf()
    index = imagePath.rfind(".webp")
    return imagePath[:index] + "-J" + imagePath[index:]
  else:
    # If the imagePath does not end with ".webp", return it as is.
    return imagePath

def check_image_exists(file_path):
  """Checks if the image file at the given file path exists."""

  return os.path.isfile("src/" + file_path)

def checkIfSampleShouldBeUsed(card):
    imageSample = card["cardImage"].replace(".webp", "-Sample.webp")
    if check_image_exists(card["cardImage"]):
      return card
    if check_image_exists(imageSample):
      card["cardImage"] = imageSample
    return card

def prepareCards():
  with open('./scripts/python/Wiki/jsons/DigimonCards.json', 'r') as file:
    data = json.load(file)

    for card in data:
      preparedCardsENG.append(card)

      a = deepcopy(card)
      a["cardImage"] = addJBeforeWebp(card["cardImage"])
      preparedCardsJAP.append(checkIfSampleShouldBeUsed(a))

      # Add Card AAs and JAAs as single Cards
      for aa in card['AAs']:
        eng = deepcopy(card)
        eng["cardImage"] = "assets/images/cards/" + aa["id"] + ".webp"
        eng["id"] = aa["id"]
        eng["illustrator"] = aa["illustrator"]
        eng["notes"] = aa["note"]
        eng["version"] = aa["type"]
        preparedCardsENG.append(eng)

      for jaa in card['JAAs']:
        jap = deepcopy(card)
        jap["cardImage"] = "assets/images/cards/" + jaa["id"] + ".webp"
        jap["id"] = removeJ(jaa["id"])
        jap["illustrator"] = jaa["illustrator"]
        jap["notes"] = jaa["note"]
        jap["version"] = jaa["type"]
        preparedCardsJAP.append(jap)

    # Remove AAs and JAAs from the prepared cards
    for card in preparedCardsENG:
      card.pop("AAs", None)
      card.pop("JAAs", None)
    for card in preparedCardsJAP:
      card.pop("AAs", None)
      card.pop("JAAs", None)

    # Check each card form the prepared cards if the card image exists in the path
    path = "src/"
    for card in preparedCardsENG:
      exists = check_image_exists(card["cardImage"])
      if exists != True:
        jExists = check_image_exists(addJBeforeWebp(card["cardImage"]))
        if jExists:
          card["cardImage"] = addJBeforeWebp(card["cardImage"])
        else:
          sampleExists = check_image_exists(
            addSampleBeforeWebp(card["cardImage"]))
          if sampleExists:
            card["cardImage"] = addSampleBeforeWebp(card["cardImage"])
    for card in preparedCardsJAP:
      exists = check_image_exists(card["cardImage"])
      if exists != True:
        sampleExists = check_image_exists(
          addSampleBeforeWebp(card["cardImage"]))
        if sampleExists:
          card["cardImage"] = addSampleBeforeWebp(card["cardImage"])

    # Save the updated JSON back to the file
    with open('./scripts/python/Wiki/jsons/PreparedDigimonCardsENG.json', 'w') as file:
      json.dump(preparedCardsENG, file, indent=2, sort_keys=sort_key)

    with open('./scripts/python/Wiki/jsons/PreparedDigimonCardsJAP.json', 'w') as file:
      json.dump(preparedCardsJAP, file, indent=2, sort_keys=sort_key)
