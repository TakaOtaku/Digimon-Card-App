"""
GetCardImages.py - Download card images from the Digimon Wiki using MediaWiki API

This script downloads card images from the wiki, but now includes optimization to skip
downloading images that already exist in the src/assets/images/cards directory.

Key features:
- Uses MediaWiki API to avoid 403 Forbidden errors
- Checks if images already exist in the final assets location (as .webp files)
- Skips downloads for existing images to save time and bandwidth
- Provides detailed progress logging with emojis for better visibility
- Shows download statistics summary at the end
- Maintains original functionality for card data processing

The script converts .png filenames from wiki to .webp filenames used in assets
to perform the existence check.
"""

import os
import time
import re
import traceback
from PIL import Image
import random
import requests

import CardImageIndex
import WikiVariables as WV
import WikiFunctions as WF

# Statistics tracking
download_stats = {
    'skipped': 0,
    'downloaded': 0,
    'failed': 0
}


def check_image_exists_in_assets(image_name: str) -> bool:
    """
    Check if the image already exists in the src/assets/images/cards directory.

    Args:
        image_name: The image filename to check (with .png extension from wiki)

    Returns:
        bool: True if the image exists (as .webp), False otherwise
    """
    # Convert image name from .png to .webp
    webp_filename = re.sub(r'\.png$', '.webp', image_name)

    return CardImageIndex.image_exists(webp_filename)

def download_image_with_retry(url, save_directory, id, max_retries=5, retry_delay=5):
    """
    Download image with retry logic, but skip if already exists in assets.

    Args:
        url: URL to download from
        save_directory: Local directory to save to
        id: Image ID for logging
        max_retries: Maximum retry attempts
        retry_delay: Delay between retries
    """
    # Check if image already exists in assets directory
    if check_image_exists_in_assets(id):
        print(f"⏭️  Skipping {id} - already exists in assets directory")
        download_stats['skipped'] += 1
        return

    print(f"⬇️  Downloading {id}...")
    retries = 0

    while retries < max_retries:
        try:
            response = WF.api_session.get(url, timeout=30)
            response.raise_for_status()
            with open(save_directory, 'wb') as f:
                f.write(response.content)
            print(f"✅ Downloaded image {id} successfully.")
            download_stats['downloaded'] += 1
            return
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 503:
                print(f"⚠️  HTTP Error 503: Service Unavailable. Retrying in {retry_delay} seconds...")
                retries += 1
                time.sleep(retry_delay)
            else:
                print(f"❌ HTTP Error {e.response.status_code}: {e.response.reason}")
                break
        except Exception as e:
            print(f"❌ Unexpected error downloading {id}: {str(e)}")
            break

    print(f"❌ Failed to download {id} after {max_retries} attempts.")
    download_stats['failed'] += 1

def remove_suffix_and_extension(input_string):
  # Remove the ".webp" extension
  without_extension = re.sub(r'\.png$', '', input_string)

  # Remove the "_Px" suffix (where x can be any number)
  without_suffix = re.sub(r'_P\d+', '', without_extension)

  return without_suffix

def illustrator_suffix(image_id):
  """'BT24-034_P2', 'BT24-034_P2-Sample' or '_P2' -> '_P2'; '...-Errata' -> '-Errata'; the base card -> None."""
  match = re.search(r'(_P\d+|-Errata)(?:-(?:Sample|J))*$', image_id)
  return match.group(1) if match else None

def pick_illustrator_row(rows, image_id, note, used):
  """Row backing a gallery image. Rows are numbered like the gallery (_P1, _P2, ...), so the number decides:
  matching on the booster note alone gave every print of one booster the same type (a Rare Pull next to an
  Alternative Art). Without a numbered match, take the first row for this note that no earlier image took."""
  suffix = illustrator_suffix(image_id)
  if suffix is not None:
    for index, row in enumerate(rows):
      if illustrator_suffix(row['id']) == suffix:
        return index
  matches = [index for index, row in enumerate(rows) if row['note'] == note]
  unused = [index for index in matches if index not in used]
  return (unused or matches or [None])[0]

def missing_special_prints(card_id, rows, used):
  """Special Rare / Rare Pull rows that no gallery image backed. The wiki often has no scan for them, and
  dropping them hid those cards from the SP / RP filters; kept, the site shows its placeholder image."""
  prints = []
  for index, row in enumerate(rows):
    suffix = illustrator_suffix(row['id'])
    if index in used or suffix is None or not re.search(r'Special Rare|Rare Pull', row['type']):
      continue
    prints.append({'id': card_id + suffix, 'illustrator': row['illustrator'], 'note': row['note'], 'type': row['type']})
  return prints

def getCardImages():
  # Backup the AAs and JAAs for each card
  backup_aas = []
  backup_jaas = []

  print("🚀 Starting card image download process using MediaWiki API...")
  print(f"📊 Processing {len(WV.cardLinks)} card links...")

  # Loop through each card link
  for link in WV.cardLinks:
    try:
      print('Checking ' + link)

      # Extract page title from link and add /Gallery suffix
      page_title = link.split('/wiki/')[-1] if '/wiki/' in link else link.lstrip('/')
      gallery_page_title = page_title + '/Gallery'

      # Get the HTML content for the gallery page using MediaWiki API
      soup = WF.get_page_html(gallery_page_title, delay=random.uniform(0.2, 0.5))
      if not soup:
          print(f"Failed to fetch gallery for: {link}")
          continue

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
      # Each illustrator row backs one gallery image: prints from the same booster share a
      # note, and matching the first row every time gave them all its type (lost "Rare Pull")
      used_aas = set()
      used_jaas = set()

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
          # Notes can have a differnet _P then in the Gallery because of the ordering sometimes
          aa_index = pick_illustrator_row(backup_aas, id_with_p, note_array[0], used_aas)
          if aa_index is not None:
            aa = backup_aas[aa_index]
            if '_P' in id_with_p or '-Errata' in id_with_p:
              card.AAs.append({
                'id': id_with_p,
                'illustrator': aa['illustrator'],
                'note': combined_notes,
                'type': aa['type']
              })
              # Sample images are dropped later and must not take the row of the real print
              if 'Sample' not in id_with_p:
                used_aas.add(aa_index)
            else:
              card.notes = combined_notes

      known_ids = {aa['id'] for aa in card.AAs}
      for missing in missing_special_prints(card.id, backup_aas, used_aas):
        if missing['id'] not in known_ids:
          card.AAs.append(missing)

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
          aa_index = pick_illustrator_row(backup_jaas, id_with_p, note_array[0], used_jaas)
          if aa_index is not None and '_P' in id_with_p:
            aa = backup_jaas[aa_index]
            card.JAAs.append({
              'id': id_with_p,
              'illustrator': aa['illustrator'],
              'note': combined_notes,
              'type': aa['type']
            })
            if 'Sample' not in id_with_p:
              used_jaas.add(aa_index)

      # Update the card object in the WV.cards list
      index = 0
      for obj in WV.cards:
        if obj.id == card.id:
          WV.cards[index] = card
        index += 1
    except Exception:
      print("Error for: " + link)
      traceback.print_exc()
      print(Exception)

  # Print download summary
  print("\n" + "="*50)
  print("📊 DOWNLOAD SUMMARY")
  print("="*50)
  print(f"✅ Successfully downloaded: {download_stats['downloaded']} images")
  print(f"⏭️  Skipped (already exist): {download_stats['skipped']} images")
  print(f"❌ Failed downloads: {download_stats['failed']} images")
  print(f"📈 Total processed: {sum(download_stats.values())} images")

  if download_stats['skipped'] > 0:
    time_saved = download_stats['skipped'] * 2  # Estimate 2 seconds per image
    print(f"⏱️  Estimated time saved: {time_saved} seconds ({time_saved/60:.1f} minutes)")

  print("="*50)
