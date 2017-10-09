const db = require('./db/lokijs');

const User = {};
  
User.create = function(request, response)  {
  response.status(501).send({ error: 'method not implemented'});
}

User.getById = function(request, response) {
  response.status(501).send({ error: 'method not implemented'});
}

User.get = function(request, response) {
  response.status(501).send({ error: 'method not implemented'});
}

User.delete = function(request, response)  {
  response.status(501).send({ error: 'method not implemented'});
}

  

module.exports = User;