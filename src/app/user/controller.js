'use strict';

const User = require('./model');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const {
	oneDayExpireDurationInMs,
	secrets: { resetPasswordSecret },
} = require('../../helper/config');
const {
	sendWelcomeAndVerifyEmail,
	sendForgotPasswordEmail,
} = require('../../helper/mail'); // Work in progress

/* ====================== 
    UNAUTHENTICATED CONTROLLERS
   ====================== */

/**
 * @description Check if Username already exists
 * @route GET /api/author/isUsernameUnique/
 * @data username as a string in the body
 * @access Public
 */
exports.isUsernameUnique = async (req, res) => {
	const { username } = req.body;
	try {
		// Pre checks
		if (!username)
			throw new Error("Request Body should contain {username: 'String'}");
		if (typeof username !== 'string')
			throw new Error(
				`{username} should be a string, cannot be ${typeof username}`
			);
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
exports.isEmailUnique = async (req, res) => {
	const { email } = req.body;
	try {
		// Pre checks
		if (!email)
			throw new Error("Request Body should contain {email: 'String'}");
		if (typeof email !== 'string')
			throw new Error(
				`{email} should be a string, cannot be ${typeof email}`
			);
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
exports.registerUser = async (req, res) => {
	const { email, password, fullName, username } = req.body;
	try {
		// Pre checks
		if (!fullName || !email || !username || !password)
			throw new Error(
				`Request Body should contain {${fullName ? '' : ' fullName,'}${
					username ? '' : ' username,'
				}${email ? '' : ' email,'}${
					password ? '' : ' password'
				}}: 'String'`
			);
		if (typeof fullName !== 'string')
			throw new Error(
				`{fullName} should be a string, cannot be a ${typeof fullName}`
			);
		if (typeof username !== 'string')
			throw new Error(
				`{username} should be a string, cannot be a ${typeof username}`
			);
		if (typeof email !== 'string')
			throw new Error(
				`{email} should be a string, cannot be a ${typeof email}`
			);
		if (typeof password !== 'string')
			throw new Error(
				`{password} should be a string, cannot be a ${typeof password}`
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

		// //Sending response
		// sendWelcomeAndVerifyEmail({
		// 	emailTo: newUser.email,
		// 	fullName: newUser.fullName,
		// 	userId: newUser.userId,
		// });
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
exports.loginUser = async (req, res) => {
	const { email = '', username = '', type, password } = req.body;
	const isEmailLogin = type === 'email';
	try {
		// Pre Check
		if (!email && isEmailLogin) {
			if (!email)
				throw new Error(
					"Request Body should contain {email: 'String'}"
				);
		}
		if (email) {
			if (typeof email !== 'string')
				throw new Error(
					`{email} should be a string, cannot be ${typeof email}`
				);
			if (!validator.isEmail(email))
				throw new Error('Should be a valid email!');
		}
		if (!username && !isEmailLogin)
			throw new Error("Request Body should contain {username: 'String'}");
		if (username) {
			if (typeof username !== 'string')
				throw new Error(
					`{username} should be a string, cannot be a ${typeof username}`
				);
			if (username.length < 8 || username.length > 16)
				throw new Error(
					'{username} should have a minimum length of 8 characters and maximum of 16 characters'
				);
		}
		if (!password)
			throw new Error("Request Body should contain {password: 'String'}");
		if (typeof password !== 'string')
			throw new Error(
				`{password} should be a string, cannot be a ${typeof password}`
			);

		// Get User
		const query = isEmailLogin ? { email } : { username };
		let user = await User.findOne({ where: query });
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
exports.getUserById = async (req, res) => {
	const { userId } = req.body;
	try {
		// Pre Checks
		if (!userId)
			throw new Error("Request Body should contain {userId: 'String'}");
		if (typeof userId !== 'string')
			throw new Error(
				`{userId} should be a string, cannot be a ${typeof userId}`
			);

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
exports.getUserByUsername = async (req, res) => {
	const { username } = req.body;
	try {
		// Pre Checks
		if (!username)
			throw new Error("Request Body should contain {username: 'String'}");
		if (typeof username !== 'string')
			throw new Error(
				`{username} should be a string, cannot be a ${typeof username}`
			);
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
 * @description Verify User Account
 * @route PATCH /api/author/verify/:userId
 * @data the userId in the req params
 * @access Public
 * * Work in Progress
 */
exports.verifyAccount = async (req, res) => {
	const { userId } = req.params;
	try {
		// Pre Checks
		if (!userId)
			throw new Error('UserId is required in order to verify User!');

		// Finding User
		let user = await User.findByPk(userId);
		if (!user) throw new Error('No Such User found!');

		!user.isVerified ? await user.update({ isVerified: true }) : '';
		user = user.generateSanitizedUser();
		return res.status(200).json({
			message: 'Account Verified Successfully',
			data: {
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

/**
 * @description Reset User password after forgotten
 * @route PATCH /api/author/forgot-password/:userId
 * @data the userId in the req params and password in the req body
 * @access Public
 */
exports.resetForgotPassword = async (req, res) => {
	const { userId } = req.params;
	const { password } = req.body;
	try {
		// Pre Checks
		if (!userId)
			throw new Error('UserId is required in order to verify User!');
		if (!password)
			throw new Error("Request body must contain {password: 'String'}");
		if (typeof password !== 'string')
			throw new Error('{password} must be a string');
		if (!validator.isStrongPassword(password))
			throw new Error(
				'Password is not Strong! minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,'
			);

		// Finding User
		const user = await User.findByPk(userId);
		if (!user) throw new Error('No Such User found!');

		// Checking if Reset Password is same as old password
		const checkPassword = await user.authenticateUser(password);
		if (checkPassword)
			throw new Error(' Reset Password is the same as old password');

		let updatedUser = await user.updatePasswordAndReturnUser(password);
		updatedUser = updatedUser.generateSanitizedUser();
		return res.status(200).json({
			message: 'User Password Updated Successfully',
			data: {
				user: updatedUser,
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
 * @description Send a email to the user to reset their password
 * @route GET /api/author/sendResetPasswordMail
 * @data the username in the req body
 * @access Public
 */
exports.sendResetPasswordMail = async (req, res) => {
	const { email } = req.body;
	try {
		// Pre Checks
		if (!email)
			throw new Error("Request body must contain {email: 'String'}");
		if (typeof email !== 'string')
			throw new Error(
				`{email} must be a string, cannot be ${typeof email}`
			);
		if (!validator.isEmail(email)) throw new Error('Not a valid Email');

		// Finding User
		const user = await User.findOne({ where: { email } });
		if (!user) throw new Error('Email does not exist!');

		// Sending Email
		sendForgotPasswordEmail({
			emailTo: user.email,
			fullName: user.fullName,
			userId: user.userId,
		});
		return res.status(200).json({
			message: 'Reset Password email is sent',
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
 * @description Render the user profile with username
 * @route GET /author/:username
 * @data the username in the req params
 * @access Public
 */
exports.toUserProfile = async (req, res) => {
	const { username } = req.params;
	const token = req.cookies.authToken;
	try {
		// Pre checks
		let isCurrentUser = token
			? await User.getUserFromAuthToken(token)
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
		});
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message, data: {}, success: false });
	}
};

/**
 * @description Render the Verify User Page
 * @route GET /author/verify/:userId
 * @data the userId in the req params
 * @access Public
 */
exports.toVerifyUserAccount = async (req, res) => {
	const { userId } = req.params;
	try {
		// Pre Checks
		if (!userId)
			throw new Error('UserId is required in order to verify User!');

		// Finding User
		let user = await User.findByPk(userId);
		if (!user) throw new Error('No Such User found!');
		!user.isVerified ? await user.update({ isVerified: true }) : '';

		user = user.generateSanitizedUser();
		return res.render('verify-user', {
			data: {
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

/*
 * @description Render the Reset User Password Page
 * @route GET /author/forgot-password/:userId
 * @data the userId in the req params
 * @access Public
 */
exports.toResetForgotPassword = async (req, res) => {
	const { userId } = req.params;
	const { auth } = req.query;
	try {
		// Pre Checks
		if (!userId)
			throw new Error('UserId is required in order to verify User!');
		if (!auth) throw new Error('Invalid Token, Cannot update Password');

		jwt.verify(auth, resetPasswordSecret, (err, decoded) => {
			if (err) throw new Error('Invalid Token, Cannot update Password');
			if (decoded.userId !== userId)
				throw new Error('Invalid Token, Cannot update Password');
		});

		let user = await User.findByPk(userId);
		if (!user) throw new Error('No Such User found!');

		user = user.generateSanitizedUser();
		return res.render('forgot-password', {
			page: {
				title: '',
				link: '',
			},
			data: {
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
exports.updateBio = async (req, res) => {
	const { userId } = req.user;
	const { bio } = req.body;
	try {
		// Pre Checks
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
exports.updateLinks = async (req, res) => {
	const { userId } = req.user;
	const { links } = req.body;
	try {
		// Pre Checks
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
exports.updateUserDetails = async (req, res) => {
	const { userId } = req.user;
	const { fullName, username, email } = req.body;
	try {
		// pre checks
		if (!fullName || !username || !email)
			throw new Error(
				`Request body should contain { ${fullName ? '' : 'fullName,'}${
					username ? '' : ' username,'
				}${email ? '' : ' email'} }`
			);
		if (!validator.isEmail(email))
			throw new Error("Email Invalid, should be {email: 'String'}");
		if (username.length < 8 || username.length > 16)
			throw new Error(
				'{username} should have a minimum length of 8 characters and maximum of 16 characters'
			);

		// Check username existence
		let belongsToUser;
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
			data: {},
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
exports.updateUserPassword = async (req, res) => {
	const { userId } = req.user;
	const { oldPassword, newPassword } = req.body;
	try {
		// Pre checks
		if (!oldPassword || !newPassword)
			throw new Error(
				`Request Body should contain {${
					oldPassword ? '' : ' oldPassword,'
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
exports.toUserEdit = async (req, res) => {
	const { userId } = req.user;
	try {
		// Find User
		let user = await User.findByPk(userId);
		if (!user) throw new Error('Error finding User');

		// Get user details for frontend only
		user = user.generateSanitizedUser();
		return res.render('profile-edit', {
			page: {
				title: `${user.username} | Mkd Blog`,
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
exports.deleteUserAccount = async (req, res) => {
	const { userId } = req.user;
	const { password } = req.body;
	try {
		// Pre Checks
		if (!password)
			throw new Error("Request body must contain {password: 'String'}");
		if (typeof password !== 'string')
			throw new Error(
				`{password} should be a string, cannot be a ${typeof password}`
			);

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
exports.logoutUser = (req, res) => {
	if (!req.user) res.status(400).json({ message: 'Unable to Logout.' });
	return res
		.status(200)
		.cookie('authToken', '', { maxAge: 10 })
		.json({ message: 'Logged Out successfully' });
};
