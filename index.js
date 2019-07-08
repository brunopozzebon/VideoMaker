const readline = require('readline-sync');
const Parser = require('rss-parser');

const ULR_GOOGLE_TRENDS = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR' ;

async function start () {
  let content = {};
  content.searchTerm = await askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();

  async function askAndReturnSearchTerm () {
    const response = readline.question('Type a Wikipedia search term or G to fetch google trends: ');
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

start();