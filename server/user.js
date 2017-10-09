const db = require('./db/lokijs');

const User = {};

function _nameIsValid(name) {
  return (typeof name === 'string' && name.length >= 3);
}


User.create = function(request, response)  {
  const name = request.body.name;
  if(_nameIsValid(name)) {
    response.send(db.insert({name: request.body.name}, 'user'));
  } else {
    response.status(400).send({ error: 'invalid name'});
  }
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