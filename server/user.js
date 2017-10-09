const db = require("./db/lokijs");

const User = {};

function _isValidName(name) {
  return typeof name === "string" && name.length >= 3;
}

function _isValidId(id) {
  return (
    (typeof id === "number" && id === Math.floor(id)) ||
    (typeof id === "string" && id.match(/^\d+$/))
  );
}

function _hasLiked(user, projectid) {
  return (
    user.likes &&
    user.likes.find(project => {
      return project["$loki"] === projectid;
    })
  );
}

function _removeLike(user, projectid) {
  user.likes = user.likes.reduce((likes, current) => {
    console.log(likes);
    if (current["$loki"] !== projectid) {
      likes.push(current);
    }
    return likes;
  }, []);
}

User.create = function(request, response) {
  const name = request.body.name;
  if (!_isValidName(name)) {
    response.status(400).send({ error: "invalid name" });
    return;
  }

  const user = db.insert({ name: request.body.name }, "user");
  response.send(user);
};

User.getById = function(request, response) {
  const id = request.params.id;
  if (!_isValidId(id)) {
    response.status(400).send({ error: "invalid id" });
    return;
  }

  const user = db.get(id, "user");
  if (user) {
    response.send(user);
  } else {
    response.status(404).send({ error: "no user with given id" });
  }
};

User.get = function(request, response) {
  const users = db.getAll("user");
  response.send(users);
};

User.delete = function(request, response) {
  const id = request.params.id;
  if (!_isValidId(id)) {
    response.status(400).send({ error: "invalid id" });
    return;
  }

  const user = db.remove(id, "user");
  if (user) {
    response.send(user);
  } else {
    response.status(404).send({ error: "no user with given id" });
  }
};

User.like = function(request, response) {
  const id = request.params.id;
  const projectid = parseInt(request.body.project, 10);
  if (!_isValidId(id) || !_isValidId(projectid)) {
    response.status(400).send({ error: "invalid id" });
    return;
  }

  const user = db.getCollection("user").get(id);
  const project = db.getCollection("project").get(projectid);
  if (!user) {
    response.status(404).send({ error: "no user or project with given id" });
  } else if (!project) {
    response.status(400).send({ error: "invalid project id" });
  } else {
    if (user.likes === undefined) {
      user.likes = [];
    }
    if (!_hasLiked(user, projectid)) {
      user.likes.push(project);
    }
    response.send(db.transform(user));
  }
};

User.unlike = function(request, response) {
  const id = request.params.id;
  const projectid = parseInt(request.params.projectid, 10);
  if (!_isValidId(id) || !_isValidId(projectid)) {
    response.status(400).send({ error: "invalid id" });
    return;
  }

  const user = db.getCollection("user").get(id);
  if (!user) {
    response.status(404).send({ error: "no user with given id" });
    return;
  }

  if (!_hasLiked(user, projectid)) {
    response.status(404).send({ error: "no like with given project id" });
  } else {
    _removeLike(user, projectid);
    response.send(db.transform(user));
  }
};
module.exports = User;
