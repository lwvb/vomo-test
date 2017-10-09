const express = require('express');
const bodyparser = require('body-parser');

var app = express();

app.use(bodyparser.json());

app.get('/', (request, response) => {
  response.send('succes ');
});

app.get('/users/:id', (request, response) => {
  var id = parseInt(request.params.id, 10);
  if(id !== id) {
    response.send({error: 'Invalid id'});
    return;
  }
  
    
});


let server = app.listen(3000, () => {
  console.log('started server on port 3000');
})

module.exports = { app };