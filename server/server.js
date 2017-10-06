const express = require('express');
const bodyparser = require('body-parser');
const db = require('./db/orientdb');

var app = express();

app.use(bodyparser.json());

app.get('/', (request, response) => {
  response.send('succes' + db.name);
});

app.listen(3000, () => {
  console.log('started server on port 3000');
})

module.exports = { app };