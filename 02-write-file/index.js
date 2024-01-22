const fs = require('fs');

const path = require('path');
const filePath = path.join(__dirname, 'result.txt');

const {stdin, stdout} = process;
const writeStream = fs.createWriteStream(filePath, 'utf-8');

stdout.write('Hi! Please, write your message: ');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    writeStream.write(data, 'utf-8');
  }
});

process.on('exit', () => {
  console.log('See you later!')
});

process.on('SIGINT', () => {
  process.exit();
});