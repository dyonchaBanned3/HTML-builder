const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const sourcePath = path.join(__dirname, 'files');
const targetPath = path.join(__dirname, 'files-copy');

async function createFolderCopy(source, target) {
  try {
    await deleteFolder(target);
    await fsPromises.mkdir(target, { recursive: true });
    const files = await getFiles(source);

    await Promise.all(files.map(async (file) => {
      const filePath = path.join(source, file);
      const fileCopyPath = path.join(target, file);
      await fsPromises.copyFile(filePath, fileCopyPath);
    }));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function getFiles(target) {
  try {
    return await fsPromises.readdir(target);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function deleteFolder(target) {
  try {
    await fsPromises.rm(target, { recursive: true });
  } catch (err) {
    if(err.code !== 'ENOENT') {
      console.error('Error:', err.message);
    }
  }
}

createFolderCopy(sourcePath, targetPath);
