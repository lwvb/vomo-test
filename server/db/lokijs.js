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
  return transform(result);
}


function getAll(collection) {
  results = getCollection(collection).find({});
  return results.map(transform);
}

function get(objectId, collection) {
  result = getCollection(collection).get(objectId);
  return transform(result);
}

function remove(objectId, collection) {
  object = getCollection(collection).get(objectId);
  if(!object) {
    return;
  }
  result = getCollection(collection).remove(object);
  return transform(result);
}

/**
 * Create a new object from the lokijs object
 * It is not possible to modify the loki object because it tracks changes
 * Rewrites the $loki id to id property and removes metadata
 * @param {object} dbObject
 */
function transform(dbObject) {
  if(!dbObject) {
    return;
  }
  let newObject = {};
  Object.keys(dbObject).forEach(key => {
    value = dbObject[key];
    if(Array.isArray(value)) {
      value = value.map(transform);
    } else if(value === Object(value)) {
      value = transform(value);
    }

    if(key === '$loki') {
      newObject.id = value;
    } else if(key === 'meta' || key === 'id'){
      //skip
    } else {
      newObject[key] = value;
    }    
  });
  return newObject;
}


module.exports = { useDb, getCollection, insert, getAll, get, remove, transform };