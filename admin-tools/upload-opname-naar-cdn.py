import os
import requests
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

# Configuratie
API_SLEUTEL = os.environ.get("bunnyPassword", "JOUW_BUNNY_API_SLEUTEL")
OPSLAGZONE_NAAM = 'revue-archief'
REGIO = ''  # Laat leeg als er geen regio nodig is
MAP_PAD = '/Users/bohanssen/Desktop/tmp'  # Pas aan naar jouw lokale map
MAX_WERKDRAADEN = 6  # Maximale gelijktijdige uploads
UPDATE_INTERVAL = 5  # Om de hoeveel seconden de queue-grootte wordt geprint

# Basis URL instellen
basis_url = f"https://{REGIO + '.' if REGIO else ''}storage.bunnycdn.com/{OPSLAGZONE_NAAM}"
HEADERS = {'AccessKey': API_SLEUTEL}

# Globale variabele om het aantal resterende bestanden bij te houden
queue_lock = threading.Lock()
remaining_files = 0


def bestand_bestaat_op_server(bestandspad):
    """Controleer of een bestand al op BunnyCDN staat via een directory listing."""
    directory = "/".join(bestandspad.split("/")[:-1])  # Map van het bestand bepalen
    url = f"{basis_url}/{directory}/"  # URL voor directory listing

    try:
        response = requests.get(url, headers=HEADERS, timeout=5)  # Vraag directorylijst op
        if response.status_code == 200:
            bestanden = [item["ObjectName"] for item in response.json()]
            return bestandspad.split("/")[-1] in bestanden  # Bestand vergelijken met lijst
        else:
            print(f"⚠️ Onverwachte status {response.status_code} voor {directory}: {response.text}")
            return False
    except requests.RequestException as e:
        print(f"❌ Fout bij controle van {bestandspad}: {e}")
        return False


def upload_bestand(lokaal_pad, remote_pad):
    """Upload een bestand naar BunnyCDN en log de tijd en snelheid."""
    global remaining_files

    print(f"🔍 Controleren of {remote_pad} al bestaat...")
    if bestand_bestaat_op_server(remote_pad):
        print(f"⏩ Bestand bestaat al, overslaan: {remote_pad}")
        with queue_lock:
            remaining_files -= 1
        return f"⏩ Overgeslagen: {remote_pad}"

    print(f"🚀 Upload starten: {remote_pad}")
    start_time = time.time()  # Start timer
    bestandsgrootte = os.path.getsize(lokaal_pad)  # Bestandsgrootte in bytes

    try:
        with open(lokaal_pad, 'rb') as f:
            response = requests.put(f"{basis_url}/{remote_pad}", headers=HEADERS, data=f)

        duration = time.time() - start_time  # Bereken tijdsduur
        with queue_lock:
            remaining_files -= 1  # Verminder het aantal resterende bestanden

        if response.status_code == 201:
            snelheid_kibps = (bestandsgrootte / 1024) / duration  # KiB/s berekenen
            print(f"✅ Succesvol geüpload: {remote_pad} (⏱️ {duration:.2f} sec, 🚀 {snelheid_kibps:.2f} KiB/s)")
            return f"✅ Geüpload: {remote_pad} (⏱️ {duration:.2f} sec, 🚀 {snelheid_kibps:.2f} KiB/s)"
        else:
            foutmelding = f"❌ Fout {response.status_code}: {response.text}"
            print(foutmelding)
            return foutmelding

    except requests.RequestException as e:
        duration = time.time() - start_time  # Ook bij fouten loggen we de tijd
        print(f"❌ Upload mislukt voor {remote_pad} ({duration:.2f} sec): {e}")
        return f"❌ Mislukt: {remote_pad} ({duration:.2f} sec) - {e}"


def print_queue_status():
    """Periodiek de resterende bestanden in de queue tonen."""
    while remaining_files > 0:
        with queue_lock:
            print(f"📊 Bestanden in queue: {remaining_files} over.")
        time.sleep(UPDATE_INTERVAL)


def main():
    global remaining_files

    # Verzamel alleen .mp4 bestanden
    bestanden = []
    for root, _, files in os.walk(MAP_PAD):
        for file in files:
            if file.lower().endswith(".mp4"):  # Alleen .mp4 bestanden
                lokaal_pad = os.path.join(root, file)
                relatieve_pad = os.path.relpath(lokaal_pad, MAP_PAD)
                remote_pad = relatieve_pad.replace(os.path.sep, '/')
                bestanden.append((lokaal_pad, remote_pad))

    remaining_files = len(bestanden)  # Aantal bestanden instellen
    print(f"📂 Gevonden MP4-bestanden: {remaining_files} om te uploaden.")

    # Start de thread om de queue-status te tonen
    status_thread = threading.Thread(target=print_queue_status, daemon=True)
    status_thread.start()

    # Gebruik ThreadPoolExecutor om parallel uploads uit te voeren
    with ThreadPoolExecutor(max_workers=MAX_WERKDRAADEN) as executor:
        future_to_file = {executor.submit(upload_bestand, lokaal, remote): remote for lokaal, remote in bestanden}

        for future in as_completed(future_to_file):
            result = future.result()  # Wacht op resultaat
            print(result)  # Print uploadstatus

    print("✅ Alle bestanden zijn verwerkt!")


if __name__ == "__main__":
    main()