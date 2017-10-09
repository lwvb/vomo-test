var loki = require('lokijs');

var db = new loki('db');

function useDb(name) {
  db = new loki(name);
}

function getCollection(name) {
	return db.getCollection(name) || db.addCollection(name);
}


module.exports = { getCollection, useDb };