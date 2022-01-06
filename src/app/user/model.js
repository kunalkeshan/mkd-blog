const {nanoid} = require("nanoid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sequelize, Sequelize: { DataTypes, Model } } = require("../../helper/database");
const {  secrets: {nanoidLength, saltRounds, jwtSecret} } = require("../../helper/config");

// JSON fields stored as string in database.
const STRING_IN_DB = ["links", "bio"];

class User extends Model{ 
    
    // Instance Methods

    generateHashedPassword({password}){
        this.hashedPassword = bcrypt.hashSync(password, saltRounds);
    };

    generateDefaultAvatar(){
        const userInitials = this.fullName.split(" ").map(word => word.charAt(0)).join("");
        this.image = `https://avatars.dicebear.com/api/initials/${userInitials}.svg`;
    };

    generateAuthToken(){
        return jwt.sign(this.toJSON(), jwtSecret, {expiresIn: "1d"});
    };

    /* 
    * @params {Array} Array of all Keys of the User object
    */
    convertToJSON(...args){
        for(let prop in this.toJSON()){
            args.forEach((arg) => {
                this[prop] = arg === prop ? JSON.parse(this[prop]) : this[prop];                
            });
        };
    };

    /* 
    * @params {Array} Array of all Keys of the User object
    */
    convertToString(...args){
        for(let prop in this.toJSON()){
            args.forEach((arg) => {
                this[prop] = arg === prop ? JSON.stringify(this[prop]) : this[prop];                
            });
        };
    };

    // Static Methods

    /* 
    * @params {string} username
    * @params {string} email
    * @returns {Object} checkExists with properties username and email, return value of boolean on check
    */
    static async checkUsernameAndEmailExists({username, email}){
        const checkExists = {
            username: false,
            email: false,
        }
        try {
            const usernameExists = await this.findAndCountAll({where: { username }});
            const emailExists = await this.findAndCountAll({where: { email }});
            if(usernameExists.count) checkExists.username = true;
            if(emailExists.count) checkExists.email = true;
            return checkExists;
        } catch (error) {
            console.log(`Error checking Username and Email: ${error}`);
        }
    }
}

User.init({
    userId: {
        type: DataTypes.STRING(40),
        primaryKey: true,
        defaultValue: nanoid(nanoidLength),
        allowNull: false,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },  
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    links: {
        type: DataTypes.TEXT("medium"),
        allowNull: false,
        defaultValue: "{\"instagram\":\"\",\"linkedin\":\"\",\"twitter\":\"\"}"
    },
    bio: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
        defaultValue: "{\"headline\":\"\",\"about\":\"\"}",
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "https://avatars.dicebear.com/api/initials/•.svg`"
    },
    hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
    },
}, {
    sequelize,
    modelName: "test_user_details",
    createdAt: "registeredAt",
    updatedAt: "lastLogin",
    hooks: {
        afterCreate: (user, options) => {
            user.convertToJSON(STRING_IN_DB);
            user.generateDefaultAvatar();
        },
        afterSave: (user, options) => {
            user.convertToJSON(STRING_IN_DB);
        },
        beforeSave: (user, options) => {
            user.convertToString(STRING_IN_DB);
        },
    }
});

module.exports = User;