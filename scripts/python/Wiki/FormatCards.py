import json
import time

import os
import re

import requests
from bs4 import BeautifulSoup
import urllib.request

from classes.DigimonCard import DigimonCard
from classes.DigivolveCondition import DigivolveCondition

import WikiVariables as WV

def sort_key(card):
  return card["_id"]

def token_description_ranges(text):
  ranges = []
  start = 0
  while True:
    start = text.find('(Digimon/', start)
    if start == -1:
      break
    depth = 0
    for index in range(start, len(text)):
      if text[index] == '(':
        depth += 1
      elif text[index] == ')':
        depth -= 1
        if depth == 0:
          ranges.append((start, index + 1))
          start = index + 1
          break
    else:
      break
  return ranges

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
      if ('\n' in replaceString or search_string == '\n') and search_string in obj and '(Digimon/' in obj:
        ranges = token_description_ranges(obj)
        return re.sub(
          re.escape(search_string),
          lambda match: match.group() if any(start <= match.start() and match.end() <= end for start, end in ranges) else replaceString,
          obj,
        )
      return obj.replace(search_string, replaceString)
    else:
      return obj

  updated_data = replace_string(data)

  # Save the updated JSON back to the file
  with open('./scripts/python/Wiki/jsons/DigimonCards.json', 'w') as file:
    json.dump(updated_data, file, indent=2, sort_keys=sort_key)

def replaceStrings():
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
  replace_string_in_json('＞ ).', '')
  replace_string_in_json(' ).', '')
  replace_string_in_json('＞\n＜', '＞ ＜')
  replace_string_in_json('1 [Digivolve]', '1\n[Digivolve]')
  replace_string_in_json('2 [Digivolve]', '2\n[Digivolve]')
  replace_string_in_json('3 [Digivolve]', '3\n[Digivolve]')
  replace_string_in_json('4 [Digivolve]', '4\n[Digivolve]')
  replace_string_in_json('5 [Digivolve]', '5\n[Digivolve]')
  replace_string_in_json('3 [DNA Digivolve]', '3\n[DNA Digivolve]')
  replace_string_in_json('Cost 0Digivolve unsuspended with the 2 specified Digimon stacked on top of each other.', 'Cost 0\nDigivolve unsuspended with the 2 specified Digimon stacked on top of each other.')
  replace_string_in_json('5 [Burst Digivolve]', '5\n[Burst Digivolve]')
  replace_string_in_json('5 [DNA Digivolve]', '5\n[DNA Digivolve]')
  replace_string_in_json('."[', '."\n[')
  replace_string_in_json('.{', '.\n{')
  replace_string_in_json('.Wh', '.\nWh')

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
