import os
from ftplib import FTP

# Configuratie voor BunnyCDN FTP
FTP_HOST = "se.storage.bunnycdn.com"
FTP_USER = "revue"
FTP_PASS = os.environ.get("bunnyPassword")  # Gebruik get() om crashes te voorkomen
BUNNY_FOLDER = input("Geef de map op:").strip()
LOCAL_FOLDER = os.environ.get("videoOutputFolder")

def upload_video_ftp(ftp, video_path):
    """Uploadt een video naar BunnyCDN via FTP."""
    filename = os.path.basename(video_path)

    try:
        with open(video_path, "rb") as file:
            ftp.storbinary(f"STOR {filename}", file)  # Geen dubbel pad
        print(f"✅ {filename} geüpload naar {BUNNY_FOLDER}")
        return True
    except Exception as e:
        print(f"❌ Fout bij uploaden van {filename}: {e}")
        return False

def ensure_directory(ftp, directory):
    """Maakt een map aan als deze nog niet bestaat en gaat erin."""
    try:
        ftp.cwd(directory)  # Probeer naar de map te gaan
    except:
        print(f"📁 Map {directory} bestaat niet, aanmaken...")
        ftp.mkd(directory)  # Maak de map aan
    ftp.cwd(directory)  # Ga naar de map (alleen als het één keer nodig is)

def upload_all_videos():
    """Doorloopt de lokale map en uploadt alle video's via FTP."""
    if not LOCAL_FOLDER or not os.path.exists(LOCAL_FOLDER):
        print(f"❌ De opgegeven lokale map bestaat niet: {LOCAL_FOLDER}")
        return

    videos = [f for f in os.listdir(LOCAL_FOLDER) if f.lower().endswith((".mp4", ".mov", ".avi", ".mkv"))]

    if not videos:
        print("⚠️ Geen video's gevonden om te uploaden.")
        return

    try:
        with FTP(FTP_HOST) as ftp:
            ftp.login(FTP_USER, FTP_PASS)
            ensure_directory(ftp, BUNNY_FOLDER)  # Zorg ervoor dat de map bestaat en ga erheen

            uploaded_files = []
            for video in videos:
                video_path = os.path.join(LOCAL_FOLDER, video)
                if upload_video_ftp(ftp, video_path):
                    uploaded_files.append(video)

            print(f"\n✅ {len(uploaded_files)} bestanden succesvol geüpload:")
            for file in uploaded_files:
                print(f" - {file}")

    except Exception as e:
        print(f"❌ Fout bij FTP-verbinding: {e}")

if __name__ == "__main__":
    upload_all_videos()