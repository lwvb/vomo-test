const OrientDB = require('orientjs');
const env = require('node-env-file');


const server = OrientDB({
  host:       process.env.DATABASE_HOST || 'localhost',
  port:       process.env.DATABASE_PORT,
  username:   process.env.DATABASE_USER,
  password:   process.env.DATABASE_PASSWORD
});

const db = server.use('test');

process.on('SIGINT', () => {
  db.close();
  server.close();
});

module.exports = db;