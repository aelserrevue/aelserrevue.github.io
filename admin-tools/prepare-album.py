import os
import sys
import subprocess

# Configuratie
INPUT_FOLDER = os.environ.get("videoInputFolder", "./input")
OUTPUT_FOLDER = os.environ.get("videoOutputFolder", "./output")

# Ondersteunde formaten
VIDEO_EXTENSIONS = (".mp4", ".mov", ".avi", ".mkv")
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png")

# Keuze voor output-formaat (WebP of AVIF)
FORMAT = "webp" #"avif"

if FORMAT not in ["webp", "avif"]:
    print("❌ Ongeldig formaat! Kies 'webp' of 'avif'.")
    sys.exit(1)

# Zorg dat de outputmap bestaat
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def ensure_output_directory(output_path):
    """Zorgt ervoor dat de output-directory bestaat voordat een bestand wordt opgeslagen."""
    output_dir = os.path.dirname(output_path)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"📁 Submap aangemaakt: {output_dir}")

def optimize_video(input_path, output_path):
    """Converteert en optimaliseert video's met FFmpeg."""
    if os.path.exists(output_path):
        print(f"⏩ Video {output_path} bestaat al, overslaan...")
        return

    print(f"\n🚀 Converting video: {input_path} -> {output_path}")

    ensure_output_directory(output_path)

    command = [
        "ffmpeg", "-i", input_path,
        "-c:v", "libx264", "-crf", "22", "-preset", "fast",
        "-c:a", "aac", "-b:a", "192k",
        "-movflags", "+faststart",
        output_path
    ]

    process = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    print(f"✅ Video geconverteerd: {output_path}")

def optimize_image(input_path, output_image):
    """Optimaliseert afbeeldingen naar WebP of AVIF met FFmpeg."""
    if os.path.exists(output_image):
        print(f"⏩ Afbeelding {output_image} bestaat al, overslaan...")
        return

    print(f"\n🖼️ Optimaliseren afbeelding ({FORMAT}): {input_path}")

    ensure_output_directory(output_image)

    # FFmpeg commando voor WebP of AVIF
    command = ["ffmpeg", "-i", input_path, "-q:v", "5", output_image]

    subprocess.run(command)
    print(f"✅ Geoptimaliseerd {FORMAT.upper()}: {output_image}")

def process_media():
    """Doorloopt de inputmap en optimaliseert media."""
    for root, _, files in os.walk(INPUT_FOLDER):
        for file in files:
            input_path = os.path.join(root, file)
            relative_path = os.path.relpath(input_path, INPUT_FOLDER)
            output_path = os.path.join(OUTPUT_FOLDER, os.path.splitext(relative_path)[0])

            # Video's optimaliseren
            if file.lower().endswith(VIDEO_EXTENSIONS):
                optimize_video(input_path, output_path + "_web.mp4")

            # Afbeeldingen optimaliseren (WebP of AVIF afhankelijk van parameter)
            elif file.lower().endswith(IMAGE_EXTENSIONS):
                optimize_image(input_path, output_path + f"_opt.{FORMAT}")

if __name__ == "__main__":
    print(f"📂 Input map: {INPUT_FOLDER}")
    print(f"📂 Output map: {OUTPUT_FOLDER}")
    print(f"🎯 Genereren als: {FORMAT.upper()}")
    process_media()
    print("\n✅ Alle media geoptimaliseerd!")