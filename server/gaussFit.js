const { spawn } = require('child_process');

const SCRIPT_LOCATION = './scripts/gauss_fit.py';

function gaussFit(xData, yData) {
  return new Promise(function(resolve, reject) {
    // if (xData.length < 3 || yData.length < 3) {
    //   return resolve([1, 1, 1]);
    // }

    const child = spawn('python3', [SCRIPT_LOCATION, xData, yData]);

    child.stdout.on('data', function(data) {  
      let res = data + '';

      console.log('res ' + res);

      res = res
        .replace(/\[|\]/g, '')
        .replace(/\n/g, ' ')
        .split(' ')
        .filter(function(item) {
          return item.length > 0
        })
        .map(function(item) {
          return parseFloat(item);
        });

      resolve(res);
    });

    child.stderr.on('data', function(err) {
      console.log('err: ' + err)
      reject(err);
    });

    child.stderr.on('exit', function(err) {  
      reject(err);
    });
  });
}

module.exports = gaussFit;
