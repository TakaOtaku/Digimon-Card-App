import os

folder_path = './scripts/python/Wiki/digimon-images'

# List all files in the folder
file_list = os.listdir(folder_path)

# Loop through the files and delete PNGs
for filename in file_list:
  if filename.endswith('.png'):
    file_path = os.path.join(folder_path, filename)
    os.remove(file_path)
    print(f"Deleted: {file_path}")
