'use strict';

// Importing Packages
const Sequelize = require('sequelize');
const { database: db, isProduction } = require('../config');

// Accessing Database Configs
const { host, user, password, database: dbName } = db.dbConfig;

// Creating Connection Instance from Sequelize
const sequelize = new Sequelize(dbName, user, password, {
	host,
	dialect: db.dialect,
	// operatorsAliases: false,
	pool: { ...db.pool },
	logging: (msg) => !isProduction && console.log(msg),
});

// Authenticating and Syncing Sequelize Connection.
const authenticateConnectionAndSync = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync(/*{force: isDevelopment}*/);
		console.log(`>>> Connected and Synced to ${dbName} Database!`);
	} catch (error) {
		console.log(
			`>>> Error Connecting to ${dbName} Database with error: ${error}`
		);
	}
};
authenticateConnectionAndSync();

// Exporting Sequelize package and sequelize connection.
const database = {
	Sequelize,
	sequelize,
};
module.exports = database;
