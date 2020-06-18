require("dotenv").config();

const mysql = require("mysql");
const configObj = mysql.createPool({
    host: process.env.host,
    user: process.env.username,
    password: process.env.password,
    port: process.env.port,
    database: process.env.database,
});

module.exports = configObj;
