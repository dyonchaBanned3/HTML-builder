const fs = require('fs');
const filePath = '01-read-file/text.txt';
const readStream = fs.createReadStream(filePath, 'utf-8');

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
