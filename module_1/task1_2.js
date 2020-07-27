const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

const csv = require('csvtojson')

const readable = fs.createReadStream(path.join('.', 'module_1', 'csv', 'nodejs-hw1-ex1.csv'));
const writable = fs.createWriteStream(path.join('.', 'module_1', 'csv', 'res.txt'));

pipeline(
    readable,
    csv(),
    writable,
    (err) => {
      if (err) {
        console.log('error occured: ', e);
      } else {
        console.log('write complete');
      }
    }
  );
