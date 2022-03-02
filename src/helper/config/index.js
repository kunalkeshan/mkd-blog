"use strict";

require("dotenv").config();

// Checking Node Environment
const isProduction = process.env.NODE_ENV === "production";

// Database Configuration
const dbDevelopment = {
    host: process.env.DB_DEV_HOST,
    user: process.env.DB_DEV_USER,
    password: process.env.DB_DEV_PASSWD,
    database: process.env.DB_DEV_DB_NAME,
};
const dbProduction = {
    host: process.env.DB_PROD_HOST,
    user: process.env.DB_PROD_USER,
    password: process.env.DB_PROD_PASSWD,
    database: process.env.DB_PROD_DB_NAME,
};
const dbConfig = isProduction ? dbProduction : dbDevelopment;

// Configuration Container
const configuration = {
    port: process.env.PORT,
    isProduction,
    baseUrl: process.env.BASE_URL,
    oneDayExpireDurationInMs: 8.64e+7, // 1 Day in MilliSeconds
    database: {
        dbConfig,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        dialect: "mysql",
    },
    secrets: {
        jwtSecret: process.env.JWT_SECRET,
        cookieSecret: process.env.COOKIE_SECRET,
        saltRounds: 10,
        nanoidLength: 16,
        idLength: 8,
    },
    tinyMce: {
        tinyMceApiKey: process.env.TINYMCE_API_KEY,
    },
};

// Exporting Configuration
module.exports = configuration;