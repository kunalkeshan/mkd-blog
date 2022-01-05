require("dotenv").config();

module.exports = {
    port: process.env.PORT,
    nodeEnvironment: process.env.NODE_ENV,
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
        
    },
    secrets: {
        jwtSecret: process.env.JWT_SECRET,
        saltRounds: +process.env.SALT,
        nanoidLength: +process.env.NANOID_LENGTH,
        idLength: +process.env.ID_LENGTH,
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