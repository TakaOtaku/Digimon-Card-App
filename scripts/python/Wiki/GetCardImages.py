import time
import re
import requests
from bs4 import BeautifulSoup
import urllib.request

import WikiVariables as WV

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

def getCardImages():
  # Backup the AAs and JAAs for each card
  backup_aas = []
  backup_jaas = []

  # Loop through each card link
  for link in WV.cardLinks:
    try:
      print('Checking ' + link)

      # Get the HTML content for the page
      page = requests.get(WV.wikiLink + link + WV.gallery)
      soup = BeautifulSoup(page.content, "html.parser")

      # Get the ID of the card
      id = link.split("/")[2]
      id_without_p = remove_suffix_and_extension(id)

      # Find the card object with the matching ID
      card = None
      for obj in WV.cards:
        if obj.id == id_without_p:
          card = obj
      if card is None:
        continue

      # Backup the AAs and JAAs for the card
      backup_aas = card.AAs
      backup_jaas = card.JAAs

      # Remove the AAs and JAAs from the card
      card.AAs = []
      card.JAAs = []

      # Download images and update notes for the English gallery
      div = soup.find("div", id="gallery-0")
      if div is not None:
        gallery_items = div.find_all(
          "div", class_="wikia-gallery-item")

        for item in gallery_items:
          img = item.find("img")

          id_with_p = None
          if img is None:
            noImage = item.find("a", class_="image-no-lightbox")
            # Remove .png from the text and replace spaces with underscores
            id_with_p = re.sub(r'\.png$', '', noImage.text)
            id_with_p = re.sub(r'\s', '_', id_with_p)
          else:
            id_with_p = re.sub(r'\.png$', '', img['data-image-key'])
            src = img['src'].split("/latest")[0]

            save_location = src + '/latest'
            save_location = save_location.replace('-j', '-J')

            download_image_with_retry(
              save_location,
              './scripts/python/Wiki/digimon-images/' +
              img['data-image-key'],
              img['data-image-key']
            )

          captions = item.find("div", class_="lightbox-caption")
          notes = captions.find_all("a")

          if notes is None or len(notes) == 0:
            continue

          note_array = []
          for note in notes:
            note_array.append(note.text)
          combined_notes = " / ".join(note_array)

          # Update the notes for the card
          if card.notes == note_array[0]:
            card.notes = combined_notes

          # Update the AAs for the card
          # If the Note is the Note for NA it is ignored
          for aa in backup_aas:
            if aa['note'] == note_array[0]:
              if '_P' in id_with_p:
                new_aa = {
                  'id': id_with_p,
                  'illustrator': aa['illustrator'],
                  'note': combined_notes,
                  'type': aa['type']
                }
                card.AAs.append(new_aa)
              elif '-Errata' in id_with_p:
                new_aa = {
                  'id': id_with_p,
                  'illustrator': aa['illustrator'],
                  'note': combined_notes,
                  'type': aa['type']
                }
                card.AAs.append(new_aa)
              else:
                card.notes = combined_notes

      # Download images and update notes for the Japanese gallery
      div_j = soup.find("div", id="gallery-1")
      if div_j is not None:
        gallery_items_j = div_j.find_all(
          "div", class_="wikia-gallery-item")

        for item in gallery_items_j:
          img = item.find("img")
          if img is None:
            continue

          id_with_p = re.sub(r'\.png$', '', img['data-image-key'])
          src = img['src'].split("/latest")[0]

          save_location = src + '/latest'
          save_location = save_location.replace('-j', '-J')

          download_image_with_retry(
            save_location,
            './scripts/python/Wiki/digimon-images/' +
            img['data-image-key'],
            img['data-image-key']
          )

          captions = item.find("div", class_="lightbox-caption")
          notes = captions.find_all("a")

          if notes is None or len(notes) == 0:
            continue

          note_array = []
          for note in notes:
            note_array.append(note.text)
          combined_notes = " / ".join(note_array)

          # Update the JAAs for the card
          for aa in backup_jaas:
            if aa['note'] == note_array[0]:
              if '_P' in id_with_p:
                new_aa = {
                  'id': id_with_p,
                  'illustrator': aa['illustrator'],
                  'note': combined_notes,
                  'type': aa['type']
                }
                card.JAAs.append(new_aa)

      # Update the card object in the WV.cards list
      index = 0
      for obj in WV.cards:
        if obj.id == card.id:
          WV.cards[index] = card
        index += 1

    except:
      print("Error for: " + link)
