import os, glob
import subprocess

# Map met de video's (pas dit aan als nodig)
VIDEO_FOLDER = "/Users/bohanssen/Desktop/tmp/"

def apply_faststart(file_path):
    """Past -movflags +faststart toe op een video zonder hercodering en overschrijft het bestand."""
    temp_file = file_path + ".temp.mp4"

    # FFmpeg command
    command = [
        "ffmpeg", "-i", file_path, "-c", "copy", "-movflags", "+faststart", temp_file, "-y"
    ]

    # Voer het commando uit
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    if result.returncode == 0:
        os.replace(temp_file, file_path)  # Overschrijf het originele bestand
        print(f"✅ Faststart toegepast op: {file_path}")
    else:
        print(f"❌ Fout bij verwerken: {file_path}\n{result.stderr}")

def process_videos(directory):
    """Doorloopt alle MP4-bestanden in de opgegeven map en past faststart toe."""
    for file_path in glob.glob(directory + "**/*.mp4"):
        apply_faststart(file_path)

if __name__ == "__main__":
    process_videos(VIDEO_FOLDER)