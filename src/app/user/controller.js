const User = require("./model");
const validator = require("validator");
const moment = require("moment");
const { renderAppPage } = require("../../helper/middleware/appFunctions");
const { Sequelize: { DataTypes } } = require("../../helper/database");


/* ====================== 
    UNAUTHENTICATED CONTROLLERS
   ====================== */

/* 
* @desc Check if Username already exists
* @route GET /api/isUsernameUnique/
* @data username as a string in the body
* @access Public
*/
exports.isUsernameUnique = async (req, res) => {
    try {
        // Pre checks
        if(!req.body.username) throw new Error("Request Body should contain {username: 'String'}");

        // Find Username
        const checkUsername = await User.findAndCountAll({
            where: {
                username: req.body.username,
            }
        });
        const isUsernameUnique = !checkUsername.count;

        res.status(200).json({message: `Username is${isUsernameUnique ? "": " not"} available`, isUsernameUnique});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

/* 
* @desc Check if Email already exists
* @route GET /api/isEmailUnique/
* @data email as a string in the body
* @access Public
*/
exports.isEmailUnique = async (req, res) => {
    try {
        // Pre checks
        if(!req.body.email) throw new Error("Request Body should contain {email: 'String'}");
        if(!validator.isEmail(req.body.email)) throw new Error("{email: 'Should be a valid Email'}");

        // Find email
        const email = await User.findAndCountAll({
            where: {
                email: req.body.email,
            }
        });
        const isEmailUnique = !email.count;

        res.status(200).json({message: `Email is${isEmailUnique ? "" : " not"} available`, isEmailUnique});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({message: error.message});
    }
}

/* 
* @desc Register a new User
* @route POST /api/register/
* @data the user details in the req body
* @access Public
*/
exports.registerUser = async (req, res) => {
    try {
        // Pre checks
        if(!req.body.fullName || !req.body.email || !req.body.username || !req.body.password) throw new Error(`Request Body should contain {${req.body.fullName ? "" : " fullName,"}${req.body.username ? "" : " username,"}${req.body.email ? "" : " email,"}${req.body.password ? "" : " password"}}: 'String'`)
        if(!validator.isEmail(req.body.email)) throw new Error("{email: 'Should be a vaild Email'}");

        // Saving new User
        const newUser = User.build({hashedPassword: req.body.password,...req.body});
        await newUser.save();

        // Generating Auth token
        const token = newUser.generateAuthToken();

        // Update user before sending
        const user = newUser.toJSON();
        delete user.hashedPassword;
        user.registeredAt = moment(user.registeredAt).format("MMMM Do YYYY, h:mm:ss a");
        user.lastLogin = moment(user.lastLogin).format("MMMM Do YYYY, h:mm:ss a");

        // Sending response
        res.status(201).cookie("authToken", token).json({ message: "Account Registered Successfully!", user });
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message, sqlMessage: error.errors && error?.errors[0]?.message});
    }
}

/* 
* @desc Login a user
* @route POST /api/login/
* @data the user details in the req body
* @access Public
*/
exports.loginUser = async (req, res) => {
    const isUsernameLogin = req.body.type === "username";
    try {
        // Pre Check
        if(!req.body.email && !isUsernameLogin) throw new Error("Request Body should contain {email: 'String'}");
        if(!req.body.username && isUsernameLogin) throw new Error("Request Body should contain {username: 'String'}");

        // Get User 
        const query = isUsernameLogin ? {username: req.body.username} : {email: req.body.email}
        const user = await User.findOne({where: query});
        if(!user) throw new Error("No Such User Exists");

        // Authenticate user w password
        const checkPassword = await user.authenticateUser(req.body);
        if(!checkPassword) throw new Error("Invalid Password!");

        // Generate Auth Token
        const token = user.generateAuthToken();

        // Update User before sending
        await user.update({lastLogin: Date.now()})
        const loggedinUser = user.toJSON();
        delete loggedinUser.hashedPassword;
        loggedinUser.registeredAt = moment(loggedinUser.registeredAt).format("MMMM Do YYYY, h:mm:ss a");
        loggedinUser.lastLogin = moment(loggedinUser.lastLogin).format("MMMM Do YYYY, h:mm:ss a");

        // Sending response
        res.status(200).cookie("authToken", token).json({message: "Login Successful!", user: loggedinUser});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message, sqlMessage: error.errors && error?.errors[0]?.message});
    }
}

/* 
* @desc Get user details with userId
* @route GET /api/user/id
* @data the userId in the req body
* @access Public
*/
exports.getUserById = async (req, res) => {
    try {
        if(!req.body.userId) throw new Error("Request Body should contain {userId: 'String'}");
        const user = await User.findByPk({userId: req.body.userId});
        if(!user) throw new Error("No Such User Found");
        res.status(200).json({message: `User with userId:${userId} found.`, user});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

/* 
* @desc Get user details with username
* @route GET /api/user/username
* @data the username in the req body
* @access Public
*/
exports.getUserByUsername = async (req, res) => {
    try {
        if(!req.body.username) throw new Error("Request Body should contain {username: 'String'}");
        const user = await User.findOne({username: req.body.username});
        if(!user) throw new Error("No Such User Found");
        res.status(200).json({message: `User with username:${username} found.`, user});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

/* 
* @desc Render the user profile with username
* @route GET /author/:username
* @data the username in the req params
* @access Public
*/
exports.toUserProfile = async (req, res) => {
    const { username } = req.params;
    // TODO: check for auth token instead;
    const currentUser = req.user ? req.user : false;
    try {
        const user = await User.findOne({where: {
            username: username,
        }});
        if(!user) throw new Error("No Such User Found");
        const isCurrentUser = currentUser && currentUser.username === username ;   
        renderAppPage({
            res: res,
            renderTo: "profile",
            options: {
                page: {
                    title: `${username} | Mkd Blog`,
                    link: "profile",
                },
                isCurrentUser, 
                user,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

/* ====================== 
    AUTHENTICATED CONTROLLERS
   ====================== */

exports.updateBio = async (req, res) => {
    const { userId } = req.user
    try {
        const user = await User.findByPk({userId});
        if(!user) throw new Error("Error finding user");
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
        if(!user) throw new Error("Error finding user");
        await user.update({links: req.body.links});
        res.status(200).json({message: "Links Updated Successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

exports.updateUserDetails = async (req, res) => {
    const { userId } = req.user;
}

exports.updateUserPassword = async (req, res) => {
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;
    try {
        const user = User.findByPk({ userId });
        if(!user) throw new Error("Error finding User");
        const valid = await user.authenticateUser({password: oldPassword});
        if(!valid) throw new Error("Wrong Password!");
        await user.update({hashedPassword: newPassword});
        res.status(201).json({message: "Password updated successfully!"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

exports.toUserEdit = async (req, res) => {
    const { userId } = req.user;
    try {
        let user = User.findByPk({ userId });
        if(!user) throw new Error("Error finding User");
        delete user.hashedPassword;
        user = user.toJSON();
        renderAppPage({
            res: res,
            renderTo: "profile-edit",
            options: {
                page: {
                    title: `${username} | Mkd Blog`,
                    link: "profile-edit",
                },
                user,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

exports.logoutUser = async (req, res) => {
    if(!req.user) res.status(400).json({message: "Unable to Logout User"});
    res.status(200).cookie("authToken", "", {maxAge: 10}).json({message: "User Logged Out successfully"});
}




