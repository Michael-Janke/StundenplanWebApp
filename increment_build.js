var fs = require('fs');
var fileName = './src/version.json';
var file = require(fileName);
var path = require('path');

file.build = file.build + 1;

fs.writeFile( path.join(__dirname,fileName) , JSON.stringify(file), function (err) {
  if (err) return console.log(err);
  console.log(JSON.stringify(file, null, 4));
  console.log('increment build number ' + fileName);
});