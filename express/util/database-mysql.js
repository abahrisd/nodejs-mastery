const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  'node-mastery',
  'root',
  'nodemastery',
  {
    dialect: 'mysql',
    host: 'localhost',
  }
);

module.exports = sequelize;

// const mysql = require('mysql2');
//
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node-mastery',
//   password: 'nodemastery',
// });
//
// module.exports = pool.promise();