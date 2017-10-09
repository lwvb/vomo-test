const db = require("./db/lokijs");

const Project = {};

function _isValidName(name) {
  return typeof name === "string" && name.length >= 3;
}

function _isValidId(id) {
  return id.match(/^\d+$/);
}

function _dateComponents(dateString) {
  var IsoDateRe = new RegExp("^([0-9]{4})-([0-9]{2})-([0-9]{2})$");
  var matches = IsoDateRe.exec(dateString);
  if (!matches) {
    return undefined;
  }
  matches = matches.slice(1);
  return matches.map(value => parseInt(value, 10));
}

function _isValidDate(dateString) {
  const dateComponents = _dateComponents(dateString);
  if (!dateComponents) {
    return false;
  }
  const [year, month, day] = dateComponents;
  const composedDate = new Date(year, month - 1, day);

  return (
    composedDate.getFullYear() == year &&
    composedDate.getMonth() == month - 1 &&
    composedDate.getDate() == day
  );
}

Project.create = function(request, response) {
  const name = request.body.name;
  const dateString = request.body.date;
  if (!_isValidName(name) || !_isValidDate(dateString)) {
    response.status(400).send({ error: "invalid name" });
    return;
  }
  const [year, month, day] = _dateComponents(dateString);
  const projectObj = { name, date: dateString, year, month, day };
  const project = db.insert(projectObj, "project");
  response.send(project);
};

Project.getById = function(request, response) {
  const id = request.params.id;
  if (!_isValidId(id)) {
    response.status(400).send({ error: "invalid id" });
    return;
  }

  const project = db.get(id, "project");
  if (project) {
    response.send(project);
  } else {
    response.status(404).send({ error: "no project with given id" });
  }
};

Project.get = function(request, response) {
  const projects = db.getAll("project");
  response.send(projects);
};

Project.delete = function(request, response) {
  const id = request.params.id;
  if (!_isValidId(id)) {
    response.status(400).send({ error: "invalid id" });
    return;
  }

  const project = db.remove(id, "project");
  if (project) {
    response.send(project);
  } else {
    response.status(404).send({ error: "no project with given id" });
  }
};

module.exports = Project;
