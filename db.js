const mysql = require('mysql2/promise');
require("dotenv").config();

const pool = mysql.createPool({
    host: 'sql6.freemysqlhosting.net',
    user: process.env.NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log(process.env.NAME);
console.log(process.env.PASSWORD);


module.exports = pool;
