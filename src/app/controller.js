/**
 * Index Controllers
 */

'use strict';

// Dependencies
const User = require('./user/model');
const Article = require('./article/model');
const { Op } = require('sequelize');

/* ====================== 
	UNAUTHENTICATED CONTROLLERS
   ====================== */

// Index Controller Container
const indexController = {};

/**
* @description Search For a give Query
* @route GET /api/search?search=<search query here>
* @data {search} in Request Query
* @access Public
*/
indexController.search = async (req, res) => {
	// Collecting Required Data from Request Query
	const { search } = req.query;
	try {
		if (!search) throw new Error('Search Query not found');
		// Searching Articles
		let articles = await Article.findAll({
			where: {
				[Op.or]: [
					{ 'title': { [Op.like]: `%${search}%` } },
					{ 'body': { [Op.like]: `%${search}%` } },
					{ ['$fullName$']: { [Op.like]: `%${search}%` } },
					{ ['$username$']: { [Op.like]: `%${search}%` } },
				],
			},
		});
		let users = await User.findAll({
			where: {
				[Op.or]: [
					{ 'fullName': { [Op.like]: `%${search}%` } },
					{ 'username': { [Op.like]: `%${search}%` } },
					{ ['$title$']: { [Op.like]: `%${search}%` } },
					{ ['$body$']: { [Op.like]: `%${search}%` } },
				],
			},
			include: {
				model: Article,
				required: true,
				attributes: ['title', 'body'],
			}
		});

		articles.length > 0 && articles.forEach((article) => {
			article = article.generateSanitizedArticle();
		});

		users.length > 0 && users.forEach((user) => {
			user = user.generateSanitizedUser();
		});

		return res.status(200).json({
			message: 'Query searched',
			data: { users, articles },
			success: true,
		})
	} catch (error) {
		return res.status(400).json({ message: error.message, data: {}, success: false })
	}
}

// Page Routes

/**
* @description Render Index Page
* @route GET /
* @data None
* @access Public
*/
indexController.toIndex = (req, res) => {
	return res.render('index', {
		page: { title: 'Markdown Blog', link: 'index' },
	});
};

/**
* @description Redirect Index Page
* @route GET /index
* @data None
* @access Public
*/
indexController.redirectToIndex = (req, res) => {
	return res.redirect('/');
};

/**
* @description Render Home Page
* @route GET /home
* @data None
* @access Public
*/
indexController.toHome = (req, res) => {
	return res.render('index', {
		page: { title: 'Home', link: 'home' },
	});
};

/**
* @description Render Search Page
* @route GET /search
* @data None
* @access Public
*/
indexController.toSearch = (req, res) => {
	return res.render('search', {
		page: { title: 'Search', link: 'search' },
	});
}


/* ====================== 
	AUTHENTICATED CONTROLLERS
   ====================== */


// Exporting Index Controller
module.exports = indexController;
