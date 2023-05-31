const cspell = require('cspell');

async function checkSpellGrammar(text) {
  try {
    const result = await cspell.checkText(text);
    console.log('Spelling and Grammar Errors:');
    console.log(result.map(error => error.text));
  } catch (error) {
    console.error('Error occurred during spell and grammar check:', error);
  }
}

// Example usage
const text = 'I has a spel and grammatical errors.';
checkSpellGrammar(text);
