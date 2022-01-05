const {nanoid} = require("nanoid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sequelize, Sequelize: { DataTypes, Model } } = require("../../helper/database")
const {  secrets: {nanoidLength, saltRounds, jwtSecret} } = require("../../helper/config");

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
        defaultValue: ""
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
})


module.exports = User;