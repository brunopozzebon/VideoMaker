const algorithmia = require("algorithmia");
const sbd = require("sbd");
const apiKey = require("../credentials/algorithmia.json").apiKey;
const apiKeyWatson = require("../credentials/watson.json").apikey;

const URL_WATSON = 'watson-developer-cloud/natural-language-understanding/v1.js';
const WATSON_VERSION = "2018-04-05";

const LANGUAGE_WIKIPEDIA = "en";

const NaturalLanguageUnderstandingV1 = require(URL_WATSON);
const state = require("./state.js");
const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: apiKeyWatson,
  version: WATSON_VERSION,
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});
 
async function robot(){
    const content = state.load();
    await fetchWikipediaContent(content);
    cleanContent(content);
    breakContentIntoSentences(content);
    sliceWithMaxSentences(content);
    await fetchKeywordsOfTheSentences(content);
    state.save(content);

    async function fetchWikipediaContent(content){
        console.log("> [Text Robot] Getting content for Wikipedia");
        const algorithmiaAuth = algorithmia(apiKey);
        const wikipediaAlgorithm = algorithmiaAuth.algo("web/WikipediaParser/0.1.2");
        const wikipediaResponse = await wikipediaAlgorithm.pipe({
            "lang":LANGUAGE_WIKIPEDIA,
            "articleName":content.searchTerm
        });
        const wikipediaContent = wikipediaResponse.get();
        content.sourceCodeOriginal = wikipediaContent.content;   
    }

    function cleanContent(content){
        const withoutBlankLines = removeBlankLinesAndMarkdown(content.sourceCodeOriginal);
        const withoutParentesis = removeParentesis(withoutBlankLines);
        content.sourceCodeClean = withoutParentesis;
        function removeBlankLinesAndMarkdown(text){
            const allLines = text.split('\n');
            const withoutBlankLines = allLines.filter((line)=>{
                if(line.trim().length === 0 || line.trim().startsWith('=')){
                    return false;
                }return true;
            });
            return withoutBlankLines.join(' ');
        }
    }

    function removeParentesis(text){
        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ');
    }

    function breakContentIntoSentences(content){
        const sentences = sbd.sentences(content.sourceCodeClean);
        sentences.forEach((sentence)=>{
            content.sentences.push({
                text:sentence,
                keywords:[],
                images:[]
            });
        });
        
    }

    function sliceWithMaxSentences(content){
        content.sentences = content.sentences.slice(0,content.limitSentences);
    }

    async function fetchWatsonAndReturnKeywords(sentence) {
        return new Promise((resolve, reject) => {
          nlu.analyze({
            text: sentence,
            features: {
              keywords: {}
            }
          }, (error, response) => {
            if (error) {
              reject(error);
              return;
            }
            const keywords = response.keywords.map((keyword) => {
              return keyword.text;
            })
    
            resolve(keywords);
          })
        })
      }

    async function fetchKeywordsOfTheSentences(content){
        console.log("> [Text Robot] Fetch keywords of the sentences ");
        for(const sentence of content.sentences){
            sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text);
        }
    }
}

module.exports = robot;