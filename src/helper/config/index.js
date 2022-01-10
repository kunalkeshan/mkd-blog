require("dotenv").config();

module.exports = {
    port: process.env.PORT,
    nodeEnvironment: process.env.NODE_ENV,
    baseUrl: process.env.BASE_URL,
    expireDuration: 8.64e+7, // 1 Day
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
        cookieSecret: process.env.COOKIE_SECRET,
        saltRounds: parseInt(process.env.SALT, 10),
        nanoidLength: parseInt(process.env.NANOID_LENGTH, 10),
        idLength: parseInt(process.env.ID_LENGTH, 10),
    },
    cloudinary: {
        cloudinaryUrl: process.env.CLOUDINARY_URL,
        cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    },
    rebrandly: {
        rebrandlyApiKey: process.env.REBRANDLY_API_KEY,
    },
    nodemailer: {
        email: process.env.NODEMAILER_EMAIL,
        password: process.env.NODEMAILER_PASSWORD,
    }
}