var loki = require('lokijs');

var db = new loki('test-db');


function getCollection(name) {
	return db.getCollection(name) || db.addCollection(name);
}


module.exports = { getCollection };