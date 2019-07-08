const algorithmia = require("algorithmia");
const sbd = require("sbd");
const apiKey = require("../credencials/algorithmia.json").apiKey;
async function robot(content){
    await fetchWikipediaContent(content);
    cleanContent(content);
    breakContentIntoSentences(content);

    async function fetchWikipediaContent(content){
        const algorithmiaAuth = algorithmia(apiKey);
        const wikipediaAlgorithm = algorithmiaAuth.algo("web/WikipediaParser/0.1.2");
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm);
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
                keyword:[],
                images:[]
            });
        });
        
    }
}

module.exports = robot;