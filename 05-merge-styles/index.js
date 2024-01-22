const { error } = require('console');
const fs = require('fs');

const path = require('path');
const sourceFolderPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist/bundle.css');

const writeableStream = fs.createWriteStream(bundleFilePath, 'utf8');

fs.readdir(sourceFolderPath, { withFileTypes: true }, (err, files) => {
  try {
    files.forEach((file) => {
      const filePath = path.join(sourceFolderPath, file.name);

      if (file.isFile() && path.extname(filePath).slice(1) === 'css') {
        fs.createReadStream(filePath, 'utf8').pipe(writeableStream);
      }
    });
  } catch (err) {
    console.log('Error:', err.message)
  }
});