import os
from PIL import Image

# Input and output folders
input_folder = './scripts/python/Wiki/digimon-images'
output_folder = './scripts/python/Wiki/digimon-images/converted'

# Ensure the output folder exists
os.makedirs(output_folder, exist_ok=True)

# Loop through PNG files in the input folder
for filename in os.listdir(input_folder):
  if filename.endswith(".png"):
    input_path = os.path.join(input_folder, filename)
    output_path = os.path.join(output_folder, os.path.splitext(filename)[0] + ".webp")

    # Open and convert the image
    img = Image.open(input_path)
    img.save(output_path, 'webp', quality=80)  # You can adjust the quality value if needed
    print(f"Converted  {filename} to {os.path.basename(output_path)}")
