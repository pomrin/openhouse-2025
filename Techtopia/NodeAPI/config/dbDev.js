const mysql2 = require("mysql2");

require('dotenv').config();


var pool = mysql2.createPool({
    host: process.env.DEV_DB_HOST,
    database: process.env.DEV_DB_NAME,
    user: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASS,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0
});

// var pool = mysql2.createPool({
//     host: process.env.PROD_DB_HOST,
//     database: process.env.PROD_DB_NAME,
//     user: process.env.PROD_DB_USER,
//     password: process.env.PROD_DB_PASS,
//     waitForConnections: true,
//     connectionLimit: 5,
//     queueLimit: 0,
//   });

const connection = pool.promise();

module.exports = connection;