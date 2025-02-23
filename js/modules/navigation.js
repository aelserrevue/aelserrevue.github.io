
async function fetch_markdown(path){
    let response = await fetch(path);
    if (!response.ok) return "";
    return await response.text();
}

function findPrevNext(array, id) {
    let index = array.findIndex(item => item.id === id);

    if (index === -1) return { prev: null, next: null }; // ID niet gevonden

    return {
        prev: index > 0 ? JSON.parse(JSON.stringify(array[index - 1])) : null,
        next: index < array.length - 1 ? JSON.parse(JSON.stringify(array[index + 1])) : null
    };
}

function applyDaisyUIStyling(html) {
    let div = document.createElement("div");
    div.innerHTML = html;

    // Voeg DaisyUI styling toe aan relevante elementen
    div.querySelectorAll("p").forEach(el => el.classList.add("mb-4"));
    div.querySelectorAll("h1").forEach(el => el.classList.add("text-3xl", "font-bold", "mb-4"));
    div.querySelectorAll("h2").forEach(el => el.classList.add("text-2xl", "font-semibold", "mb-3"));
    div.querySelectorAll("h3").forEach(el => el.classList.add("text-xl", "font-semibold", "mb-2"));
    div.querySelectorAll("ul").forEach(el => el.classList.add("list-disc", "ml-5", "mb-4"));
    div.querySelectorAll("ol").forEach(el => el.classList.add("list-decimal", "ml-5", "mb-4"));
    div.querySelectorAll("blockquote").forEach(el => el.classList.add("border-l-4", "border-gray-400", "pl-4", "italic", "mb-4"));
    div.querySelectorAll("code").forEach(el => el.classList.add("bg-gray-100", "px-1", "rounded"));
    div.querySelectorAll("pre").forEach(el => el.classList.add("bg-gray-900", "text-white", "p-4", "rounded-lg", "overflow-x-auto"));

    return div.innerHTML;
}

document.addEventListener('alpine:init', () => {
    Alpine.data('navigation', function(){
        return {
            navigation: this.$persist(""),
            type: this.$persist(""),
            item: this.$persist({}),
            miniSearch: null,
            searchString: this.$persist(""),
            searchReady: false,
            results: [],
            filterString: "",
            filters: [],
            editions: [],
            prev: this.$persist(""),
            next: this.$persist(""),
            lock: false,
            edit: false,
            medewerkers: this.$persist([]),
            medewerkersText: "",
            init: async function(){
                try {
                    let response = await fetch("/content/index.json");
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                    let data = await response.json(); // Gebruik .json() als je JSON verwacht
                    this.editions = data;
                  } catch (error) {
                    console.error("Fout bij ophalen van data:", error);
                  }

                if (this.navigation == ""){
                    this.navigate("home");
                }
                this.miniSearch = new MiniSearch({
                  fields: ['title', 'beschrijving','id'], // Velden waarin gezocht wordt
                  storeFields: ['id', 'beschrijving', 'title','source'], // Velden die worden teruggegeven
                });
                this.searchReady = true;

                for (let edition of this.editions) {
                    edition.id = edition.year;
                    edition["beschrijving"] = await fetch_markdown("/content/" + edition.edition + "/README.md");
                    for (let video of edition.video){
                        video["beschrijving"] = await fetch_markdown("/content/" + edition.edition + "/video/" + edition.edition + "-" + video.sequence + ".md");
                        video["source"] = `https://revue.b-cdn.net/${edition.edition}/${video.sequence}.mp4`;
                    }
                    this.miniSearch.addAll(edition.video);
                }

                this.miniSearch.addAll(this.editions);
            },
            executeSearch: function(){
                this.results = this.miniSearch.search(this.searchString,{fuzzy: 0.1, prefix:true});
            },
            executeFilter: function(){
                this.filters = this.miniSearch.search(this.filterString,{fuzzy: 0.1, prefix:true}).map(x => String(x.id).split("-").at(0));
            },
            navigate: function(id){
                location.hash = id;
                if(this.lock){return};
                try{
                this.lock = true;
                this.edit = false;
                this.navigation = "" + id;
                this.results = [];
                this.filterString = "";
                this.prev = "";
                this.next = "";
                if (id == "home"){
                    this.type = "home";
                    this.item = {};
                    return;
                }
                this.type = this.navigation.includes("-") ? "video" : "edition";
                if (this.type == "edition"){
                    this.item = this.editions.filter(x => x.id == id).at(0);
                    this.lees_medewerkers();
                    let result = findPrevNext(this.editions,id);
                    console.log(result);
                    this.prev = result.prev;
                    this.next = result.next;
                } else if (this.type == "video"){
                    let year = this.navigation.split("-").at(0);
                    let edition = this.editions.filter(x => x.id == year).at(0);
                    this.item = edition.video.filter(x => x.id == id).at(0);
                    this.item.edition = JSON.parse(JSON.stringify(edition));
                    this.item.year = year;
                    let result = findPrevNext(edition.video,id);
                    this.prev = result.prev;
                    this.next = result.next;
                    localStorage[year] = id;
                }
                } finally {
                    setTimeout(this.reset_lock.bind(this),100);
                }
            },
            reset_lock: function(){this.lock = false},
            formatTime: function(seconds) {
                let h = Math.floor(seconds / 3600);
                let m = Math.floor((seconds % 3600) / 60);
                let s = Math.floor(seconds % 60);
                return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            },
            lees_medewerkers: async function(){
                let medewerkers = await fetch_markdown(`/content/${this.item.year}/medewerkers.txt`);
                this.medewerkers = medewerkers.split("\n").map(x => x.trim());
            },
            downloadMarkdownFile: function() {
                let text = "";
                let filename = "";

                text += "<!-- id -->\n";
                text += this.item.id;
                text += "\n\n";

                text += "<!-- Titel -->\n";
                text += this.item.title;
                text += "\n\n";

                text += "<!-- Beschrijving -->\n";
                text += this.item.beschrijving;
                text += "\n\n";

                if (this.type == "edition"){
                    filename = this.item.title + ".md";

                    text += "<!-- Medewerkers -->\n";
                    text += this.medewerkersText;
                    text += "\n\n";
                } else {
                    filename = this.item.edition.title + " - " + this.item.title + ".md";
                }

                const blob = new Blob([text], { type: "text/plain" }); // Markdown is gewoon plain text
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
    });
})