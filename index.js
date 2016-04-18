var serverStore = require('./server-store.js');
var express = require('express');

var app = express();
app.listen(8100);

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

serverStore.init().then(() => {
  serverStore.poll();

  app.get('/ping', function(req, res) {
    res.send('pong');
  });

  app.get('/public_servers', function(req, res) {
    res.json(serverStore.list);
  });
});

process.on('SIGINT', function() {
  serverStore.cleanUp();

  process.exit();
});
