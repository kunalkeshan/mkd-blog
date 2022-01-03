// Importing Packages
const mysql = require("mysql");
const util = require("util");
const { database, nodeEnvironment } = require("../config");

// Checking Development Environment
const isDevelopment = nodeEnvironment === "development";

// Creating a Connection Instance
const db = mysql.createConnection(isDevelopment ? database.development : database.production);    

// Creating a shortcut to send queries 
const sendQuery = util.promisify(db.query).bind(db);

// Connecting to the Database
db.connect(function(err){
    if(err) {
        console.log(err.message);
        database.destroy();
    } else {
        console.log("Connected to Database!")
    };
});

// Exporting Connection instance and quick query. 
module.exports = {
    db,
    sendQuery
};