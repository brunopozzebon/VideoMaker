
const robots = {
    input: require("./robots/input.js"),
    text: require("./robots/text.js"),
    state: require("./robots/state.js"),
    image : require("./robots/image.js"),
    video : require("./robots/video.js"),
    speech : require("./robots/speech.js"),
    youtube : require("./robots/youtube.js")
}

async function start () {
  //await robots.input();
  //await robots.text();
  //await robots.image();
  await robots.speech();
  //await robots.video();
 // await robots.youtube();
 
}

start();