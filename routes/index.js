const Router = require("express").Router();
const { database, sendQuery } = require("../database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pageDetails, errorLogger, generateId } = require("../middleware/appFunctions");
const { query } = require("express");

Router.get("/", (req, res) => {
    res.render("index", pageDetails("Markdown Blog", "index"));
});

Router.post("/register", async (req, res) => {

    const {fullName, username, email, password, isSaved} = req.body;
    const check = {
        username: false,
        email: false
    }

    // Queries
    const checkEmail = `SELECT * FROM user_details WHERE email='${email}';`
    const checkUsername = `SELECT * FROM user_details WHERE username='${username}'`

    try {

        const emailExists = await sendQuery(checkEmail);
        const usernameExists = await sendQuery(checkUsername);

        if(emailExists.length) check.email = true;
        if(usernameExists.length) check.username = true;

        if(emailExists.length === 0 && isSaved){
            if(usernameExists.length === 0 && isSaved){
                const userId = generateId();
                const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT))

                const registerUser = `INSERT INTO user_details (userId, fullName, email, username, hashedPassword) VALUES ('${userId}', '${fullName}', '${email}', '${username}', '${hashedPassword}');`;

                let newUser = await sendQuery(registerUser);
                
                if(newUser.affectedRows > 0) {
                    res.status(201).json({message: "user created successfully"});
                } else throw new Error("Unable to register at the moment!");

            } else res.status(409).json({message: "Username already exists!"});
        } else res.status(409).json({message: "Email Already Exists!"});

    } catch(error) { 
        errorLogger("Index", error)
    } finally {
        database.end();
    }

});



Router.post("/login", (req, res) => {

})

module.exports = Router;