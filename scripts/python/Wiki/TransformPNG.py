import os
from PIL import Image

# Convert all PNG files in a folder to WebP
def pngToWebP():
  # Input and output folders
  input_folder = './scripts/python/Wiki/digimon-images'
  output_folder = './scripts/python/Wiki/digimon-images'

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

def singlePngToWebP(filepath, idOfCard):
  try:
    # Input and output folders
    output_folder = './scripts/python/Wiki/digimon-images'

    # Ensure the output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # Loop through PNG files in the input folder
    input_path = filepath
    output_path = os.path.join(output_folder, idOfCard + ".webp")

    # Open and convert the image
    img = Image.open(input_path)
    img.save(output_path, 'webp', quality=80)  # You can adjust the quality value if needed
    print(f"Converted  {idOfCard} to {os.path.basename(output_path)}")
  except Exception as e:
    print(f"Error uploading to BunnyCDN {image_id}: {e}")
