import os
from PIL import Image, UnidentifiedImageError
import sys

# --- Configuration ---
# Maximum intensity for the blue channel (0-255). Lower values mean darker blues.
# Good values are typically between 100 and 180 for "dark blue".
MAX_BLUE_VALUE = 150

# Define allowed image extensions (case-insensitive)
ALLOWED_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff', '.webp')
# -------------------

def calculate_dark_blue_shade(pixel_value):
    """
    Calculates a dark blue shade based on a grayscale pixel value (0-255).
    Maps the brightness to the blue channel, keeping red and green at 0.
    """
    # Ensure pixel_value is within the valid range
    pixel_value = max(0, min(255, pixel_value))
    # Linearly map the brightness (0-255) to the blue range (0-MAX_BLUE_VALUE)
    blue = int((pixel_value / 255) * MAX_BLUE_VALUE)
    return (0, 0, blue) # Return (R, G, B) tuple

def process_image(input_path, output_path):
    """
    Opens an image, converts it to dark blue shades, and saves it.
    Preserves transparency if present.
    """
    try:
        # Open the image
        img = Image.open(input_path)
        print(f"Processing: {input_path}")

        # Ensure we work with RGBA to handle transparency properly
        img_rgba = img.convert("RGBA")
        width, height = img_rgba.size
        
        # Get pixel data
        original_pixels = list(img_rgba.getdata())
        new_pixels = []

        for r, g, b, a in original_pixels:
            # Calculate grayscale brightness using the luminosity method (more accurate than simple average)
            # Formula: Y = 0.299*R + 0.587*G + 0.114*B
            brightness = int(0.299 * r + 0.587 * g + 0.114 * b)
            
            # Get the corresponding dark blue shade
            blue_r, blue_g, blue_b = calculate_dark_blue_shade(brightness)
            
            # Append the new pixel with original alpha
            new_pixels.append((blue_r, blue_g, blue_b, a))

        # Create a new image with the modified pixels
        new_img = Image.new("RGBA", (width, height))
        new_img.putdata(new_pixels)

        # Create output directory if it doesn't exist
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # Save the new image, trying to keep the original format if possible
        # Pillow usually infers format from extension, fallback to PNG for safety with RGBA
        try:
            new_img.save(output_path)
        except ValueError: # Fallback if format couldn't be determined or doesn't support RGBA
             print(f"  Warning: Could not save in original format, saving as PNG: {output_path}.png")
             # Attempt to save as PNG if original format failed (e.g. JPG doesn't support alpha)
             png_output_path = os.path.splitext(output_path)[0] + ".png"
             new_img.save(png_output_path, "PNG")
        except Exception as save_err:
             print(f"  Error saving image {output_path}: {save_err}")


    except UnidentifiedImageError:
        print(f"Skipping non-image or corrupted file: {input_path}")
    except Exception as e:
        print(f"Error processing file {input_path}: {e}")


def process_folder_recursively(source_folder, destination_folder):
    """
    Walks through the source folder recursively and processes all valid images.
    """
    source_folder = os.path.abspath(source_folder)
    destination_folder = os.path.abspath(destination_folder)

    if not os.path.isdir(source_folder):
        print(f"Error: Source folder '{source_folder}' not found.")
        return

    if source_folder == destination_folder:
        print("Error: Source and destination folders cannot be the same.")
        print("Please choose a different destination folder to avoid overwriting originals.")
        return
        
    print(f"Starting image processing...")
    print(f"Source:      {source_folder}")
    print(f"Destination: {destination_folder}")
    print("-" * 30)

    processed_count = 0
    skipped_count = 0

    for root, _, files in os.walk(source_folder):
        for filename in files:
            # Check if the file extension is in our allowed list
            if filename.lower().endswith(ALLOWED_EXTENSIONS):
                input_path = os.path.join(root, filename)

                # Calculate the relative path from the source folder
                relative_path = os.path.relpath(input_path, source_folder)

                # Construct the corresponding output path in the destination folder
                output_path = os.path.join(destination_folder, relative_path)

                process_image(input_path, output_path)
                processed_count += 1
            else:
                 # Optionally print skipped files
                 # print(f"Skipping non-image file: {filename}")
                 skipped_count +=1


    print("-" * 30)
    print(f"Processing complete.")
    print(f"Processed images: {processed_count}")
    if skipped_count > 0:
       print(f"Skipped non-image files: {skipped_count}")


# --- Main Execution ---
if __name__ == "__main__":
    print("--- Image to Dark Blue Converter ---")

    while True:
        input_dir = input("Enter the path to the SOURCE folder containing images: ")
        if os.path.isdir(input_dir):
            break
        else:
            print(f"Error: Folder not found at '{input_dir}'. Please try again.")

    default_output_dir = os.path.join(input_dir, "_dark_blue_output")
    output_dir_prompt = f"Enter the path for the DESTINATION folder (leave blank to use '{default_output_dir}'): "
    output_dir = input(output_dir_prompt) or default_output_dir

    process_folder_recursively(input_dir, output_dir)
    
    # Keep console open until user presses Enter (optional)
    # input("Press Enter to exit...") 