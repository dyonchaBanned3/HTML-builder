const fs = require('fs');

const path = require('path');
const targetPath = path.join(__dirname, 'secret-folder');

fs.readdir( targetPath, {withFileTypes: true}, (error, files) => {
  if (error) {
    console.log(error.message)
  }

  files.forEach( (file) => {
    if(file.isFile()) {
      const filePath = path.join(targetPath, file.name);
      const fileExtension = path.extname(filePath).slice(1);
      const fileName = path.basename(filePath, path.extname(filePath));

      fs.stat(filePath, (error, stats) => {
        if (error) {
          console.log(error.message)
        };
        
        const fileSize = (stats.size / 1024).toFixed(1);
        console.log(`${fileName} - ${fileExtension} - ${fileSize}Kb`);
      });
    }
  })
})