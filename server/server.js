const express = require('express');
const bodyparser = require('body-parser');

var app = express();

app.use(bodyparser.json());

app.get('/', (request, response) => {
  response.send('succes');
});

app.listen(3000, () => {
  console.log('started server on port 3000');
})

module.exports = { app };