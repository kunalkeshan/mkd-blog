const mysql = require("mysql");
const util = require("util");
require('dotenv').config();
const isDevelopment = process.env.NODE_ENV === "development";

function db(){
    return mysql.createConnection({
        host: isDevelopment ? process.env.DB_DEV_HOST : process.env.DB_PROD_HOST,
        user: isDevelopment ? process.env.DB_DEV_USER : process.env.DB_PROD_USER,
        password: isDevelopment ? process.env.DB_DEV_PASSWD : process.env.DB_PROD_PASSWD,
        database: isDevelopment ? process.env.DB_DEV_DB_NAME : process.env.DB_PROD_DB_NAME,
    });    
}

const database = db();
const sendQuery = util.promisify(database.query).bind(database);

try {
    database.connect(function(err){
        if(err) database.end();
    });
} catch (error) {
    console.log(error);
}


module.exports = {
    database,
    sendQuery
};