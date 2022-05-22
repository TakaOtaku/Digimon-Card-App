import requests
import urllib
import json
from bs4 import BeautifulSoup
import re
import pandas as pd

#'https://en.digimoncard.com/cardlist/?search=trueasdasd&category=508011', 
#'https://en.digimoncard.com/cardlist/?search=true&category=508010', 
#'https://en.digimoncard.com/cardlist/?search=true&category=508009', 
#'https://en.digimoncard.com/cardlist/?search=true&category=508008', 
#'https://en.digimoncard.com/cardlist/?search=true&category=508007',
#'https://en.digimoncard.com/cardlist/?search=true&category=508006', 
#'https://en.digimoncard.com/cardlist/?search=true&category=508005', 
#'https://en.digimoncard.com/cardlist/?search=true&category=508004', 
#'https://en.digimoncard.com/cardlist/?search=true&category=508003', 
#'https://en.digimoncard.com/cardlist/?search=true&category=508002', 
#'https://en.digimoncard.com/cardlist/?search=true&category=508001', 
#'https://en.digimoncard.com/cardlist/?search=true&category=508113',
#'https://en.digimoncard.com/cardlist/?search=true&category=508112',
#'https://en.digimoncard.com/cardlist/?search=true&category=508111',
#'https://en.digimoncard.com/cardlist/?search=true&category=508110',
#'https://en.digimoncard.com/cardlist/?search=true&category=508109',
#'https://en.digimoncard.com/cardlist/?search=true&category=508108',
#'https://en.digimoncard.com/cardlist/?search=true&category=508107',
#'https://en.digimoncard.com/cardlist/?search=true&category=508106',
#'https://en.digimoncard.com/cardlist/?search=true&category=508105',
#'https://en.digimoncard.com/cardlist/?search=true&category=508104',
#'https://en.digimoncard.com/cardlist/?search=true&category=508103',
#'https://en.digimoncard.com/cardlist/?search=true&category=508102',
#'https://en.digimoncard.com/cardlist/?search=true&category=508101',
#'https://en.digimoncard.com/cardlist/?search=true&category=508901',

urls = [
'https://en.digimoncard.com/cardlist/?search=true&category=508012'
]

cards = []
for url in urls:
    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")

    cardsWithImage = soup.find_all("li", class_="image_lists_item")
    for cardWithImage in cardsWithImage:
        digimoncard = {
            "id": "",
            "name": "",
            "cardImage": "",
            "cardType": "",
            "dp": 0,
            "playCost": 0,
            "digivolveCost1": "",
            "digivolveCost2": "",
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
            "notes": "",
            "color": "",
            "version": "Normal",
            "illustrator": "",
            "block": ["02"]
        }

        if cardWithImage.find("div", class_="card_detail_red"):
            digimoncard['color'] = "Red"
        if cardWithImage.find("div", class_="card_detail_blue"):
            digimoncard['color'] = "Blue"
        if cardWithImage.find("div", class_="card_detail_green"):
            digimoncard['color'] = "Green"
        if cardWithImage.find("div", class_="card_detail_yellow"):
            digimoncard['color'] = "Yellow"
        if cardWithImage.find("div", class_="card_detail_black"):
            digimoncard['color'] = "Black"
        if cardWithImage.find("div", class_="card_detail_purple"):
            digimoncard['color'] = "Purple"
        if cardWithImage.find("div", class_="card_detail_white"):
            digimoncard['color'] = "White"
        if cardWithImage.find("div", class_="card_detail_multi"):
            digimoncard['color'] = "Multi"

        if cardWithImage.find("div", class_="card_detail_red_blue"):
            digimoncard['color'] = "Red/Blue"
        if cardWithImage.find("div", class_="card_detail_red_green"):
            digimoncard['color'] = "Red/Yellow"
        if cardWithImage.find("div", class_="card_detail_red_yellow"):
            digimoncard['color'] = "Red/Green"
        if cardWithImage.find("div", class_="card_detail_red_black"):
            digimoncard['color'] = "Red/Black"
        if cardWithImage.find("div", class_="card_detail_red_purple"):
            digimoncard['color'] = "Red/Purple"

        if cardWithImage.find("div", class_="card_detail_blue_red"):
            digimoncard['color'] = "Blue/Red"
        if cardWithImage.find("div", class_="card_detail_blue_yellow"):
            digimoncard['color'] = "Blue/Yellow"
        if cardWithImage.find("div", class_="card_detail_blue_green"):
            digimoncard['color'] = "Blue/Green"
        if cardWithImage.find("div", class_="card_detail_blue_black"):
            digimoncard['color'] = "Blue/Black"
        if cardWithImage.find("div", class_="card_detail_blue_purple"):
            digimoncard['color'] = "Blue/Purple"

        if cardWithImage.find("div", class_="card_detail_yellow_red"):
            digimoncard['color'] = "Yellow/Red"
        if cardWithImage.find("div", class_="card_detail_yellow_blue"):
            digimoncard['color'] = "Yellow/Blue"
        if cardWithImage.find("div", class_="card_detail_yellow_green"):
            digimoncard['color'] = "Yellow/Green"
        if cardWithImage.find("div", class_="card_detail_yellow_black"):
            digimoncard['color'] = "Yellow/Black"
        if cardWithImage.find("div", class_="card_detail_yellow_purple"):
            digimoncard['color'] = "Yellow/Purple"

        if cardWithImage.find("div", class_="card_detail_green_red"):
            digimoncard['color'] = "Green/Red"
        if cardWithImage.find("div", class_="card_detail_green_blue"):
            digimoncard['color'] = "Green/Blue"
        if cardWithImage.find("div", class_="card_detail_green_yellow"):
            digimoncard['color'] = "Green/Yellow"
        if cardWithImage.find("div", class_="card_detail_green_black"):
            digimoncard['color'] = "Green/Black"
        if cardWithImage.find("div", class_="card_detail_green_purple"):
            digimoncard['color'] = "Green/Purple"

        if cardWithImage.find("div", class_="card_detail_black_red"):
            digimoncard['color'] = "Black/Red"
        if cardWithImage.find("div", class_="card_detail_black_blue"):
            digimoncard['color'] = "Black/Blue"
        if cardWithImage.find("div", class_="card_detail_black_yellow"):
            digimoncard['color'] = "Black/Yellow"
        if cardWithImage.find("div", class_="card_detail_black_green"):
            digimoncard['color'] = "Black/Green"
        if cardWithImage.find("div", class_="card_detail_black_purple"):
            digimoncard['color'] = "Black/Purple"

        if cardWithImage.find("div", class_="card_detail_purple_red"):
            digimoncard['color'] = "Purple/Red"
        if cardWithImage.find("div", class_="card_detail_purple_blue"):
            digimoncard['color'] = "Purple/Blue"
        if cardWithImage.find("div", class_="card_detail_purple_yellow"):
            digimoncard['color'] = "Purple/Yellow"
        if cardWithImage.find("div", class_="card_detail_purple_green"):
            digimoncard['color'] = "Purple/Green"
        if cardWithImage.find("div", class_="card_detail_purple_black"):
            digimoncard['color'] = "Purple/Black"

        card = cardWithImage.find("div", class_="card_detail_inner")
        image = cardWithImage.find("a", class_="card_img").find("img")

        imageURL = 'https://en.digimoncard.com' + image['src'][2:]  ### Change URL depending on if you want Japanese Cards or English Cards
        imageSave = imageURL.rsplit('/', 1)[-1]
        urllib.request.urlretrieve(imageURL, imageSave)  ##### Comment IN/OUT if you want to get the pngs.
        digimoncard['cardImage'] = 'assets/images/cards/jap/' + imageSave.replace('.png', '.jpg')  ### Change URL depending on if you want Japanese Cards or English Cards
        if '_P' in imageSave:
            digimoncard['version'] = 'AA'
            if cardWithImage.find("div", class_="cardParallel"):
                digimoncard['version'] = 'AA'
             
        digimoncard['id'] = imageSave.replace('.png', '')

        #Card Header
        cardinfo_head = card.find("ul", class_="cardinfo_head")
        digimoncard['cardNumber'] = cardinfo_head.find("li", class_="cardno").text.strip()
        digimoncard['rarity'] = cardinfo_head.select('ul > li')[1].text.strip()
        digimoncard['cardType'] = cardinfo_head.find("li", class_="cardtype").text.strip()
        cardLv = cardinfo_head.find("li", class_="cardlv")
        if cardLv:
            digimoncard['cardLv'] = cardLv.text.strip()
        else:
            digimoncard['cardLv'] = ''

        #Card Name
        digimoncard['name'] = card.find("div", class_="card_name").text.strip()

        #Card Top
        cardinfo_top = card.find("div", class_="cardinfo_top_body")
        dls = cardinfo_top.select("div > dl")
        for dl in dls:
            dt = dl.find("dt").text
            dd = dl.find("dd").text.strip()
            match dt:
                case 'Form':
                    digimoncard['form'] = dd
                case 'Attribute':
                    digimoncard['attribute'] = dd
                case 'Type':
                    digimoncard['type'] = dd
                case 'DP':
                    digimoncard['dp'] = dd
                case 'Play Cost':
                    digimoncard['playCost'] = dd
                case 'Digivolve Cost 1':
                    digimoncard['digivolveCost1'] = dd
                case 'Digivolve Cost 2':
                    digimoncard['digivolveCost2'] = dd

        #Card Bottom
        cardinfo_bottom = card.find("div", class_="cardinfo_bottom")
        dls = cardinfo_bottom.select("div > dl")
        for dl in dls:
            dt = dl.find("dt").text
            dd = dl.find("dd").text.strip()
            match dt:
                case 'Effect':
                    digimoncard['effect'] = dd
                case 'Digivolve effect':
                    digimoncard['digivolveEffect'] = dd
                case 'Security effect':
                    digimoncard['securityEffect'] = dd
                case 'Promo Info':
                    digimoncard['notes'] = dd

        cards.append(digimoncard)

with open('BT10.json', 'w') as f:
	f.write("%s\n" % json.dumps(cards))
