const User = require("./model");
const validator = require("validator");
const { renderAppPage } = require("../../helper/middleware/appFunctions");
const { expireDuration } = require("../../helper/config");
// const { sendWelcomeEmail } = require("../../helper/mailer"); // Work in progress


/* ====================== 
    UNAUTHENTICATED CONTROLLERS
   ====================== */

/** 
* @desc Check if Username already exists
* @route GET /api/isUsernameUnique/
* @data username as a string in the body
* @access Public
*/
exports.isUsernameUnique = async (req, res) => {
    const { username } = req.body;
    try {
        // Pre checks
        if(!username) throw new Error("Request Body should contain {username: 'String'}");
        if(typeof username !== "string") throw new Error(`{username} should be a string, cannot be ${typeof username}`);

        // Find Username
        const checkUsername = await User.findAndCountAll({
            where: {
                username: username,
            }
        });
        const isUsernameUnique = !checkUsername.count;

        res.status(200).json({message: `Username is${isUsernameUnique ? "": " not"} available`, isUsernameUnique});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

/** 
* @desc Check if Email already exists
* @route GET /api/isEmailUnique/
* @data email as a string in the body
* @access Public
*/
exports.isEmailUnique = async (req, res) => {
    const {email} = req.body;
    try {
        // Pre checks
        if(!email) throw new Error("Request Body should contain {email: 'String'}");
        if(typeof email !== "string") throw new Error(`{email} should be a string, cannot be ${typeof email}`);
        if(!validator.isEmail(req.body.email)) throw new Error("{email: 'Should be a valid Email'}");

        // Find email
        const emailCheck = await User.findAndCountAll({
            where: {
                email: email,
            }
        });
        const isEmailUnique = !emailCheck.count;

        res.status(200).json({message: `Email is${isEmailUnique ? "" : " not"} available`, isEmailUnique});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

/** 
* @desc Register a new User
* @route POST /api/register/
* @data the user details in the req body
* @access Public
*/
exports.registerUser = async (req, res) => {
    const {email, password, fullName, username} = req.body;
    try {
        // Pre checks
        if(!fullName || !email || !username || !password) throw new Error(`Request Body should contain {${fullName ? "" : " fullName,"}${username ? "" : " username,"}${email ? "" : " email,"}${password ? "" : " password"}}: 'String'`);
        if(typeof fullName !== "string" ) throw new Error(`{fullName} should be a string, cannot be a ${typeof fullName}`);
        if(typeof username !== "string" ) throw new Error(`{username} should be a string, cannot be a ${typeof username}`);
        if(typeof email !== "string" ) throw new Error(`{email} should be a string, cannot be a ${typeof email}`);
        if(typeof password !== "string" ) throw new Error(`{password} should be a string, cannot be a ${typeof password}`);
        if(!validator.isEmail(email)) throw new Error("{email: 'Should be a valid Email'}");
        if(!validator.isStrongPassword(password)) throw Error("Password is not Strong! minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,");

        // Saving new User
        const newUser = User.build({hashedPassword: req.body.password,...req.body});
        await newUser.save();

        // Generating Auth token
        const token = newUser.generateAuthToken();

        // Update user before sending
        const user = newUser.generateSanitizedUser();

        // Sending response
        // sendWelcomeEmail({
        //     emailTo: user.email,
        //     fullName: user.fullName,
        // });
        res.cookie("authToken", token, {httpOnly: true, signed: true, maxAge: expireDuration});
        res.status(201).json({ message: "Account Registered Successfully!", user });
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message, sqlMessage: error.errors && error?.errors[0]?.message});
    }
}

/** 
* @desc Login a user
* @route POST /api/login/
* @data the user details in the req body
* @access Public
*/
exports.loginUser = async (req, res) => {
    const {email = "", username = "", type, password} = req.body;
    const isEmailLogin = type === "email";
    try {
        // Pre Check
        if(!email && isEmailLogin) {
            if(!email) throw new Error("Request Body should contain {email: 'String'}");
        };
        if(email){
            if(typeof email !== "string") throw new Error(`{email} should be a string, cannot be ${typeof email}`)
            if(!validator.isEmail(email)) throw new Error("Should be a valid email!");
        }
        if(!username && !isEmailLogin) throw new Error("Request Body should contain {username: 'String'}");
        if(typeof username !== "string" ) throw new Error(`{username} should be a string, cannot be a ${typeof username}`);

        // Get User 
        const query = isEmailLogin ? {email} :  {username};
        const user = await User.findOne({where: query});
        if(!user) throw new Error("No Such User Exists");

        // Authenticate user w password
        const checkPassword = await user.authenticateUser(password);
        if(!checkPassword) throw new Error("Invalid Password!");

        // Generate Auth Token
        const token = user.generateAuthToken();

        // Update User before sending
        await user.update({lastLogin: Date.now()})
        const loggedInUser = user.generateSanitizedUser();

        // Sending response
        res.cookie("authToken", token, {httpOnly: true, signed: true, maxAge: expireDuration});
        res.status(200).json({message: "Login Successful!", user: loggedInUser});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message, sqlMessage: error.errors && error?.errors[0]?.message});
    }
}

/** 
* @desc Get user details with userId
* @route GET /api/user/id
* @data the userId in the req body
* @access Public 
*/
exports.getUserById = async (req, res) => {
    const { userId } = req.body;
    try {
        if(!userId) throw new Error("Request Body should contain {userId: 'String'}");
        if(typeof userId !== "string" ) throw new Error(`{userId} should be a string, cannot be a ${typeof userId}`);

        const userById = await User.findByPk(userId);
        if(!userById) throw new Error("No Such User Found");

        // Update user before sending
        const user = userById.generateSanitizedUser();
        
        res.status(200).json({message: `User with userId: '${userId}' found.`, user});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

/** 
* @desc Get user details with username
* @route GET /api/user/username
* @data the username in the req body
* @access Public
*/
exports.getUserByUsername = async (req, res) => {
    const { username } = req.body;
    try {
        if(!username) throw new Error("Request Body should contain {username: 'String'}");
        if(typeof username !== "string" ) throw new Error(`{username} should be a string, cannot be a ${typeof username}`);

        const userByUsername = await User.findOne({where: {
            username,
        }});
        if(!userByUsername) throw new Error("No Such User Found");

        // Update user before sending
        const user = userByUsername.generateSanitizedUser();

        res.status(200).json({message: `User with username: '${username}' found.`, user});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

/** 
* @desc Render the user profile with username
* @route GET /author/:username
* @data the username in the req params
* @access Public
*/
exports.toUserProfile = async (req, res) => {
    const { username } = req.params;
    const token = req.cookies.authToken;
    try {
        let isCurrentUser = token ? await User.getUserFromAuthToken(token) : false;
        const user = await User.findOne({where: {
            username
        }});
        if(!user) throw new Error("No Such User Found");
        isCurrentUser = isCurrentUser.userId === user.userId;
        renderAppPage({res, renderTo: "profile", options: {
                page: {
                    title: `${username} | Mkd Blog`,
                    link: "profile",
                },
                isCurrentUser, 
                user: user.generateSanitizedUser(),
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

/** 
* @desc Update User Bio
* @route PATCH /api/updateBio
* @data bio in request body
* @access Private
*/
exports.updateBio = async (req, res) => {
    const { userId } = req.user;
    const { bio } = req.body;
    try {
        if(!bio) throw new Error("Request body must contain {bio: 'Object'}");
        const user = await User.findByPk(userId);
        if(!user) throw new Error("Error finding user");
        await user.update({bio: JSON.stringify(bio)});
        res.status(201).json({message: "Bio Updated Successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

/** 
* @desc Update User Links
* @route PATCH /api/updateLinks
* @data links in request body
* @access Private
*/
exports.updateLinks = async (req, res) => {
    const { userId } = req.user;
    const { links } = req.body;
    try {
        if(!links) throw new Error("Request Body should contain {links: 'Object'}");
        for(const link in links){
            const url = links[link];
                if(typeof url !== "string" ) throw new Error(`${link} should be a string, cannot be a ${typeof url}`);
                if(!validator.isURL(url)) throw new Error(`${link} link is not valid!`);
        }

        const user = await User.findByPk(userId);
        if(!user) throw new Error("Error finding user");
        await user.update({links: JSON.stringify(links)});

        res.status(201).json({message: "Links Updated Successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

/** 
* @desc Update User details
* @route PATCH /api/updateUserDetails
* @data fullName, username, email in request body
* @access Private
*/
exports.updateUserDetails = async (req, res) => {
    const { userId } = req.user;
    const {fullName, username, email} = req.body;
    try {
        // pre checks
        if(!fullName || !username || !email) throw new Error(`Request body should contain { ${fullName ? "" : "fullName,"}${username ? "" : " username,"}${email ? "" : " email"} }`);
        if(!validator.isEmail(email)) throw new Error("Email Invalid, should be {email: 'String'}");

        // Check username existence
        let belongsToUser;
        const usernameCheck = await User.findAndCountAll({
            where: {
                username,
            }
        });
        belongsToUser = usernameCheck?.rows[0]?.username === username
        if(usernameCheck?.count && !belongsToUser) throw new Error(`Username: ${username} is already used!`);
        
        // Check email existence
        const emailCheck = await User.findAndCountAll({
            where: {
                email
            }
        });
        belongsToUser = emailCheck?.rows[0]?.email === email;
        if(emailCheck.count && !belongsToUser) throw new Error(`Email: ${email} is already used!`)
        
        // update user
        const user = await User.findByPk(userId);
        if(!user) throw new Error("Error finding user");
        await user.update(req.body)
        res.status(201).json({message: "User details updated successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

/** 
* @desc Update User Password
* @route PATCH /api/updatePassword
* @data old and new password in request body
* @access Private
*/
exports.updateUserPassword = async (req, res) => {
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;
    try {
        if(!oldPassword || !newPassword) throw new Error(`Request Body should contain {${oldPassword ? "" : " oldPassword,"}${newPassword ? "" : " newPassword"} }`);

        const user = await User.findByPk(userId);
        if(!user) throw new Error("Error finding User");

        const valid = await user.authenticateUser(oldPassword);
        if(!valid) throw new Error("Wrong Password!");
        if(oldPassword === newPassword) throw new Error("Old password cannot be the same as new password!");
        if(!validator.isStrongPassword(newPassword)) throw Error("New Password is not Strong! minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,");
        await user.updatePasswordAndReturnUser(newPassword);
        res.status(201).json({message: "Password updated successfully!"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

/** 
* @desc Render User Edit Page
* @route GET /author/:username/edit
* @access Private
*/
exports.toUserEdit = async (req, res) => {
    const { userId } = req.user;
    try {
        let user = await User.findByPk(userId);
        if(!user) throw new Error("Error finding User");
        user = user.generateSanitizedUser();
        renderAppPage({
            res,
            renderTo: "profile-edit",
            options: {
                page: {
                    title: `${user.username} | Mkd Blog`,
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

/** 
* @desc Delete a User
* @route DELETE /api/deleteUser
* @access Private
*/
exports.deleteUserAccount = async (req, res) => {
    const { userId } = req.user;
    const { password } = req.body;
    try {
        if(!password) throw new Error("Request body must contain {password: 'String'}");
        if(typeof password !== "string" ) throw new Error(`{password} should be a string, cannot be a ${typeof password}`);
        const user = await User.findByPk(userId);
        if(!user) throw new Error("Unable to find user");
        const checkPassword = await user.authenticateUser(password);
        if(!checkPassword) throw new Error("Invalid Password!");
        await user.destroy();
        res.cookie("authToken", "", {maxAge: 10});
        res.status(204).json({message: "User account deleted Successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
}

/** 
* @desc Logout User and Clear Cookie
* @route POST /api/logout
* @access Private
*/
exports.logoutUser = (req, res) => {
    if(!req.user) res.status(400).json({message: "Unable to Logout."});
    res.status(200).cookie("authToken", "", {maxAge: 10}).json({message: "Logged Out successfully"});
}