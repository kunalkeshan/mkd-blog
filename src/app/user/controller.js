"use strict";

const User = require("./model");
const validator = require("validator");
const { renderAppPage } = require("../../helper/appFunctions");
const { expireDuration } = require("../../helper/config");
const { sendWelcomeAndVerifyEmail } = require("../../helper/mailer"); // Work in progress


/* ====================== 
    UNAUTHENTICATED CONTROLLERS
   ====================== */

/** 
* @desc Check if Username already exists
* @route GET /author/api/isUsernameUnique/
* @data username as a string in the body
* @access Public
*/
exports.isUsernameUnique = async (req, res) => {
    const { username } = req.body;
    try {
        // Pre checks
        if(!username) throw new Error("Request Body should contain {username: 'String'}");
        if(typeof username !== "string") throw new Error(`{username} should be a string, cannot be ${typeof username}`);
        if(username.length < 8 || username.length > 16) throw new Error("{username} should have a minimum length of 8 characters and maximum of 16 characters");

        // Find Username
        const checkUsername = await User.findAndCountAll({
            where: {
                username,
            }
        });
        const isUsernameUnique = !checkUsername.count;

        return res
                .status(200)
                .json({
                    message: `Username is${isUsernameUnique ? "": " not"} available`, 
                    data: {isUsernameUnique}, 
                    success: true,
                });
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message, data: {}, success: false});
    }
}

/** 
* @desc Check if Email already exists
* @route GET /author/api/isEmailUnique/
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

        return res
                .status(200)
                .json({
                    message: `Email is${isEmailUnique ? "" : " not"} available`, 
                    data: {isEmailUnique},
                    success: true,
                });
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message, data: {}, success: false});
    }
}

/** 
* @desc Register a new User
* @route POST /author/api/register/
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
        if(username.length < 8 || username.length > 16) throw new Error("{username} should have a minimum length of 8 characters and maximum of 16 characters");

        // Saving new User
        const newUser = User.build({hashedPassword: req.body.password,...req.body});
        await newUser.save();

        // Generating Auth token
        const token = newUser.generateAuthToken();

        // Update user before sending
        const user = newUser.generateSanitizedUser();

        // Sending response
        sendWelcomeAndVerifyEmail({
            emailTo: user.email,
            fullName: user.fullName,
            userId: user.userId,
        })
        res.cookie("authToken", token, {httpOnly: true, signed: true, maxAge: expireDuration});
        return res
                .status(201)
                .json({
                        message: "Account Registered Successfully!", 
                        data: {user},
                        success: true, 
                    });
    } catch (error) {
        console.log(error);
        return res
                .status(400)
                .json({
                        message: error.message, 
                        sqlMessage: error.errors && error?.errors[0]?.message,
                        data: {},
                        success: false
                    });
    }
}

/** 
* @desc Login a user
* @route POST /author/api/login/
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
        if(username){
            if(typeof username !== "string" ) throw new Error(`{username} should be a string, cannot be a ${typeof username}`);
            if(username.length < 8 || username.length > 16) throw new Error("{username} should have a minimum length of 8 characters and maximum of 16 characters");
        }

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
        return res
                .status(200)
                .json({
                    message: "Login Successful!", 
                    data: {user: loggedInUser},
                    success: true,
                });
    } catch (error) {
        console.log(error);
        return res
                .status(400)
                .json({
                    message: error.message, 
                    sqlMessage: error.errors && error?.errors[0]?.message,
                    data: {},
                    success: false,
                });
    }
}

/** 
* @desc Get user details with userId
* @route GET /author/api/user/id
* @data the userId in the req body
* @access Public 
*/
exports.getUserById = async (req, res) => {
    const { userId } = req.body;
    try {
        // Pre Checks
        if(!userId) throw new Error("Request Body should contain {userId: 'String'}");
        if(typeof userId !== "string" ) throw new Error(`{userId} should be a string, cannot be a ${typeof userId}`);

        // Finding User
        const userById = await User.findByPk(userId);
        if(!userById) throw new Error("No Such User Found");

        // Update user before sending
        const user = userById.generateSanitizedUser();
        return res
                .status(200)
                .json({
                        message: `User with userId: '${userId}' found.`, 
                        data: {user},
                        success: true,
                    });
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message, data: {}, success: false,});
    }
}

/** 
* @desc Get user details with username
* @route GET /author/api/username
* @data the username in the req body
* @access Public
*/
exports.getUserByUsername = async (req, res) => {
    const { username } = req.body;
    try {
        // Pre Checks
        if(!username) throw new Error("Request Body should contain {username: 'String'}");
        if(typeof username !== "string" ) throw new Error(`{username} should be a string, cannot be a ${typeof username}`);
        if(username.length < 8 || username.length > 16) throw new Error("{username} should have a minimum length of 8 characters and maximum of 16 characters");

        // Finding User
        const userByUsername = await User.findOne({where: {username}});
        if(!userByUsername) throw new Error("No Such User Found");

        // Update user before sending
        const user = userByUsername.generateSanitizedUser();

        return res
                .status(200)
                .json({
                        message: `User with username: '${username}' found.`,
                        data: {user},
                        success: true,
                    });
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message, data: {}, success: false,});
    }
}

/* 
* @desc Verify User Account
* @route GET /author/api/verify-:userId
* @data the userId in the req params
* @access Public
! To be tested
*/
exports.verifyAccount = async (req, res) => {
    const { userId } = req.params;
    try {
        // Pre Checks
        if(!userId) throw new Error("UserId is required in order to verify User!");
        const user = await User.findByPk(userId);
        if(!user) throw new Error("No Such User found!");
        await user.update({isVerified: true});
        return res
                .status(200)
                .json({
                    message: "User Account Verified",
                    data: {
                        user: user.toJSON()
                    },
                    success: true,
                })
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message, data: {}, success: false,});
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
        // Pre checks
        let isCurrentUser = token ? await User.getUserFromAuthToken(token) : false;
        const user = await User.findOne({where: {username}});
        if(!user) throw new Error("No Such User Found");
        
        // Check if user is checking their own profile
        isCurrentUser = isCurrentUser.userId === user.userId;
        return renderAppPage({res, renderTo: "profile", options: {
                page: {
                    title: `${username} | Mkd Blog`,
                    link: "profile",
                },
                data: {
                    isCurrentUser, 
                    user: user.generateSanitizedUser(),
                },
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message, data: {}, success: false});
    }
}

/* 
* @desc Render the Verify User Page
* @route GET /author/verify-:userId
* @data the userId in the req params
* @access Public
! To be tested
*/
exports.toVerifyUserAccount = async (req, res) => {
    const { userId } = req.params;
    try {
        // Pre Checks
        if(!userId) throw new Error("UserId is required in order to verify User!");
        const user = await User.findByPk(userId);
        if(!user) throw new Error("No Such User found!");
        await user.update({isVerified: true});
        return renderAppPage({
            res,
            renderTo: "verify-user",
            data: {
                userId
            },
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message, data: {}, success: false});
    }
}

/* ====================== 
    AUTHENTICATED CONTROLLERS
   ====================== */

/** 
* @desc Update User Bio
* @route PATCH /author/api/updateBio
* @data bio in request body
* @access Private
*/
exports.updateBio = async (req, res) => {
    const { userId } = req.user;
    const { bio } = req.body;
    try {
        // Pre Checks
        if(!bio) throw new Error("Request body must contain {bio: 'Object'}");
        for(const prop in bio){
            const userBio = bio[prop];
            if(typeof userBio !== "string") throw new Error(`{bio} properties must be string, ${prop} is not of type string`)
        }

        // Finding User
        const user = await User.findByPk(userId);
        if(!user) throw new Error("Error finding user");

        // Updating User Bio
        await user.update({bio: JSON.stringify(bio)});
        return res
                .status(200)
                .json({
                        message: "Bio Updated Successfully",
                        data: {bio},
                        success: true,
                    });
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message, data: {}, success: false});
    }
}

/** 
* @desc Update User Links
* @route PATCH /author/api/updateLinks
* @data links in request body
* @access Private
*/
exports.updateLinks = async (req, res) => {
    const { userId } = req.user;
    const { links } = req.body;
    try {
        // Pre Checks
        if(!links) throw new Error("Request Body should contain {links: 'Object'}");
        for(const link in links){
            const url = links[link];
                if(typeof url !== "string" ) throw new Error(`${link} should be a string, cannot be a ${typeof url}`);
                if(!validator.isURL(url)) throw new Error(`${link} link is not valid!`);
        }

        // Finding User
        const user = await User.findByPk(userId);
        if(!user) throw new Error("Error finding user");

        // Updating User Links
        await user.update({links: JSON.stringify(links)});
        return res
                .status(200)
                .json({
                        message: "Links Updated Successfully",
                        data: {links},
                        success: true,
                    });
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message, data: {}, success: false});
    }
}

/** 
* @desc Update User details
* @route PATCH /author/api/updateUserDetails
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
        if(username.length < 8 || username.length > 16) throw new Error("{username} should have a minimum length of 8 characters and maximum of 16 characters");

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
        return res
                .status(200)
                .json({
                        message: "User details updated successfully",
                        data: {},
                        success: true,
                    });
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message, data: {}, success: false});
    }
}

/** 
* @desc Update User Password
* @route PATCH /author/api/updatePassword
* @data old and new password in request body
* @access Private
*/
exports.updateUserPassword = async (req, res) => {
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;
    try {
        // Pre checks
        if(!oldPassword || !newPassword) throw new Error(`Request Body should contain {${oldPassword ? "" : " oldPassword,"}${newPassword ? "" : " newPassword"} }`);

        // Finding User
        const user = await User.findByPk(userId);
        if(!user) throw new Error("Error finding User");

        // Validating before updating user password
        const valid = await user.authenticateUser(oldPassword);
        if(!valid) throw new Error("Wrong Password!");
        if(oldPassword === newPassword) throw new Error("Old password cannot be the same as new password!");
        if(!validator.isStrongPassword(newPassword)) throw Error("New Password is not Strong! minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,");

        // Update User Password
        await user.updatePasswordAndReturnUser(newPassword);
        return res
                .status(200)
                .json({
                        message: "Password updated successfully!",
                        data: {},
                        success: true,
                    });
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message, data: {}, success: false});
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
        // Find User
        let user = await User.findByPk(userId);
        if(!user) throw new Error("Error finding User");

        // Get user details for frontend only
        user = user.generateSanitizedUser();
        return renderAppPage({
            res,
            renderTo: "profile-edit",
            options: {
                page: {
                    title: `${user.username} | Mkd Blog`,
                    link: "profile-edit",
                },
                data: {
                    user,
                }
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message, data: {}, success: false});
    }
}

/** 
* @desc Delete a User
* @route DELETE /author/api/deleteUser
* @access Private
*/
exports.deleteUserAccount = async (req, res) => {
    const { userId } = req.user;
    const { password } = req.body;
    try {
        // Pre Checks
        if(!password) throw new Error("Request body must contain {password: 'String'}");
        if(typeof password !== "string" ) throw new Error(`{password} should be a string, cannot be a ${typeof password}`);

        // Finding User
        const user = await User.findByPk(userId);
        if(!user) throw new Error("Unable to find user");

        // Validating User before deleting 
        const checkPassword = await user.authenticateUser(password);
        if(!checkPassword) throw new Error("Invalid Password!");

        // Deleting User account
        await user.destroy();
        res.cookie("authToken", "", {maxAge: 10});
        return res
                .status(200)
                .json({
                        message: "User account deleted Successfully",
                        data: {},
                        success: true,
                    });
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message, data: {}, success: false});
    }
}

/** 
* @desc Logout User and Clear Cookie
* @route POST /author/api/logout
* @access Private
*/
exports.logoutUser = (req, res) => {
    if(!req.user) res.status(400).json({message: "Unable to Logout."});
    return res.status(200).cookie("authToken", "", {maxAge: 10}).json({message: "Logged Out successfully"});
}