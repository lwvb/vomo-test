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


function getAll(collection) {
  results = getCollection(collection).find({});
  return results.map(_transform);
}

function get(objectId, collection) {
  result = getCollection(collection).get(objectId);
  return _transform(result);
}

/**
 * Create a new object from the lokijs object
 * It is not possible to modify the loki object because it tracks changes
 * Rewrites the $loki id to id property
 * @param {object} dbObject
 */
function _transform(dbObject) {
  if(!dbObject) {
    return;
  }
  let newObject = {};
  Object.keys(dbObject).forEach(key => {
    if(key === '$loki') {
      newObject.id = dbObject[key];
    } else if(key === 'meta' || key === 'id'){
      //skip
    } else {
      newObject[key] = dbObject[key];
    }    
  });
  return newObject;
}


module.exports = { useDb, getCollection, insert, getAll, get };