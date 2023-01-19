const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

// find the styles css file
const files = getFilesFromPath('./dist/WaiterRobot-Web', '.css');
let data = [];

if (!files && files.length <= 0) {
  console.log('cannot find style files to purge');
  return;
}

for (let f of files) {
  // get original file size
  const originalSize = getFilesizeInKiloBytes('./dist/WaiterRobot-Web/' + f) + 'kb';
  var o = {file: f, originalSize: originalSize, newSize: ''};
  data.push(o);
}

console.log('Run PurgeCSS...');

exec(
  'purgecss -css dist/WaiterRobot-Web/*.css --content dist/WaiterRobot-Web/index.html dist/WaiterRobot-Web/*.js -o dist/WaiterRobot-Web/',
  function (error, stdout, stderr) {
    if (error) {
      console.log(error);
      return;
    }

    console.log('PurgeCSS done');

    for (let d of data) {
      // get new file size
      const newSize = getFilesizeInKiloBytes('./dist/WaiterRobot-Web/' + d.file) + 'kb';
      d.newSize = newSize;
    }

    console.table(data);
  }
);

function getFilesizeInKiloBytes(filename) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size / 1024;
  return fileSizeInBytes.toFixed(2);
}

function getFilesFromPath(dir, extension) {
  const files = fs.readdirSync(dir);
  return files.filter((e) => path.extname(e).toLowerCase() === extension);
}
