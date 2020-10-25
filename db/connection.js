const mysql = require("mysql2");
require('dotenv').config();


const connection = mysql.createConnection({
    host: "localhost",

    // Your port
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: 'Ferrari4040!!!',
    database: "employee_tracker"
});

module.exports = connection;