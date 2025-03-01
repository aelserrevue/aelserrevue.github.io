import os
import subprocess

# Configuratie
MAP_PAD = "/Users/bohanssen/Desktop/tmp"  # Pas aan naar jouw map
VIDEO_EXTENSIES = (".mp4", ".mov", ".avi", ".mkv")
DREMPEL = 0.1  # Alles onder deze waarde wordt als "0 seconden" beschouwd

def get_video_duration(video_path):
    """Haalt de duur van een video op met ffprobe."""
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", video_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return float(result.stdout.strip()) if result.stdout.strip() else -1
    except Exception as e:
        print(f"❌ Fout bij controleren van {video_path}: {e}")
        return -1

def scan_videos(root_folder):
    """Doorloopt recursief een map en detecteert video's met speeltijd onder de drempel."""
    lege_videos = []

    for root, _, files in os.walk(root_folder):
        for file in files:
            if file.lower().endswith(VIDEO_EXTENSIES):
                video_pad = os.path.join(root, file)
                duur = get_video_duration(video_pad)

                if 0 <= duur < DREMPEL:  # Detecteer video's korter dan de drempelwaarde
                    lege_videos.append(video_pad)
                    print(f"⚠️ Video met korte speeltijd gevonden ({duur:.3f} sec): {video_pad}")

    return lege_videos

if __name__ == "__main__":
    lege_videos = scan_videos(MAP_PAD)

    if lege_videos:
        print("\n📢 Overzicht van video's met (bijna) 0 seconden speeltijd:")
        for video in lege_videos:
            print(f" - {video}")
    else:
        print("✅ Geen video's met 0 seconden speeltijd gevonden!")