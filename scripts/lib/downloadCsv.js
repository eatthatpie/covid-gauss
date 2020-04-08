const fetch = require('node-fetch');
const parse = require('csv-parse');

function downloadCsv(url) {
  return new Promise(async function(resolve, reject) {
    const res = await fetch(url);
    const input = await res.text();

    parse(input, {}, function(err, output) {
      if (err) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
}

module.exports = downloadCsv;
