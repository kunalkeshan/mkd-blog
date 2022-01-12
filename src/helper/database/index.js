"use strict";

// Importing Packages 
const Sequelize = require("sequelize");
const { database: db, nodeEnvironment } = require("../config");

// Checking Node Environment
const isDevelopment = nodeEnvironment === "development";

// Accessing Database Configs
const { host, user, password, database: dbName} = isDevelopment ? db.development : db.production;

// Creating Connection Instance from Sequelize
const sequelize = new Sequelize(dbName, user, password, {
    host,
    dialect: db.dialect,
    // operatorsAliases: false,
    pool: {...db.pool},
    logging: false,
});

// Authenticating and Syncing Sequelize Connection.  
const authenticateConnectionAndSync = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({});
        console.log(`>>> Connected and Synced to ${dbName} Database!`);
    } catch (error) {
        console.log(`>>> Error Connecting to ${dbName} Database with error: ${error}`);
    }
}
authenticateConnectionAndSync();

// Exporting Sequelize package and sequelize connection.
const database = {
    Sequelize,
    sequelize,
}
module.exports = database;


