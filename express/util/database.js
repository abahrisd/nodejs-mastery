const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-mastery',
  password: 'nodemastery',
});

module.exports = pool.promise();