var loki = require('lokijs');

var db = new loki('db');

function useDb(name) {
  db = new loki(name);
}

function getCollection(name) {
	return db.getCollection(name) || db.addCollection(name);
}

function insert(object, collection) {
  result = getCollection(collection).insert(object);
  return _transform(result);
}

function _transform(dbObject) {
  let newObject = {};
  Object.keys(dbObject).forEach(key => {
    if(key === '$loki') {
      newObject.id = dbObject[key];
    } else if(key === 'meta'){
      //skip
    } else {
      newObject[key] = dbObject[key];
    }    
  });
  return newObject;
}


module.exports = { useDb, getCollection, insert };