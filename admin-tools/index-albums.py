import os
import requests
import json

import yaml

# 🔹 Configuratie
API_SLEUTEL = os.environ.get("bunnyPassword", "JOUW_BUNNY_API_SLEUTEL")
OPSLAGZONE_NAAM = "revue-archief"
REGIO = ""  # Bijvoorbeeld 'ny' of 'de', leeg laten voor standaardregio

# 🔹 API & CDN instellingen
BASE_URL = f"https://{REGIO + '.' if REGIO else ''}storage.bunnycdn.com/{OPSLAGZONE_NAAM}"
CDN_BASE_URL = "https://revue.b-cdn.net/"  # Vervang dit door jouw BunnyCDN Pull Zone
HEADERS = {"AccessKey": API_SLEUTEL}

def haal_bestanden_op(pad=""):
    """Haalt bestanden en mappen op binnen een opgegeven pad."""
    url = f"{BASE_URL}/{pad}/"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"⚠️ Fout bij ophalen {url}: {response.status_code} - {response.text}")
            return []
    except requests.RequestException as e:
        print(f"❌ Netwerkfout bij {url}: {e}")
        return []

def doorzoek_storage(startpad="albums"):
    """Doorloopt alle mappen en verzamelt bestanden recursief met CDN-URL's."""
    bestand_lijst = []
    queue = [startpad]

    while queue:
        huidig_pad = queue.pop(0)
        items = haal_bestanden_op(huidig_pad)

        for item in items:
            volledige_pad = f"{huidig_pad}/{item['ObjectName']}".lstrip("/")
            if item["IsDirectory"]:
                queue.append(volledige_pad)  # Voeg map toe aan queue
            else:
                # Voeg bestand met volledige CDN-URL toe
                bestand_lijst.append({
                    "pad": volledige_pad,
                    "cdn_url": f"{CDN_BASE_URL}{volledige_pad}".replace(" ", "%20")  # Encodeer spaties
                })

    return bestand_lijst


def process_images(bestanden):
    cache = {}
    for item in bestanden:
        if not item["cdn_url"].endswith(".webp") and not item["cdn_url"].endswith(".mp4"):
            continue
        year = item["pad"].split("/")[1]
        if not year in cache:
            with open(f"../content/{year}/data.yaml", "r", encoding="utf-8") as f:
                yaml_data = yaml.safe_load(f)
        else:
            yaml_data = cache[year]

        if not "album" in yaml_data:
            yaml_data["album"] = []

        if not item["cdn_url"] in yaml_data["album"]:
            yaml_data["album"].append(item["cdn_url"])
        cache[year] = yaml_data

    for key in cache:
        with open(f"../content/{key}/data.yaml", "w", encoding="utf-8") as f:
            f.write(yaml.dump(cache[key], allow_unicode=True))


if __name__ == "__main__":
    print("📡 Bestanden ophalen uit BunnyCDN...")
    bestanden = doorzoek_storage()
    print(f"📂 Gevonden bestanden: {len(bestanden)}")
    process_images(bestanden)