const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const targetFolderPath = path.join(__dirname, 'project-dist');

// create build folder
async function createFolder(target) {
  try {
    await deleteFolder(target);
    await fsPromises.mkdir(target, { recursive: true });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// copy assets
async function createFolderCopy(source, target) {
  try {
    await deleteFolder(target);
    await fsPromises.mkdir(target, { recursive: true });
    const files = await getFiles(source);

    await Promise.all(files.map(async (file) => {
      const filePath = path.join(source, file);
      const fileCopyPath = path.join(target, file);

      const stat = await fsPromises.stat(filePath);
      // for directories
      if (stat.isDirectory()) {
        await createFolderCopy(filePath, fileCopyPath)
      } else {
        await fsPromises.copyFile(filePath, fileCopyPath);
      }
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
      console.log('Error:', err.message);
    }
  }
}

// bundle css
const stylesSource = path.join(__dirname, 'styles');
const stylesTarget = path.join(targetFolderPath, 'style.css');

async function bundleCSS(source, target) {
  const files = await fsPromises.readdir(source, {withFileTypes: true});
  const writeableStream = fs.createWriteStream(target, 'utf8');

  files.forEach((file) => {
    const filePath = path.join(source, file.name);

    if (file.isFile() && path.extname(filePath).slice(1) === 'css') {
      fs.createReadStream(filePath, 'utf8').pipe(writeableStream);
    }
  })
}

// bundle html
const htmlTemplate = path.join(__dirname, 'template.html');
const htmlTarget = path.join(targetFolderPath, 'index.html');
const htmlComponentsPath= path.join(__dirname, 'components');

async function bundleHTML(template, componentsPath, target) {
  const templateInner = await fsPromises.readFile(template, 'utf-8');
  await fsPromises.writeFile(target, templateInner);

  let htmlInner = await fsPromises.readFile(htmlTarget, 'utf-8');
  const components = await fsPromises.readdir(componentsPath, { withFileTypes: true,});

  for (let i = 0; i < components.length; i += 1) {

    const filePath = path.join(componentsPath, components[i].name);

    if (components[i].isFile() && path.extname(filePath) === '.html') {
      const fileName = components[i].name.slice(0, components[i].name.lastIndexOf('.'));
      const fileData = await fsPromises.readFile(filePath, 'utf-8');
      htmlInner = htmlInner.replace(`{{${fileName}}}`, fileData);
    }

  }
  await fsPromises.writeFile(target, htmlInner)
}

// MAIN function
async function createBundle() {
  const targetFolderPath = path.join(__dirname, 'project-dist');

  // creating bundle folder
  await createFolder(targetFolderPath);

  // assets copying
  const assetsSource = path.join(__dirname, 'assets');
  const assetsTarget = path.join(targetFolderPath, 'assets');
  createFolderCopy(assetsSource, assetsTarget);

  bundleCSS(stylesSource, stylesTarget);
  bundleHTML(htmlTemplate, htmlComponentsPath, htmlTarget);
}

createBundle();