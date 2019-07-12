const readline = require('readline-sync');
const Parser = require('rss-parser');
const state = require("./state.js");

const ULR_GOOGLE_TRENDS = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR';
const LANGUAGE_GOOGLE_TRENDS = "en";

async function robot () {
  let content = {};
  content.searchTerm = await askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();
  content.sentences = Array();
  content.limitSentences = 7;
  content.speeches = Array();

  state.save(content);
  
  async function askAndReturnSearchTerm () {
    const response = readline.question('Type a search term or G to a Google Trends List ');
    return (response.toUpperCase() === 'G') ?  await askAndReturnTrend() : response;
  }

  async function askAndReturnTrend() {
    const trends = await getGoogleTrends();
    const choice = readline.keyInSelect(trends, 'Choose your trend:');    
    return trends[choice];
  }

  async function getGoogleTrends () {
    const parser = new Parser();
    const trends = await parser.parseURL(ULR_GOOGLE_TRENDS);
    return trends.items.map(i => i.title);
  }

  function askAndReturnPrefix () {
    const prefixes = ['Who is', 'What is', 'The history of'];
    const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ');
    const selectedPrefixText = prefixes[selectedPrefixIndex];
    return selectedPrefixText;
  }
}

module.exports = robot;