const spellchecker = require('spellchecker');

function checkSpellGrammar(text) {
  const words = text.split(' ');

  const misspelledWords = words.filter(word => !spellchecker.checkSpelling(word));

  console.log('Misspelled Words:');
  console.log(misspelledWords);
}

// Example usage
const text = 'I has a spel and grammatical errors.';
checkSpellGrammar(text);
