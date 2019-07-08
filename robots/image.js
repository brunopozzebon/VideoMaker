const state = require("./state.js");
const google = require("googleapis").google;
const customSearch = google.customsearch("v1");
const googleSearchCredencials = require("../credencials/googleConsole.json");

async function robot(){
    const content = state.load();
    
    await fetchAllImageSenteces(content);
    state.save(content);

    console.dir(content.sentences,{depth:null});

    async function fetchAllImageSenteces(content){
        for(const sentence of content.sentences){
            const query = `${content.searchTerm} ${sentence.keywords[0]}`;
            sentence.images = await fetchGoogleLinks(query);
            sentence.googleSearchQuery = query;
        }
    }


    async function fetchGoogleLinks(query){
        const response = await customSearch.cse.list({
            auth: googleSearchCredencials.key,
            cx: googleSearchCredencials.searchEngineID,
            q:query,
            searchType:"image",
            imgSize:"huge",
            num:2
        });
        const imagesUrl = response.data.items.map((item)=>{
            return item.link;
        });
        return imagesUrl;
    } 

    
    
}

module.exports = robot;