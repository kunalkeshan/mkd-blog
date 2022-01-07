require("dotenv").config();

module.exports = {
    port: process.env.PORT,
    nodeEnvironment: process.env.NODE_ENV,
    backendUrl: process.env.BACKEND_URL,
    database: {
        development: {
            host: process.env.DB_DEV_HOST, 
            user: process.env.DB_DEV_USER, 
            password: process.env.DB_DEV_PASSWD,
            database: process.env.DB_DEV_DB_NAME,
        },
        production: {
            host: process.env.DB_PROD_HOST,
            user: process.env.DB_PROD_USER,
            password: process.env.DB_PROD_PASSWD,
            database: process.env.DB_PROD_DB_NAME,
        },
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
        saltRounds: parseInt(process.env.SALT),
        nanoidLength: parseInt(process.env.NANOID_LENGTH),
        idLength: parseInt(process.env.ID_LENGTH),
    },
    cloudinary: {
        cloudinaryUrl: process.env.CLOUDINARY_URL,
        cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    },
    rebrandly: {
        rebrandlyApiKey: process.env.REBRANDLY_API_KEY,
    }
}