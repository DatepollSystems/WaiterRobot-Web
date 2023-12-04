const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

const distPath = './dist/WaiterRobot-Web/browser/';

// find the styles css file
const files = getFilesFromPath(distPath, '.css');
let data = [];

if (!files && files.length <= 0) {
  console.log('cannot find style files to purge');
  return;
}

for (let f of files) {
  // get original file size
  const originalSize = getFilesizeInKiloBytes(distPath + f) + 'kb';
  data.push({file: f, originalSize: originalSize, newSize: ''});
}

console.log('Run PurgeCSS...');

exec(`purgecss -css ${distPath}*.css --content ${distPath}index.html ${distPath}*.js -o ${distPath}`, function (error, stdout, stderr) {
  if (error) {
    console.log(error);
    return;
  }

  console.log('PurgeCSS done');

  for (let d of data) {
    // get new file size
    const newSize = getFilesizeInKiloBytes(distPath + d.file) + 'kb';
    d.newSize = newSize;
  }

  console.table(data);
});

function getFilesizeInKiloBytes(filename) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size / 1024;
  return fileSizeInBytes.toFixed(2);
}

function getFilesFromPath(dir, extension) {
  const files = fs.readdirSync(dir);
  return files.filter((e) => path.extname(e).toLowerCase() === extension);
}
