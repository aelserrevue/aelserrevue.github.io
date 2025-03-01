import os, time, glob, shutil, subprocess, traceback, yaml, json
global server
server = None
reload_interval_in_seconds = 1


def start_server():
    global server
    server = subprocess.Popen(["python3","-m", "http.server", "8181", "--directory", "./tmp/"])


def stop_server():
    server.terminate()


def create_folder():
    try:
        os.mkdir("./tmp")
    except:
        pass


def remove_folder():
    try:
        shutil.rmtree('./tmp')
    except:
        pass


def copy_source():
    files = glob.glob('./**/*.*', recursive = True)
    for src in files:
        src = src.replace(os.sep,"/")
        if "./tmp/" in src or "/venv/" in src or "dropbox/" in src:
            continue
        dst = src.replace("./",f"./tmp/")
        if not dst.endswith("index.html") and not "/components/" in dst:
            dst = dst.replace(".html","/index.html")
        head, tail = os.path.split(dst)
        os.makedirs(head, exist_ok=True)
        shutil.copyfile(src, dst)


def show_activity_bar(x):
    print('\b' + x.ljust(10) + "\r", end="", flush=True)
    x += "#"
    if len(x) > 10:
        x = ""
    time.sleep(reload_interval_in_seconds)
    return x


def get_sorted_yaml_data(content_dir="./content"):
    data_list = []

    # Loop door alle subdirectories in ./content
    for folder in os.listdir(content_dir):
        folder_path = os.path.join(content_dir, folder)
        yaml_file = os.path.join(folder_path, "data.yaml")
        readme = os.path.join(folder_path, "README.md")
        medewerkers = os.path.join(folder_path, "medewerkers.txt")
        # Controleer of de folder een jaartal is en het YAML-bestand bestaat
        if folder.isdigit() and os.path.exists(yaml_file):
            with open(yaml_file, "r", encoding="utf-8") as f:
                yaml_data = yaml.safe_load(f)  # Laad YAML-inhoud als een dictionary
                yaml_data["year"] = int(folder)  # Voeg het jaartal toe aan het object
                yaml_data["id"] = str(yaml_data["edition"])
            with open(readme,"r") as f:
                yaml_data["description"] = f.read()
            with open(medewerkers,"r") as f:
                yaml_data["crew"] = f.read().replace("\n ","\n").strip()
            for video in yaml_data["video"]:
                readme = os.path.join(folder_path, "video/" + video["id"] + ".md")
                try:
                    with open(readme,"r") as f:
                        video["description"] = f.read()
                except:
                    pass
                video["source"] = f"https://revue.b-cdn.net/{yaml_data['year']}/{video['sequence']}.mp4"
            data_list.append(yaml_data)  # Voeg toe aan de lijst

    # Sorteer van 2025 naar 1978
    sorted_data = sorted(data_list, key=lambda x: x["year"], reverse=True)

    # Converteer naar JSON-string
    json_output = json.dumps(sorted_data, indent=4, ensure_ascii=False)

    return json_output


def prepare_data():
    result = get_sorted_yaml_data()
    with open("./content/index.json", "w") as f:
        f.write(result)


def watch_source():
    x = ""
    while True:
        try:
            prepare_data()
            copy_source()
            x = show_activity_bar(x)
        except:
            print(traceback.format_exc())
            return


if __name__ == "__main__":
    print("Stop de server middels ctrl-c")
    create_folder()
    start_server()
    watch_source()
    stop_server()
    remove_folder()