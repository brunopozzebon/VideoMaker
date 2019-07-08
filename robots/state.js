const fs = require("fs");
const contentPath = "./content.json";

function save(content){
    const contentString = JSON.stringify(content);
    return fs.writeFileSync(contentPath,contentString);
}

function load(){
    const buffer = fs.readFileSync(contentPath,'utf-8');
    const contentJson = JSON.parse(buffer);
    return contentJson;
}

module.exports={
    save,load
}