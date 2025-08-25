"""
GetCardImages.py - Download card images from the Digimon Wiki

This script downloads card images from the wiki, but now includes optimization to skip
downloading images that already exist in the src/assets/images/cards directory.

Key features:
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
import requests
from bs4 import BeautifulSoup
import urllib.request
import traceback
from PIL import Image
import random
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

import WikiVariables as WV

# Statistics tracking
download_stats = {
    'skipped': 0,
    'downloaded': 0,
    'failed': 0
}

# Configure requests session with retry strategy
def create_robust_session():
    session = requests.Session()

    # Define retry strategy
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["HEAD", "GET", "OPTIONS"]
    )

    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)

    # Set a user agent to be polite
    session.headers.update({
        'User-Agent': 'Digimon Card App Data Scraper 1.0 (digimoncard.app@gmail.de)'
    })

    return session

# Global session
session = create_robust_session()

def safe_request(url, delay=None):
    """Make a safe HTTP request with error handling and optional delay"""
    if delay:
        time.sleep(delay)

    try:
        response = session.get(url, timeout=30)
        response.raise_for_status()
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
        # Add exponential backoff on error
        time.sleep(random.uniform(2, 5))
        return None

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

    # Get the script's directory and navigate to the assets directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up from scripts/python/Wiki to the project root, then to assets
    assets_path = os.path.join(script_dir, '..', '..', '..', 'src', 'assets', 'images', 'cards')
    full_path = os.path.join(assets_path, webp_filename)

    # Normalize the path
    full_path = os.path.normpath(full_path)

    return os.path.exists(full_path)

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
            urllib.request.urlretrieve(url, save_directory)
            print(f"✅ Downloaded image {id} successfully.")
            download_stats['downloaded'] += 1
            return
        except urllib.error.HTTPError as e:
            if e.code == 503:
                print(f"⚠️  HTTP Error 503: Service Unavailable. Retrying in {retry_delay} seconds...")
                retries += 1
                time.sleep(retry_delay)
            else:
                print(f"❌ HTTP Error {e.code}: {e.reason}")
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

def getCardImages():
  # Backup the AAs and JAAs for each card
  backup_aas = []
  backup_jaas = []

  print("🚀 Starting card image download process...")
  print(f"📊 Processing {len(WV.cardLinks)} card links...")

  # Loop through each card link
  for link in WV.cardLinks:
    try:
      print('Checking ' + link)

      # Get the HTML content for the page
      response = safe_request(WV.wikiLink + link + WV.gallery, delay=random.uniform(0.2, 0.5))
      if not response:
          print(f"Failed to fetch gallery for: {link}")
          continue

      soup = BeautifulSoup(response.content, "html.parser")

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
          # Notes can have a differnet _P then in the Gallery because of the ordering sometimes
          added = False
          for aa in backup_aas:
            if aa['note'] == note_array[0] and added == False:
              if '_P' in id_with_p:
                new_aa = {
                  'id': id_with_p,
                  'illustrator': aa['illustrator'],
                  'note': combined_notes,
                  'type': aa['type']
                }
                card.AAs.append(new_aa)
                added = True
              elif '-Errata' in id_with_p:
                new_aa = {
                  'id': id_with_p,
                  'illustrator': aa['illustrator'],
                  'note': combined_notes,
                  'type': aa['type']
                }
                card.AAs.append(new_aa)
                added = True
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

          added = False
          # Update the JAAs for the card
          for aa in backup_jaas:
            if aa['note'] == note_array[0] and added == False:
              if '_P' in id_with_p:
                new_aa = {
                  'id': id_with_p,
                  'illustrator': aa['illustrator'],
                  'note': combined_notes,
                  'type': aa['type']
                }
                card.JAAs.append(new_aa)
                added = True

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
