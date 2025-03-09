import asyncio
import aiohttp
import re
import traceback
import os
import urllib.request
import time
from bs4 import BeautifulSoup
from BunnyCDN.Storage import Storage
from BunnyCDN.CDN import CDN

import WikiVariables as WV

# BunnyCDN configuration
username = "digimon-card-app"
hostname = "digimon-card-app.b-cdn.net"
storage_api_key = "ece19f0f-6948-45b6-b53c262ef756-ae4d-4cc1"
account_api_key = "5b35403c-a21c-4f7a-ae65-7eb0a3618656890d41f0-4de7-4411-9aff-ad58b52fa1a8"
storage_zone_name = "digimon-card-app"
cdn_path = ""

temp_dir = "./scripts/python/Wiki/digimon-images/"

def extract_base_filenames(file_dict_list):
  base_filenames = []
  
  for file_dict in file_dict_list:
    filename = file_dict.get('File_Name', '')
    # Remove file extension using os.path.splitext
    base_name = os.path.splitext(filename)[0]
    base_filenames.append(base_name)
  
  return base_filenames

async def fetch_page(session, url, max_retries=3, retry_delay=1):
  """Fetch a page with retry logic"""
  for attempt in range(max_retries):
    try:
      async with session.get(url) as response:
        if response.status == 200:
          return await response.text()
        # Handle rate limiting
        if response.status == 429:
          wait_time = retry_delay * (2 ** attempt)
          print(f"Rate limited, waiting {wait_time}s before retry...")
          await asyncio.sleep(wait_time)
          continue
        print(f"Error {response.status} for URL: {url}")
        return None
    except Exception as e:
      print(f"Error fetching {url} (attempt {attempt+1}/{max_retries}): {e}")
      if attempt < max_retries - 1:
        await asyncio.sleep(retry_delay)
  return None

async def download_image(session, url, save_path, max_retries=3, retry_delay=1):
  """Download an image file asynchronously with retry logic"""
  for attempt in range(max_retries):
    try:
      async with session.get(url) as response:
        if response.status == 200:
          with open(save_path, 'wb') as f:
            f.write(await response.read())
          return True
        # Handle rate limiting
        if response.status == 429:
          wait_time = retry_delay * (2 ** attempt)
          print(f"Rate limited, waiting {wait_time}s before retry...")
          await asyncio.sleep(wait_time)
          continue
        print(f"Error {response.status} downloading image: {url}")
        return False
    except Exception as e:
        print(f"Error downloading {url} (attempt {attempt+1}/{max_retries}): {e}")
        if attempt < max_retries - 1:
          await asyncio.sleep(retry_delay)
  return False

def remove_suffix_and_extension(input_string):
  # Remove the ".webp" extension or ".png" extension
  without_extension = re.sub(r'\.(webp|png)$', '', input_string)

  # Remove the "_Px" suffix (where x can be any number)
  without_suffix = re.sub(r'_P\d+', '', without_extension)

  return without_suffix

def upload_to_bunny(local_path, image_id):
  """Upload a file to BunnyCDN"""
  try:
    obj_storage = Storage(storage_api_key, storage_zone_name)
    success = obj_storage.PutFile(f"{os.path.basename(local_path)}", None, local_path)
    
    if success:
      print(f"Uploaded to BunnyCDN: {image_id}")
      return True
    else:
      print(f"Failed to upload to BunnyCDN: {image_id}")
      return False
  except Exception as e:
    print(f"Error uploading to BunnyCDN {image_id}: {e}")
    return False

async def process_card_gallery(session, link, card, existing_cdn_files):
  """Process a card's gallery page"""
  try:
    print(f'Checking {link}')
    
    # Get the ID of the card
    id = link.split("/")[2]
    id_without_p = remove_suffix_and_extension(id)
    
    # Get the HTML content for the page
    content = await fetch_page(session, WV.wikiLink + link + WV.gallery)
    if not content:
      print(f"Could not fetch gallery for: {link}")
      return
        
    soup = BeautifulSoup(content, "html.parser")
    
    # Backup the AAs and JAAs for the card
    backup_aas = card.AAs.copy()
    backup_jaas = card.JAAs.copy()
    
    # Reset the AAs and JAAs
    card.AAs = []
    card.JAAs = []
    
    # Process English gallery
    div = soup.find("div", id="gallery-0")
    if div is not None:
      await process_gallery_items(session, div, card, backup_aas, existing_cdn_files, False)
    
    # Process Japanese gallery
    div_j = soup.find("div", id="gallery-1")
    if div_j is not None:
      await process_gallery_items(session, div_j, card, backup_jaas, existing_cdn_files, True)
          
  except Exception as e:
    print(f"Error processing gallery for {link}: {e}")
    traceback.print_exc()

async def process_gallery_items(session, gallery_div, card, backup_data, existing_cdn_files, is_japanese=False):
  """Process gallery items for a card"""
  gallery_items = gallery_div.find_all("div", class_="wikia-gallery-item")
  
  for item in gallery_items:
    img = item.find("img")
    
    id_with_p = None
    if img is None:
      noImage = item.find("a", class_="image-no-lightbox")
      if not noImage:
        continue
      # Remove .png from the text and replace spaces with underscores
      id_with_p = re.sub(r'\.png$', '', noImage.text)
      id_with_p = re.sub(r'\s', '_', id_with_p)
    else:
      id_with_p = re.sub(r'\.png$', '', img['data-image-key'])
      
      # Check if this image already exists in BunnyCDN
      if id_with_p in existing_cdn_files or f"{id_with_p}.webp" in existing_cdn_files:
        print(f"Image {id_with_p} already exists in CDN, skipping download")
      else:
        # Image doesn't exist, download it
        src = img['src'].split("/latest")[0]
        save_location = src + '/latest'
        save_location = save_location.replace('-j', '-J')
        
        # Temporarily save the image locally
        local_path = os.path.join(temp_dir, f"{id_with_p}.png")
        
        if await download_image(session, save_location, local_path):
          print(f"Downloaded image {id_with_p} successfully.")
          
          # Upload to BunnyCDN
          if upload_to_bunny(local_path, id_with_p):
            # Remove local file after successful upload
            try:
              os.remove(local_path)
            except:
              pass
                  
    # Extract caption/notes
    captions = item.find("div", class_="lightbox-caption")
    if not captions:
      continue
        
    notes = captions.find_all("a")
    if not notes or len(notes) == 0:
      continue
    
    note_array = [note.text for note in notes]
    combined_notes = " / ".join(note_array)
      
    # Update notes or add to AAs/JAAs
    if is_japanese:
      # Update JAAs
      added = False
      for aa in backup_data:
        if aa['note'] == note_array[0] and not added:
          if '_P' in id_with_p:
            new_aa = {
              'id': id_with_p,
              'illustrator': aa['illustrator'],
              'note': combined_notes,
              'type': aa['type']
            }
            card.JAAs.append(new_aa)
            added = True
    else:
      # Update notes or AAs for English
      if card.notes == note_array[0]:
        card.notes = combined_notes
          
      added = False
      for aa in backup_data:
        if aa['note'] == note_array[0] and not added:
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

async def getCardImages(session, batch_size=10):
  """Main function to get card images using async with BunnyCDN integration"""
  # First, check what's already in BunnyCDN
  try:
    obj_storage = Storage(storage_api_key, storage_zone_name)
    
    # Get list of files already in CDN
    cdn_files = obj_storage.GetStoragedObjectsList()
    existing_cdn_files = extract_base_filenames(cdn_files)
    print(f"Found {len(existing_cdn_files)} files already in BunnyCDN")
    
    # Process cards in batches
    for i in range(0, len(WV.cardLinks), batch_size):
      batch_links = WV.cardLinks[i:i + batch_size]
      
      tasks = []
      for link in batch_links:
        # Find the card object with the matching ID
        id = link.split("/")[2]
        id_without_p = remove_suffix_and_extension(id)
        
        card = None
        for obj in WV.cards:
          if obj.id == id_without_p:
            card = obj
            break
        
        if card is not None:
          tasks.append(process_card_gallery(session, link, card, existing_cdn_files))
      
      # Process batch concurrently
      await asyncio.gather(*tasks)
      
      # Add a small delay between batches to be nice to the server
      if i + batch_size < len(WV.cardLinks):
        await asyncio.sleep(0.5)
    
    # Clean up temp directory
    for file in os.listdir(temp_dir):
      try:
        os.remove(os.path.join(temp_dir, file))
      except:
        pass
                
  except Exception as e:
    print(f"Error in getCardImages: {e}")
    traceback.print_exc()
