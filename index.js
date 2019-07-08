let readLine = require("readline-sync");

function start(){
    let content = readLine.question("Type de Wikipedia search:");
    console.log(content);
}

start();