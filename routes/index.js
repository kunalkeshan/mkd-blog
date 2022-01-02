const Router = require("express").Router();
const { database, sendQuery } = require("../database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pageDetails, errorLogger, generateId, parseData, validateEmail } = require("../middleware/appFunctions");
const {redirectToAuth, auth} = require("../middleware/auth");

// Default Route, Index
Router.get("/", redirectToAuth, (req, res) => {
    res.render("index", pageDetails("Markdown Blog", "index"));
});

// Register New User Route
Router.post("/register", async (req, res) => {
    const {fullName, username, email, password, isSaved} = req.body;

    // Check if email already exists
    const checkEmail = async () => {
        const checkEmail = `SELECT * FROM user_details WHERE email='${email}';`
        const emailExists = await sendQuery(checkEmail);
        return emailExists.length ? true : false;
    }
    
    // Check if username already exists
    const checkUsername = async () => {
        const checkUsername = `SELECT * FROM user_details WHERE username='${username}'`
        const usernameExists = await sendQuery(checkUsername);
        return usernameExists.length ? true : false;
    }
    
    try {
        
        const emailValidity = await checkEmail();
        const usernameValidity = await checkUsername();
        
        if(emailValidity && !isSaved) return res.status(409).json({message: "Email already Exists!"})
        if(usernameValidity && !isSaved) return res.status(409).json({message: "Username already Exists!"})
        
        if((!emailValidity && !usernameValidity) && isSaved){
            const userId = generateId();
            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));

            // Query
            const registerUser = `INSERT INTO user_details (userId, fullName, email, username, hashedPassword) VALUES ('${userId}', '${fullName}', '${email}', '${username}', '${hashedPassword}');`;
            let newUser = await sendQuery(registerUser);

            if(newUser.affectedRows > 0){

                const getUser = `SELECT * FROM user_details WHERE userId='${userId}'`;
                newUser = await sendQuery(getUser);
                if(newUser.length > 0){
                    newUser = parseData(newUser)[0];
                    const token = jwt.sign(newUser, process.env.JWT_SECRET, {expiresIn: "1w"});
                    res.status(201).cookie("authToken", token, {httpOnly: true}).json({message: "User Created Successfully!"});
                } else throw new Error("Registered User not found!")
                
            }
        }
    } catch(error) { 
        errorLogger("Index", error);
        res.status(400).json({message: "Something bad happened!"})
    } finally {
        database.end();
    }

});

// Login User Route
Router.post("/login", async (req, res) => {
    const {username = "", email = "", password} = req.body;
    console.log(username, email, password)
    const isEmailLogin = validateEmail(email);

    // Query
    const getUser = `SELECT * FROM user_details WHERE ${isEmailLogin ? `email='${email}'` : `username='${username}'`};`;
    try {
        let User = await sendQuery(getUser);
            if(User.length > 0){
                User = parseData(User)[0];
                const isValidPassword = await bcrypt.compare(password, User.hashedPassword);
                if(isValidPassword){
                    const lastLogin = Date.now().toString();
                    User.lastLogin = lastLogin;

                    const updateUser = `UPDATE user_details SET lastLogin='${lastLogin}' WHERE userId='${User.userId}'`;
                    const response = await sendQuery(updateUser);

                    if(response.affectedRows > 0){
                        const token = jwt.sign(User, process.env.JWT_SECRET, {expiresIn: "1w"});
                        res.cookie("authToken", token, {httpOnly: true})
                        res.status(201).redirect("/home");
                    } else throw new Error("Something bad happened!");
                    
                } else res.status(401).json({message: "Wrong Password! Please Try Again!"})
            } else res.status(404).json({message: "No such user exists!"})
    } catch(error) { 
        errorLogger("Login", error);
        res.status(400).json({message: "Something bad happened!"})
    } finally {
        database.end();
    }
    
});

Router.post("/logout", auth, (req, res) => {
    res.clearCookie("authToken");
    res.status(200).json({message: "Logout Successful"});
});


module.exports = Router;