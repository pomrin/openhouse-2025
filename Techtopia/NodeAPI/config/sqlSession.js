const MySQLStore = require('express-mysql-session');

require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
    var prodSession = new MySQLStore({
        host: process.env.PROD_DB_HOST,
        port: 3306,
        user: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASS,
        database: process.env.PROD_DB_NAME,
        clearExpired: true,
        checkExpirationInterval: 900000, // ms
        expiration: 900000, // ms
    });
    module.exports = prodSession;
} else {
    var devSession = new MySQLStore({
        host: process.env.DEV_DB_HOST,
        port: 3306,
        user: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASS,
        database: process.env.DEV_DB_NAME,
        clearExpired: true,
        checkExpirationInterval: 900000, // ms
        expiration: 900000, // ms
    });
    module.exports = devSession;
}