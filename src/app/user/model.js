const {nanoid} = require("nanoid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sequelize, Sequelize: { DataTypes, Model } } = require("../../helper/database");
const {  secrets: {nanoidLength, saltRounds, jwtSecret} } = require("../../helper/config");

// JSON fields stored as string in database.
const STRING_IN_DB = ["links", "bio"];

class User extends Model{ 
    
    // Instance Methods

    generateHashedPassword(){
        this.hashedPassword = bcrypt.hashSync(this.hashedPassword, saltRounds);
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

    authenticateUser({password}){
        const valid =  bcrypt.compareSync(password, this.hashedPassword);
        if(!valid) throw new Error("Invalid Password");
        return true;
    }

    // Static Methods
    
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
        beforeSave: (user, options) => {
            user.generateDefaultAvatar();
            user.generateHashedPassword();
            user.convertToString(STRING_IN_DB);
        },
        afterSave: (user, options) => {
            user.convertToJSON(STRING_IN_DB);
        },
        beforeUpdate: (user, options) => {
            user.convertToString(STRING_IN_DB);
        },
        afterUpdate: (user, options) => {
            user.convertToJSON(STRING_IN_DB);
        }
    },
});

module.exports = User;