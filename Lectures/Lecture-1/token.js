import {get_encoding} from 'tiktoken';

const enc = get_encoding('gpt2');

// Encode a string into tokens
const encoded = enc.encode('Navdeep Rohilla is a software engineer');
console.log(encoded);

// Decode the tokens back into a string
const decode = enc.decode(encoded);
console.log( new TextDecoder().decode(decode) );