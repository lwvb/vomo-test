const express = require('express');
const bodyparser = require('body-parser');
const user = require('./user');

var app = express();

app.use(bodyparser.json());

app.get('/', (request, response) => {
  response.send('succes ');
});

app.post('/users/', user.create);
app.get('/users', user.get);
app.get('/users/:id', user.getById);
app.delete('/users/:id', user.delete);




let server = app.listen(3000, () => {
  console.log('started server on port 3000');
})

module.exports = { app };