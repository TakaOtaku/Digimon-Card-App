import os
from PIL import Image, ImageFile

def validate_png(file_path):
    """
    Checks if the specified file is a valid PNG image.
    
    Attempts to open and verify the image at the given file path using Pillow. Returns
    True if the image is valid and can be verified, otherwise returns False.
    
    Args:
        file_path: Path to the image file to validate.
    
    Returns:
        True if the file is a valid PNG image, False otherwise.
    """
    try:
        with Image.open(file_path) as img:
            img.verify()  # Verify that it's a valid image
        return True
    except Exception:
        return False

def pngToWebP():
    # Set this to True to allow PIL to load truncated files
    """
    Converts all valid PNG images in a directory to WebP format.
    
    Iterates through PNG files in the specified input directory, validates each image, and converts valid images to WebP format with quality set to 80. Outputs converted files to a designated output directory, creating it if necessary. Prints a summary of successful and failed conversions, including the names of any files that could not be converted.
    """
    ImageFile.LOAD_TRUNCATED_IMAGES = True
    
    # Input and output folders
    input_folder = './scripts/python/Wiki/digimon-images'
    output_folder = './scripts/python/Wiki/digimon-images/converted'

    # Ensure the output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # Keep track of success and failures
    success_count = 0
    failure_count = 0
    failed_files = []

    # Loop through PNG files in the input folder
    for filename in os.listdir(input_folder):
        if filename.endswith(".png"):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, os.path.splitext(filename)[0] + ".webp")

            if validate_png(input_path):
              try:
                  # Open and convert the image
                  img = Image.open(input_path)
                  img.save(output_path, 'webp', quality=80)
                  print(f"Converted {filename} to {os.path.basename(output_path)}")
                  success_count += 1
              except Exception as e:
                  print(f"ERROR: Could not convert {filename}: {str(e)}")
                  failed_files.append(filename)
                  failure_count += 1
    
    # Print summary
    print(f"\nConversion complete: {success_count} files converted, {failure_count} files failed")
    if failure_count > 0:
        print("Failed files:")
        for file in failed_files:
            print(f"  - {file}")