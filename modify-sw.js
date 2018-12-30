const fs = require('fs');
const fileName = './custom-sw.js';
const swfileName = './build/service-worker.js';
const path = require('path');

fs.readFile(fileName, 'utf8', (err, customSw) => {
    if (err) return console.log(err); 
    fs.appendFileSync(swfileName, customSw);
});
