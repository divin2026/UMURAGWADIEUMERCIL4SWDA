const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DBA'
});

module.exports = db;
