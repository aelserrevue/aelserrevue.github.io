import os
import json
import re

# Zorg ervoor dat de dropbox-map bestaat
DROPBOX_MAP = "../dropbox"
os.makedirs(DROPBOX_MAP, exist_ok=True)

def clean_text(text):
    """Verwijdert zero-width en niet-zichtbare spaties."""
    return re.sub(r'[\u200B\uFEFF]', '', text)

def lees_markdown_bestanden(map_pad):
    """Doorloopt alle .md bestanden en zet ze om naar JSON"""
    data = []

    for root, _, files in os.walk(map_pad):
        for file in files:
            if file.endswith(".md"):
                bestandspad = os.path.join(root, file)
                with open(bestandspad, "r", encoding="utf-8") as f:
                    inhoud = f.read()

                # Parsing de markdown structuur en opschonen
                parsed_data = parse_markdown(inhoud)
                parsed_data["bestand"] = file  # Voeg bestandsnaam toe voor referentie

                # Opschonen van tekstvelden
                for key in ["id", "titel", "beschrijving"]:
                    if parsed_data.get(key):
                        parsed_data[key] = clean_text(parsed_data[key])

                parsed_data["medewerkers"] = [clean_text(m) for m in parsed_data["medewerkers"]]

                data.append(parsed_data)

    return data

def parse_markdown(inhoud):
    """Parset markdown en haalt ID, Titel, Beschrijving en Medewerkers op"""
    parsed_data = {}

    # ID
    id_match = re.search(r"<!-- id -->\n([\d-]+)", inhoud)
    parsed_data["id"] = id_match.group(1) if id_match else None

    # Titel
    titel_match = re.search(r"<!-- Titel -->\n(.+)", inhoud)
    parsed_data["titel"] = titel_match.group(1) if titel_match else None

    # Beschrijving (alles tussen <!-- Beschrijving --> en <!-- Medewerkers -->)
    beschrijving_match = re.search(r"<!-- Beschrijving -->\n(.*?)\n<!-- Medewerkers -->", inhoud, re.DOTALL)
    parsed_data["beschrijving"] = beschrijving_match.group(1).strip() if beschrijving_match else None

    # Medewerkers (lijst van namen onder <!-- Medewerkers -->)
    medewerkers_match = re.search(r"<!-- Medewerkers -->\n(.*)", inhoud, re.DOTALL)
    if medewerkers_match:
        medewerkers = medewerkers_match.group(1).strip().split("\n")
        parsed_data["medewerkers"] = [m.strip() for m in medewerkers if m.strip()]
    else:
        parsed_data["medewerkers"] = []

    return parsed_data

def verwerk_wijzigingen(data):
    for item in data:
        print(item)
        if "-" in item["id"]:
            print("video")
        else:
            with open(f"../content/{item['id']}/README.md","w") as f:
                f.write(item["beschrijving"])

if __name__ == "__main__":
    json_data = lees_markdown_bestanden(DROPBOX_MAP)
    verwerk_wijzigingen(json_data)