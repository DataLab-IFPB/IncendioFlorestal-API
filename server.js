const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist/combate-incendios'));

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/dist/combate-incendios/index.html');
});

app.listen(process.env.PORT || 4200);
