const db = require('./db/lokijs');

const User = {};

function _isValidName(name) {
  return (typeof name === 'string' && name.length >= 3);
}

function _isValidId(id) {
  return id.match(/^\d+$/);
}


User.create = function(request, response)  {
  const name = request.body.name;
  if(!_isValidName(name)) {
    response.status(400).send({ error: 'invalid name'});
    return;
  }

  const user = db.insert({name: request.body.name}, 'user')
  response.send(user);
}

User.getById = function(request, response) {
  const id = request.params.id;
  if(!_isValidId(id)) {
    response.status(400).send({ error: 'invalid id'});
    return;
  }

  const user = db.get(id, 'user')
  if(user) {
    response.send(user);
  } else {
    response.status(404).send({ error: 'no user with given id'})
  }
}

User.get = function(request, response) {
  const users = db.getAll('user')
  response.send(users);
}

User.delete = function(request, response)  {
  const id = request.params.id;
  if(!_isValidId(id)) {
    response.status(400).send({ error: 'invalid id'});
    return;
  }

  const user = db.remove(id, 'user')
  if(user) {
    response.send(user);
  } else {
    response.status(404).send({ error: 'no user with given id'})
  }
}

  

module.exports = User;