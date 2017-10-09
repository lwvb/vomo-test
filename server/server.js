const express = require('express');
const bodyparser = require('body-parser');
const user = require('./user');
const project = require('./project');

let app = express();

app.use(bodyparser.json());

app.get('/', (request, response) => {
  response.send('succes ');
});

app.post('/users', user.create);
app.get('/users', user.get);
app.get('/users/:id', user.getById);
app.delete('/users/:id', user.delete);


app.post('/projects', project.create);
app.get('/projects', project.get);
app.get('/projects/:id', project.getById);
app.delete('/projects/:id', project.delete);


module.exports = app;