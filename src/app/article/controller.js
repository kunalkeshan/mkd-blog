/**
 * Article Controllers
 */

'use strict';

// Dependencies
const Article = require('./model');
const { marked } = require('marked');
const turndown = require('turndown');

// Article Controller Container
const articleController = {};

/* ====================== 
	UNAUTHENTICATED CONTROLLERS
   ====================== */

/** 
* @desc Get all articles - Limit to about 20
* @route GET /api/article/fetch/
* @access Public
* ! To be tested
*/
articleController.getArticles = async (req, res) => {
	// Collecting Required Data from Request Body
	const { offset = 0 } = req.body;
	try {
		const articles = await Article.findAll({
			limit: 5,
			offset,
		});
	} catch (error) {

	}
};

articleController.getArticleById = async (req, res) => { };

articleController.convertToHtml = (req, res) => { };

articleController.convertToMarkdown = (req, res) => { };

/* ====================== 
	AUTHENTICATED CONTROLLERS
   ====================== */

/** 
* @desc Create new Article
* @route POST /api/article/create/
* @data User should be logged in
* @access Private
* ! To be tested
*/
articleController.createNewArticle = async (req, res) => {
	const { userId } = req.user;
	try {
		// Pre checks
		if (!userId) throw new Error('Log in to Create a Article');

		// Create new Article
		const newArticle = Article.build({ userId });
		await newArticle.save();

		// Respond with article details
		return res.status(201).json({
			message: 'Article Created!',
			data: {
				article: newArticle.toJSON(),
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
* @desc Update article title
* @route PATCH /api/article/updateTitle
* @data title and article id in the request body
* @access Private
! To be Tested
*/
articleController.updateTitle = async (req, res) => {
	const { userId } = req.user;
	const { title, articleId } = req.body;
	try {
		// Pre checks
		if (!userId) throw new Error('User should be logged in!');
		if (!title || !articleId)
			throw new Error(
				`Request body should contain {${title ? '' : ' title,'}${articleId ? '' : ' articleId'
				}}`
			);

		// Getting article
		const articleToUpdate = await Article.findByPk(articleId);
		if (!articleToUpdate) throw new Error('Unable to find article!');

		// Updating Article title
		await articleToUpdate.update({ title });
		return res.status(200).json({
			message: 'Title updated Successfully',
			data: {
				article: articleToUpdate.toJSON(),
			},
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message, data: {}, status: false });
	}
};

// Separate route for markdown based articles??
// Separate route to save direct html body from tinymce???
// Cross platform body - Markdown <-> HTML user can switch

/** 
* @desc Update article body
* @route PATCH /api/article/updateBody
* @data body and article id in the request body
* @access Private
* ! To be Tested
* ? marked, turndown, and tinymce to be integrated 
*/
articleController.updateBody = async (req, res) => {
	const { userId } = req.user;
	const { body, articleId } = req.body;
	try {
		// Pre checks
		if (!userId) throw new Error('User should be logged in!');
		if (!body || !articleId)
			throw new Error(
				`Request body should contain {${body ? '' : ' body,'}${articleId ? '' : ' articleId'
				}}`
			);

		// Getting article
		const articleToUpdate = await Article.findByPk(articleId);
		if (!articleToUpdate) throw new Error('Unable to find article!');

		// Updating Article title
		await articleToUpdate.update({ body });
		return res
			.status(200)
			.json({
				message: 'Body updated Successfully',
				article: articleToUpdate.toJSON(),
			});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: error.message });
	}
};

/**
* @description <Controller description here>
* @route METHOD <Route>
* @data <Data either in body, params, or query>
* @access <Access Level>
* ! To be Tested
*/
articleController.editArticle = async (req, res) => {
	const { userId } = req.user;
	const { articleId } = req.body;
	try {
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message, data: {}, success: false });
	}
};

articleController.deleteArticle = async (req, res) => { };

// Exporting Article Controller
module.exports = articleController;