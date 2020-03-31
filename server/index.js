var createGqlServer = require('./createGqlServer');
var app = require('express')();

try {
  createGqlServer(app);
} catch (e) {
  console.error(e);
}

app.listen(5000);
