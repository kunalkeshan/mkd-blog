const {nanoid} = require("nanoid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {  secrets: {nanoidLength, saltRounds} } = require("../../helper/config");
const { sendQuery } = require("../../helper/database");
const { parseData } = require("../../helper/middleware/appFunctions");

class User {

    constructor({username, fullName, email, password}){

        this.userId = nanoid(nanoidLength);
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.hashedPassword = bcrypt.hashSync(password, saltRounds);
        this.image = `https://avatars.dicebear.com/api/initials/${userInitials()}.svg`;
        
        
        function userInitials(){
            const name = fullName.split(" ");
            return [name[0].charAt(0), name[1].charAt(0)].join("");
        }
        
        const handleCreateUser = async () => {
            const setNewUser = `INSERT INTO user_details (userId, username, fullName, email, hashedPassword, image) VALUES ('${this.userId}', '${this.username}', '${this.fullName}', '${this.email}', '${this.hashedPassword}', '${this.image}')`;
            try {
                let newUser = await sendQuery(setNewUser);
                if(newUser.affectedRows > 0){
                    const getNewUser = `SELECT * FROM user_details WHERE userId='${this.userId}';`;
                    newUser = await sendQuery(getNewUser);
                    if(newUser.length){
                        newUser = parseData(newUser);
                        return newUser;
                    } else throw new Error("Error getting User!")
                } else throw new Error("Error creating User!")
            } catch (error) {
                console.log(error)
            }
        }

        handleCreateUser().then(user => this.user);
    }

    static async getUserWithId(id){
        const getUser = `SELECT * FROM user_details WHERE userId='${id}';`;
        try {
            
            let user = await sendQuery(getUser);
            if(user.length){
                return parseData(user);
            } else throw new Error("Error getting user!");

        } catch (error) {
            console.log(error)
        }
    }

    static async getUserWithUsername(username){
        const getUser = `SELECT * FROM user_details WHERE username='${username}';`;
        try {
            // FIXME: returning undefined
            this.user = await sendQuery(getUser);
            if(this.user.length){
                this.user = parseData(this.user)
                console.log(this.user)
                return this.user;
            } else throw new Error("Error getting user!");

        } catch (error) {
            console.log(error)
        }
    }
    
}

module.exports = User;