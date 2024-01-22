const fs = require('fs');
const path = require('path');
const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

let result = '';

readStream.on('data', (chunk) => {
  result += chunk;
});

readStream.on('end', () => {
  console.log(result);
});

readStream.on('error', (err) => {
  console.error('Error:', err);
});
