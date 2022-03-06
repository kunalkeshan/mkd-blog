/**
 * User Controller
 */

'use strict';

// Dependencies
const User = require('./model');
const validator = require('validator');
const { Op } = require('sequelize');
const { oneDayExpireDurationInMs } = require('../../helper/config');

// User Controller Container
const userController = {};

/* ====================== 
	UNAUTHENTICATED CONTROLLERS
   ====================== */

/**
 * @description Check if Username already exists
 * @route GET /api/author/isUsernameUnique/
 * @data username as a string in the body
 * @access Public
 */
userController.isUsernameUnique = async (req, res) => {
	let { username } = req.body;
	try {
		// Pre checks
		username = username && typeof username === 'string' ? username : false;
		if (!username)
			throw new Error("Request Body should contain {username: 'String'}");
		if (username.length < 8 || username.length > 16)
			throw new Error(
				'{username} should have a minimum length of 8 characters and maximum of 16 characters'
			);

		// Find Username
		const usernameCount = await User.count({ where: { username } });
		const isUsernameUnique = !usernameCount;

		return res.status(200).json({
			message: `Username is${isUsernameUnique ? '' : ' not'} available`,
			data: { isUsernameUnique },
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message, data: {}, success: false });
	}
};

/**
 * @description Check if Email already exists
 * @route GET /api/author/isEmailUnique/
 * @data email as a string in the body
 * @access Public
 */
userController.isEmailUnique = async (req, res) => {
	let { email } = req.body;
	try {
		// Pre checks
		email = email && typeof email === 'string' ? email : false;
		if (!email)
			throw new Error("Request Body should contain {email: 'String'}");
		if (!validator.isEmail(email))
			throw new Error("{email: 'Should be a valid Email'}");

		// Find email
		const emailCount = await User.count({ where: { email } });
		const isEmailUnique = !emailCount;

		return res.status(200).json({
			message: `Email is${isEmailUnique ? '' : ' not'} available`,
			data: { isEmailUnique },
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message, data: {}, success: false });
	}
};

/**
 * @description Register a new User
 * @route POST /api/author/register/
 * @data the user details in the req body
 * @access Public
 */
userController.registerUser = async (req, res) => {
	let { email, password, fullName, username } = req.body;
	try {
		// Pre checks
		email = email && typeof email === 'string' ? email : false;
		username = username && typeof username === 'string' ? username : false;
		fullName = fullName && typeof fullName === 'string' ? fullName : false;
		password = password && typeof password === 'string' ? password : false;
		if (!fullName || !email || !username || !password)
			throw new Error(
				`Request Body should contain {${fullName ? '' : ' fullName,'}${username ? '' : ' username,'
				}${email ? '' : ' email,'}${password ? '' : ' password'
				}}: 'String'`
			);
		if (!validator.isEmail(email))
			throw new Error("{email: 'Should be a valid Email'}");
		if (!validator.isStrongPassword(password))
			throw new Error(
				'Password is not Strong! minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,'
			);
		if (username.length < 8 || username.length > 16)
			throw new Error(
				'{username} should have a minimum length of 8 characters and maximum of 16 characters'
			);

		// Saving new User
		let newUser = User.build({
			hashedPassword: req.body.password,
			...req.body,
		});
		await newUser.save();

		// Generating Auth token
		const token = newUser.generateAuthToken();

		// Update user before sending
		newUser = newUser.generateSanitizedUser();

		//Sending response
		res.cookie('authToken', token, {
			httpOnly: true,
			signed: true,
			maxAge: oneDayExpireDurationInMs,
		});
		return res.status(201).json({
			message: 'Account Registered Successfully!',
			data: {
				user: newUser,
			},
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: error.message,
			sqlMessage: error.errors && error?.errors[0]?.message,
			data: {},
			success: false,
		});
	}
};

/**
 * @description Login a user
 * @route POST /api/author/login/
 * @data the user details in the req body
 * @access Public
 */
userController.loginUser = async (req, res) => {
	let { email = '', username = '', password } = req.body;
	try {
		// Pre Check
		password = password && typeof password === 'string' ? password : false;
		if (!password)
			throw new Error("Request Body should contain {password: 'String'}");

		// Get User
		let user = await User.findOne({
			where: {
				[Op.or]: [{ email }, { username }],
			}
		});
		if (!user) throw new Error('No Such User Exists');

		// Authenticate user w password
		const checkPassword = await user.authenticateUser(password);
		if (!checkPassword) throw new Error('Invalid Password!');

		// Generate Auth Token
		const token = user.generateAuthToken();

		// Update User before sending
		await user.update({ lastLogin: Date.now() });
		user = user.generateSanitizedUser();

		// Sending response
		res.cookie('authToken', token, {
			httpOnly: true,
			signed: true,
			maxAge: oneDayExpireDurationInMs,
		});
		return res.status(200).json({
			message: 'Login Successful!',
			data: { user },
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: error.message,
			data: {},
			success: false,
		});
	}
};

/**
 * @description Get user details with userId
 * @route GET /api/author/id
 * @data the userId in the req body
 * @access Public
 */
userController.getUserById = async (req, res) => {
	let { userId } = req.body;
	try {
		// Pre Checks
		userId = userId && typeof userId === 'string' ? userId : false;
		if (!userId)
			throw new Error("Request Body should contain {userId: 'String'}");

		// Finding User
		let userById = await User.findByPk(userId);
		if (!userById) throw new Error('No Such User Found');

		// Update user before sending
		userById = userById.generateSanitizedUser();
		return res.status(200).json({
			message: `User with userId: '${userId}' found.`,
			data: {
				user: userById,
			},
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message, data: {}, success: false });
	}
};

/**
 * @description Get user details with username
 * @route GET /api/author/username
 * @data the username in the req body
 * @access Public
 */
userController.getUserByUsername = async (req, res) => {
	let { username } = req.body;
	try {
		// Pre Checks
		username = username && typeof username === 'string' ? username : false;
		if (!username)
			throw new Error("Request Body should contain {username: 'String'}");
		if (username.length < 8 || username.length > 16)
			throw new Error(
				'{username} should have a minimum length of 8 characters and maximum of 16 characters'
			);

		// Finding User
		let userByUsername = await User.findOne({ where: { username } });
		if (!userByUsername) throw new Error('No Such User Found');

		// Update user before sending
		userByUsername = userByUsername.generateSanitizedUser();
		return res.status(200).json({
			message: `User with username: '${username}' found.`,
			data: {
				user: userByUsername,
			},
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message, data: {}, success: false });
	}
};

/**
 * @description Render the user profile with username
 * @route GET /author/:username
 * @data the username in the req params
 * @access Public
 */
userController.toUserProfile = async (req, res) => {
	const { username } = req.params;
	const { authToken } = req.signedCookies;
	try {
		// Pre checks
		let isCurrentUser = authToken
			? await User.getUserFromAuthToken(authToken)
			: false;
		let user = await User.findOne({ where: { username } });
		if (!user) throw new Error('No Such User Found');

		// Check if user is checking their own profile
		isCurrentUser = isCurrentUser.userId === user.userId;
		user = user.generateSanitizedUser();
		return res.render('profile', {
			page: {
				title: `${username}`,
				link: 'profile',
			},
			data: {
				isCurrentUser,
				user,
			},
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message, data: {}, success: false });
	}
};

/* ====================== 
	AUTHENTICATED CONTROLLERS
   ====================== */

/**
 * @description Update User Bio
 * @route PATCH /api/author/updateBio
 * @data bio in request body
 * @access Private
 */
userController.updateBio = async (req, res) => {
	const { userId } = req.user;
	let { bio } = req.body;
	try {
		// Pre Checks
		bio = bio && typeof bio === 'object' ? bio : false;
		if (!bio) throw new Error("Request body must contain {bio: 'Object'}");
		for (const prop in bio) {
			const userBio = bio[prop];
			if (typeof userBio !== 'string')
				throw new Error(
					`{bio} properties must be string, ${prop} is not of type string`
				);
		}

		// Finding User
		const user = await User.findByPk(userId);
		if (!user) throw new Error('Error finding user');

		// Updating User Bio
		await user.update({ bio: JSON.stringify(bio) });
		return res.status(200).json({
			message: 'Bio Updated Successfully',
			data: { bio },
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message, data: {}, success: false });
	}
};

/**
 * @description Update User Links
 * @route PATCH /api/author/updateLinks
 * @data links in request body
 * @access Private
 */
userController.updateLinks = async (req, res) => {
	const { userId } = req.user;
	let { links } = req.body;
	try {
		// Pre Checks
		links = links && typeof links === 'object' ? links : false;
		if (!links)
			throw new Error("Request Body should contain {links: 'Object'}");
		for (const link in links) {
			const url = links[link];
			if (typeof url !== 'string')
				throw new Error(
					`${link} should be a string, cannot be a ${typeof url}`
				);
			if (!validator.isURL(url))
				throw new Error(`${link} link is not valid!`);
		}

		// Finding User
		const user = await User.findByPk(userId);
		if (!user) throw new Error('Error finding user');

		// Updating User Links
		await user.update({ links: JSON.stringify(links) });
		return res.status(200).json({
			message: 'Links Updated Successfully',
			data: { links },
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message, data: {}, success: false });
	}
};

/**
 * @description Update User details
 * @route PATCH /api/author/updateUserDetails
 * @data fullName, username, email in request body
 * @access Private
 */
userController.updateUserDetails = async (req, res) => {
	const { userId } = req.user;
	let { fullName, username, email } = req.body;
	try {
		// pre checks
		email = email && typeof email === 'string' ? email : false;
		username = username && typeof username === 'string' ? username : false;
		fullName = fullName && typeof fullName === 'string' ? fullName : false;
		if (!fullName || !username || !email)
			throw new Error(
				`Request body should contain { ${fullName ? '' : 'fullName,'}${username ? '' : ' username,'
				}${email ? '' : ' email'} }`
			);
		if (!validator.isEmail(email))
			throw new Error("Email Invalid, should be {email: 'String'}");
		if (username.length < 8 || username.length > 16)
			throw new Error(
				'{username} should have a minimum length of 8 characters and maximum of 16 characters'
			);

		// Check username existence
		let belongsToUser = null;
		const usernameCheck = await User.findAndCountAll({
			where: {
				username,
			},
		});
		belongsToUser = usernameCheck?.rows[0]?.username === username;
		if (usernameCheck?.count && !belongsToUser)
			throw new Error(`Username: ${username} is already used!`);

		// Check email existence
		const emailCheck = await User.findAndCountAll({
			where: {
				email,
			},
		});
		belongsToUser = emailCheck?.rows[0]?.email === email;
		if (emailCheck.count && !belongsToUser)
			throw new Error(`Email: ${email} is already used!`);

		// update user
		const user = await User.findByPk(userId);
		if (!user) throw new Error('Error finding user');
		await user.update(req.body);
		return res.status(200).json({
			message: 'User details updated successfully',
			data: { details: { fullName, username, email } },
			success: true,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: error.message,
			data: {},
			success: false,
		});
	}
};

/**
 * @description Update User Password
 * @route PATCH /api/author/updatePassword
 * @data old and new password in request body
 * @access Private
 */
userController.updateUserPassword = async (req, res) => {
	const { userId } = req.user;
	let { oldPassword, newPassword } = req.body;
	try {
		// Pre checks
		oldPassword = oldPassword && typeof oldPassword === 'string' ? oldPassword : false;
		newPassword = newPassword && typeof newPassword === 'string' ? newPassword : false;
		if (!oldPassword || !newPassword)
			throw new Error(
				`Request Body should contain {${oldPassword ? '' : ' oldPassword,'
				}${newPassword ? '' : ' newPassword'} }`
			);

		// Finding User
		const user = await User.findByPk(userId);
		if (!user) throw new Error('Error finding User');

		// Validating before updating user password
		const valid = await user.authenticateUser(oldPassword);
		if (!valid) throw new Error('Wrong Password!');
		if (oldPassword === newPassword)
			throw new Error('Old password cannot be the same as new password!');
		if (!validator.isStrongPassword(newPassword))
			throw Error(
				'New Password is not Strong! minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,'
			);

		// Update User Password
		await user.updatePasswordAndReturnUser(newPassword);
		return res.status(200).json({
			message: 'Password updated successfully!',
			data: {},
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message, data: {}, success: false });
	}
};

/**
 * @description Render User Edit Page
 * @route GET /author/:username/edit
 * @access Private
 */
userController.toUserEdit = async (req, res) => {
	const { userId } = req.user;
	try {
		// Find User
		let user = await User.findByPk(userId);
		if (!user) throw new Error('Error finding User');

		// Get user details for frontend only
		user = user.generateSanitizedUser();
		return res.render('profile-edit', {
			page: {
				title: `${user.username}`,
				link: 'profile-edit',
			},
			data: {
				user,
			},
		});
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message, data: {}, success: false });
	}
};

/**
 * @description Delete a User
 * @route DELETE /api/author/deleteUser
 * @access Private
 */
userController.deleteUserAccount = async (req, res) => {
	const { userId } = req.user;
	let { password } = req.body;
	try {
		// Pre Checks
		password = password && typeof password === 'string' ? password : false;
		if (!password)
			throw new Error("Request body must contain {password: 'String'}");

		// Finding User
		const user = await User.findByPk(userId);
		if (!user) throw new Error('Unable to find user');

		// Validating User before deleting
		const checkPassword = await user.authenticateUser(password);
		if (!checkPassword) throw new Error('Invalid Password!');

		// Deleting User account
		await user.destroy();
		res.cookie('authToken', '', { maxAge: 10 });
		return res.status(200).json({
			message: 'User account deleted Successfully',
			data: {},
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message, data: {}, success: false });
	}
};

/**
 * @description Logout User and Clear Cookie
 * @route POST /api/author/logout
 * @access Private
 */
userController.logoutUser = (req, res) => {
	return res
		.status(200)
		.clearCookie('authToken')
		.json({ message: 'Logged Out successfully' });
};

// Exporting User Controller
module.exports = userController;
