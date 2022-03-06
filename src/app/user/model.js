/**
 * User Model
 */

'use strict';

// Dependencies
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { nanoid } = require('../../helper/utils')
const {
	sequelize,
	Sequelize: { DataTypes, Model },
} = require('../../helper/database');
const {
	secrets: {
		nanoidLength,
		saltRounds,
		jwtSecret,
	},
	oneDayExpireDurationInMs,
} = require('../../helper/config');

// JSON fields stored as string in database.
const STRING_IN_DB = ['links', 'bio'];

// User Model inherited from Sequelize Model
class User extends Model {
	// Instance Methods

	// Hash User password
	generateHashedPassword() {
		this.hashedPassword = bcrypt.hashSync(this.hashedPassword, saltRounds);
	}

	// Take User fullName and get initials for user image
	generateDefaultAvatar() {
		const userInitials = this.fullName
			.split(' ')
			.map((word) => word.charAt(0))
			.join('');
		this.image = `https://avatars.dicebear.com/api/initials/${userInitials}.svg`;
	}

	// Generate Auth token from user object
	generateAuthToken() {
		const token = jwt.sign(this.toJSON(), jwtSecret, {
			expiresIn: oneDayExpireDurationInMs,
		});
		return token;
	}

	// get sanitized user, delete password and date in readable format
	generateSanitizedUser() {
		const user = this.toJSON();
		delete user.hashedPassword;
		user.lastLogin = moment(user.lastLogin).format('MMMM Do YYYY, h:mm:ss a');
		user.registeredAt = moment(user.registeredAt).format('MMMM Do YYYY, h:mm:ss a');
		STRING_IN_DB.forEach((string) => {
			for (const prop in user) {
				if (prop === string) {
					user[prop] = JSON.parse(user[prop]);
				}
			}
		});
		return user;
	}

	// Update the user password
	async updatePasswordAndReturnUser(password = '') {
		const newPassword = await bcrypt.hash(password, saltRounds);
		const user = this.update({ hashedPassword: newPassword });
		return user;
	}

	// Validate right password
	async authenticateUser(password = '') {
		const valid = await bcrypt.compare(password, this.hashedPassword);
		return valid;
	}

	/**
	 * @param {array} args all Keys of the User object
	 */
	convertToJSON(args) {
		const userInstance = this.toJSON();
		args.forEach((arg) => {
			for (const prop in userInstance) {
				if (arg === prop) {
					userInstance[prop] = JSON.parse(userInstance[prop]);
				}
			}
		});
	}

	/**
	 * @param {Array} of all Keys of the User object
	 */
	convertToString(...args) {
		const userInstance = this.toJSON();
		args.forEach((arg) => {
			for (const prop in userInstance) {
				if (arg === prop) {
					userInstance[prop] = JSON.parse(userInstance[prop]);
				}
			}
		});
	}

	// Static Methods

	// Get a user from the auth token
	static async getUserFromAuthToken(token) {
		try {
			const user = jwt.verify(token, jwtSecret);
			if (!user.userId) throw new Error('Invalid Token!');
			const userByPk = await this.findByPk(user.userId);
			if (!user) throw new Error('Unable to find user');
			return userByPk.toJSON();
		} catch (error) {
			console.log(error);
		}
	}
}

User.init(
	{
		userId: {
			type: DataTypes.STRING(40),
			primaryKey: true,
			defaultValue: () => nanoid(nanoidLength),
			allowNull: false,
		},
		fullName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: {
				msg: 'Username already exists!',
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: {
				msg: 'Email already exists!',
			},
			validate: {
				isEmail: true,
			},
		},
		links: {
			type: DataTypes.TEXT('medium'),
			allowNull: false,
			defaultValue: '{"instagram":"","linkedin":"","twitter":""}',
		},
		bio: {
			type: DataTypes.TEXT('long'),
			allowNull: false,
			defaultValue: '{"headline":"","about":""}',
		},
		image: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'https://avatars.dicebear.com/api/initials/•.svg`',
		},
		hashedPassword: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '',
		},
		registeredAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		lastLogin: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		modelName: 'user_details',
		timestamps: false,
		hooks: {
			beforeSave: (user) => {
				if (!user.isNewRecord) return;
				user.generateDefaultAvatar();
				user.generateHashedPassword();
				user.convertToString(STRING_IN_DB);
			},
			afterSave: (user) => {
				user.convertToJSON(STRING_IN_DB);
			},
			beforeUpdate: (user) => {
				user.convertToString(STRING_IN_DB);
			},
		},
	}
);

// Exporting User Model
module.exports = User;
