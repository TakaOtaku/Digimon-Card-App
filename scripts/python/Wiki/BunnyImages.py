from BunnyCDN.Storage import Storage
from BunnyCDN.CDN import CDN
import os
import re
import json

card_images_path = "./src/assets/images/cards/"

username = "digimon-card-app"
hostname = "digimon-card-app.b-cdn.net"
storage_api_key = "ece19f0f-6948-45b6-b53c262ef756-ae4d-4cc1"
account_api_key = "5b35403c-a21c-4f7a-ae65-7eb0a3618656890d41f0-4de7-4411-9aff-ad58b52fa1a8"
storage_zone_name = "digimon-card-app"

obj_storage = Storage(storage_api_key,storage_zone_name)
obj_cdn = CDN(account_api_key)

def extract_base_filenames(file_dict_list):
    base_filenames = []
    
    for file_dict in file_dict_list:
        filename = file_dict.get('File_Name', '')
        # Remove file extension using os.path.splitext
        base_name = os.path.splitext(filename)[0]
        base_filenames.append(base_name)
    
    return base_filenames

def sync_cards_to_cdn(obj_storage, local_directory, storedCards):
    """
    Upload local cards to CDN that aren't already uploaded.
    Only uploads files that don't exist on the CDN (checks by base filename).
    
    Args:
        obj_storage: Your Bunny CDN storage object
        local_directory: Directory containing your local card images
        cdn_path: Path on CDN where cards should be stored
    
    Returns:
        list: Names of files that were uploaded
    """
    # Get all local card files
    uploaded_files = []
    
    # Walk through local directory
    for root, _, files in os.walk(local_directory):
        for file in files:
            if file.lower().endswith(('.webp', '.jpg', '.png', '.jpeg')):
                local_path = os.path.join(root, file)
                base_filename = os.path.splitext(file)[0]
                
                # Check if this card exists on CDN
                if base_filename not in storedCards:
                    # File doesn't exist on CDN, upload it
                    try:
                        cdn_file_path = f"{file}"
                        success = obj_storage.PutFile(cdn_file_path, None, card_images_path)
                        
                        if success:
                            print(f"Uploaded: {file}")
                            uploaded_files.append(file)
                        else:
                            print(f"Failed to upload: {file}")
                    except Exception as e:
                        print(f"Error uploading {file}: {e}")
                else:
                    print(f"Skipping {file} - already exists on CDN")
    
    print(f"Successfully uploaded {len(uploaded_files)} new files to CDN")
    return uploaded_files


storageZones = obj_cdn.StorageZoneData()
print(storageZones)
allCards = extract_base_filenames(obj_storage.GetStoragedObjectsList())
print(allCards)
uploaded = sync_cards_to_cdn(obj_storage, card_images_path,allCards)
print(uploaded)
#>>obj_storage.PutFile(file_name, storage_path=None, local_upload_file_path(optional) )
