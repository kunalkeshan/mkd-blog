const User = require("./model");
const { renderAppPage } = require("../../helper/middleware/appFunctions")

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
        res.status(201).cookie("authToken", token).json({message: "Account Registered Successfully!"});
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

exports.getUser = async (req, res) => {

}

exports.toUserProfile = async (req, res) => {

}

/* ====================== 
    AUTHENTICATED CONTROLLERS
   ====================== */

exports.updateBio = async (req, res) => {
    const { userId } = req.user
    try {
        const user = await User.findByPk({userId});
        if(!user) throw new Error("Error to find user");
        await user.update({bio: req.body.bio});
        res.status(200).json({message: "Bio Updated Successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

exports.updateLinks = async (req, res) => {
    const { userId } = req.user
    try {
        const user = await User.findByPk({userId});
        if(!user) throw new Error("Error to find user");
        await user.update({links: req.body.links});
        res.status(200).json({message: "Links Updated Successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

exports.updateUserDetails = async (req, res) => {

}

exports.updateUserPassword = async (req, res) => {

}

exports.toUserEdit = async (req, res) => {

}

exports.logoutUser = async (req, res) => {
    if(!req.user) res.status(400).json({message: "Unable to Logout User"});
    res.status(200).cookie("authToken", "", {maxAge: 10}).json({message: "User Logged Out successfully"});
}




