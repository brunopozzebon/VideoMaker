const textToSpeech = require('@google-cloud/text-to-speech');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const util = require('util');
const state = require("../robots/state.js");
const LANGUAGE = 'en-US';

async function robot() {
  if(typeof global.videoMode != undefined || global.videoMode!=2){
    return;
  }
  console.log("> [Speech Robot] Starting speech");
  const content = state.load();
  await authenticate();
  await createAllSpeeches(content);
}

async function authenticate(){
  //This is made with the credencials
}

async function createAllSpeeches(content) {
  for (let index = 0; index < content.sentences.length; index++) {
    await createSpeech(content, index);
  }
}

async function createSpeech(content, index) {
  const sentence = content.sentences[index];
  if (sentence != "") {
    const client = new textToSpeech.TextToSpeechClient();
    const text = sentence.text;
    const request = {
      input: { text: text },
      voice: { languageCode: LANGUAGE, ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);

    const writeFile = util.promisify(fs.writeFile);
    const speechPath = `./content/output_${index}.mp3`;
    await writeFile(speechPath, response.audioContent, 'binary');
    content.speeches.push(speechPath);
    console.log(`> [Speech Robot] Speech ${index+1} downloaded`);
  } else {
    console.log("> [Speech Robot] No sentence in the content");
  }
}

module.exports = robot;



