const User = require("./model");

/* ====================== 
    UNAUTHENTICATED CONTROLLERS
   ====================== */

exports.isUsernameUnique = async (req, res) => {
    try {
        const username = await User.findAndCountAll({username: req.body.username});
        if(!username.count) throw new Error("Username Taken");
        res.status(200).json({message: "Username Available"}); 
    } catch (error) {
        console.log(error);
        res.status().json({message: error.message});
    }
}

exports.isEmailUnique = async (req, res) => {
    try {
        const username = await User.findAndCountAll({email: req.body.username});
        if(!username.count) throw new Error("Email Taken");
        res.status(200).json({message: "Email Available"}); 
    } catch (error) {
        console.log(error);
        res.status().json({message: error.message});
    }
}

exports.registerUser = async (req, res) => {
    try {
        const newUser = User.build(req.body);
        await newUser.save();
        const token = newUser.generateAuthToken();
        res.status(200).cookie("authToken", token).json({message: "Account Registered Successfully!"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username, email: req.body.email});
        if(!user) throw new Error("No Such User Exists");
        const checkPassword = user.authenticateUser(req.body);
        if(checkPassword) {
            const token = user.generateAuthToken();
            res.status(200).cookie("authToken", token).json({message: "Login Successful!"})
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message})
    }
}

/* ====================== 
    AUTHENTICATED CONTROLLERS
   ====================== */