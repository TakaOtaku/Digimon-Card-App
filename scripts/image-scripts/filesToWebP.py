import os
import subprocess


def convert_to_webp(input_directory, output_directory, quality=60):
    for root, _, files in os.walk(input_directory):
        for file in files:
            if file.endswith(".webp"):
                input_file_path = os.path.join(root, file)
                output_file_path = os.path.join(output_directory, file)
                subprocess.run(
                    ["cwebp", "-q", str(quality), input_file_path, "-o", output_file_path], check=True)


# Replace these with the actual input and output directories
input_directory = "images"
output_directory = "conv"

convert_to_webp(input_directory, output_directory)
