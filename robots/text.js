const algorithmia = require("algorithmia");
const apiKey = require("../credencials/algorithmia.json").apiKey;
async function robot(content){
    await fetchWikipediaContent(content);
    cleanContent(content);

    async function fetchWikipediaContent(content){
        const algorithmiaAuth = algorithmia(apiKey);
        const wikipediaAlgorithm = algorithmiaAuth.algo("web/WikipediaParser/0.1.2");
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm);
        const wikipediaContent = wikipediaResponse.get();
        content.sourceCodeOriginal = wikipediaContent;   
    }

    function cleanContent(content){
        const withoutBlankLines = removeBlankLinesAndMarkdown(content.sourceCodeOriginal);
        const withoutParentesis = removeParentesis(withoutBlankLines);
        function removeBlankLinesAndMarkdown(text){
            const allLines = text.split('\n');
            const withoutBlankLines = allLines.filter((line)=>{
                if(line.trim().length === 0 || line.trim().startsWith('=')){
                    return false;
                }return true;
            });
            return withoutBlankLines.join(' ');
        }

        console.log(withoutParentesis);
    }

    function removeParentesis(text){
        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ');
    }
}

module.exports = robot;