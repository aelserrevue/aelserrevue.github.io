
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
                console.time("Data & Search engine initialization"); // Start de timer
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
                  fields: ['title', 'description','id','crew'], // Velden waarin gezocht wordt
                  storeFields: ['id', 'description', 'title','source', 'crew'], // Velden die worden teruggegeven
                });

                for (let edition of this.editions) {
                    this.miniSearch.addAll(edition.video);
                }

                this.miniSearch.addAll(this.editions);
                this.searchReady = true;
                console.timeEnd("Data & Search engine initialization"); // Eindigt en toont tijd in ms
            },
            executeSearch: function(){
                this.results = this.raw_search(this.searchString);
            },
            executeFilter: function(){
                this.filters = this.raw_search(this.filterString).map(x => String(x.id).split("-").at(0));
            },
            raw_search: function(query){
                let pq = query.toLowerCase();
                let results = this.miniSearch.search(pq,{fuzzy: 0.1, prefix:true});
                results = results.filter(x =>
                    x.title.toLowerCase().includes(pq) ||
                    x.description.toLowerCase().includes(pq) ||
                    (x.crew && x.crew.toLowerCase().includes(pq)) ||
                    x.id.toLowerCase().includes(pq));
                return results;
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
                    console.log(this.item);
                    let result = findPrevNext(edition.video,id);
                    this.prev = result.prev;
                    this.next = result.next;
                    localStorage[year] = id;
                }
                } finally {
                    setTimeout(this.reset_lock.bind(this),1000);
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
                this.medewerkers = this.item.crew.split("\n").map(x => x.trim());
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
            },
            getLijst: function() {
                let result = [];

                for (let i = 0; i < localStorage.length; i++) {
                    let key = localStorage.key(i);
                    if (key.startsWith("https://revue.b-cdn.net")) {
                        let elements = key.split("/");
                        result.push({
                            url: key,
                            timestamp: localStorage.getItem(key),
                            id: `${elements.at(-2)}-${elements.at(-1).replace('.mp4','')}`
                        });
                    }
                }

                return result;
            }
        }
    });
})