const state = require("./state.js");
const google = require("googleapis").google;
const customSearch = google.customsearch("v1");
const googleSearchCredencials = require("../credencials/googleConsole.json");

const imageDownloader = require("image-downloader");

async function robot(){
    const content = state.load();
    
    await fetchAllImageSenteces(content);

    state.save(content);

    await downloadAllImages(content);

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
            num:4
        });
        const imagesUrl = response.data.items.map((item)=>{
            return item.link;
        });
        return imagesUrl;
    } 

    async function downloadAllImages(content){
        content.downloadedImages = Array();
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            const images = content.sentences[sentenceIndex].images;
            for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
                const image = images[imageIndex];
                try{
                    if(content.downloadedImages.includes(image)){
                        throw new Error("Imagem já Baixada");
                    }
                    await downloadImage(image,`${sentenceIndex}-original.png`);
                    content.downloadedImages.push(image);
                    break;
                }catch(error){
                    console.log("Não baixou imagens");
                }
                
            }
            
        }
    }

    async function downloadImage(url,path){
        return imageDownloader.image({
            url,url,
            dest:`./content/${path}`
        });
    }

    
    
}

module.exports = robot;