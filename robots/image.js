const state = require("./state.js");
const google = require("googleapis").google;
const customSearch = google.customsearch("v1");
const googleSearchCredencials = require("../credentials/googleConsole.json");
const imageDownloader = require("image-downloader");

const IMG_SIZE = "huge";
const NUM_OF_RESULTS = 4;

async function robot(){
    const content = state.load();
    await fetchAllImageSenteces(content);
    state.save(content);
    await downloadAllImages(content);

    async function fetchAllImageSenteces(content){
        console.log("> [Image Robot] Fetch the images with Google");
        
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
            imgSize:IMG_SIZE,
            num:NUM_OF_RESULTS
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
                        throw new Error("> [Image Robot] Imagem repetida");
                    }
                    await downloadImage(image,`${sentenceIndex}-original.png`);
                    content.downloadedImages.push(image);
                    console.log(`> [Image Robot] Imagem ${sentenceIndex+1} baixada`);
                    break;
                }catch(error){
                    console.log("> [Image Robot] Falha ao baixar imagem");
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