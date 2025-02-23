import os
import json
import traceback
import shutil
import yaml

folder = "./content/"

def prepare(edition):
    if not os.path.exists(edition + "/entity.json"):
        return
    newData = {}
    with open(edition + "/entity.json", "r", encoding="utf-8") as file:
        data = json.load(file)
        newData["edition"] = data["edition"]
        newData["title"] = data["title"]
        newData["video"] = []

    try:
        for v in os.listdir(edition + "/video"):
            try:
                with open(edition + "/video/" + v + "/entity.json", "r", encoding="utf-8") as file:
                    vdata = json.load(file)
                newData["video"].append({
                    "id": vdata["id"],
                    "title": vdata["title"],
                    "sequence": vdata["sequence"]
                })
                with open(edition + "/video/" + v + "/README.md", "r", encoding="utf-8") as file:
                    video_tekst = file.read()
                with open(edition + "/video/" + str(data["edition"]) + "-" + str(v) + ".md", "w") as f:
                    f.write(video_tekst)
                shutil.rmtree(edition + "/video/" + v)
            except:
                print(traceback.format_exc())
    except:
        print(traceback.format_exc())

    # Sort videos by sequence
    newData["video"] = sorted(newData["video"], key=lambda x: x["sequence"])

    # Write to YAML with allow_unicode=True to avoid escaping characters
    yaml_data = yaml.dump(newData, allow_unicode=True)

    with open(edition + "/data.yaml", "w", encoding="utf-8") as f:
        f.write(yaml_data)
    os.remove(edition + "/entity.json")

for x in os.listdir(folder):
    prepare(folder + x)