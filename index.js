var serverStore = require('./server-store.js');
var express = require('express');

var app = express();
app.listen(8100);

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
