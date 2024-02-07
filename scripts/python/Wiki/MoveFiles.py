import os
import shutil


def moveFiles():
  source_folder_data = './scripts/python/Wiki/jsons'
  destination_folder_data = './src/assets/cardlists'

  source_folder_images = './scripts/python/Wiki/digimon-images/converted'
  destination_folder_images = './src/assets/images/cards'

  # Get a list of files in the source folder
  file_list_data = os.listdir(source_folder_data)
  file_list_images = os.listdir(source_folder_images)

  # Loop through the files and copy them
  for filename in file_list_data:
    if 'Links' not in filename:
      if filename.endswith(".json"):
        source_path = os.path.join(source_folder_data, filename)
        destination_path = os.path.join(destination_folder_data, filename)

        # Move the file
        shutil.copyfile(source_path, destination_path)
        print(f"Moved {filename} to {destination_folder_data}")

  for filename in file_list_images:
    if filename.endswith(".webp"):
      source_path = os.path.join(source_folder_images, filename)
      destination_path = os.path.join(destination_folder_images, filename)

      # Move the file
      shutil.move(source_path, destination_path)
      print(f"Moved {filename} to {destination_folder_images}")
