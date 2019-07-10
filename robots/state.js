const fs = require("fs");
const contentPath = "./content.json";
const scriptFilePath = './content/after-effects-script.js';

function save(content){
    const contentString = JSON.stringify(content);
    return fs.writeFileSync(contentPath,contentString);
}


function saveScript(content) {
    const contentString = JSON.stringify(content)
    const scriptString = `var content = ${contentString}`
    return fs.writeFileSync(scriptFilePath, scriptString)
}

function load(){
    const buffer = fs.readFileSync(contentPath,'utf-8');
    const contentJson = JSON.parse(buffer);
    return contentJson;
}

module.exports={
    save, saveScript,load
}