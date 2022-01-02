// Importing Packages
const mysql = require("mysql");
const util = require("util");
require('dotenv').config();

// Checking Development Environment
const isDevelopment = process.env.NODE_ENV === "development";

// Creating a Connection Instance
const database = mysql.createConnection({
    host: isDevelopment ? process.env.DB_DEV_HOST : process.env.DB_PROD_HOST,
    user: isDevelopment ? process.env.DB_DEV_USER : process.env.DB_PROD_USER,
    password: isDevelopment ? process.env.DB_DEV_PASSWD : process.env.DB_PROD_PASSWD,
    database: isDevelopment ? process.env.DB_DEV_DB_NAME : process.env.DB_PROD_DB_NAME,
});    

// Creating a shortcut to send queries 
const sendQuery = util.promisify(database.query).bind(database);

// Connecting to the Database
database.connect(function(err){
    if(err) {
        console.log(err.message);
        database.destroy();
    } else {
        console.log("Connected to Database!")
    };
});

// Exporting Connection instance and quick query. 
module.exports = {
    database,
    sendQuery
};