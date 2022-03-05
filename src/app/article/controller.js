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
* @route GET /api/article/
* @data {offset, articleId, limit} in Request Query
* @access Public
*/
articleController.getArticles = async (req, res) => {
	// Collecting Required Data from Request Body
	let { offset, articleId, limit } = req.query;
	try {
		articleId = articleId ? articleId : false;
		const articles = articleId ? await Article.findByPk(articleId) : await Article.getArticles({ offset, limit });
		return res.status(200).json({
			message: 'Articles Fetched',
			data: { articles },
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: error.message,
			data: {},
			success: true,
		});
	}
};

articleController.convertToHtml = (req, res) => { };

articleController.convertToMarkdown = (req, res) => { };

// Page Routes

articleController.toSingleArticle = async (req, res) => {
	// Collecting Required Data from Request Params
	const { articleId } = req.params;
	try {
		// Finding Article
		const article = await Article.findByPk(articleId);
	} catch (error) {
		console.log(error);
	}
}

/* ====================== 
	AUTHENTICATED CONTROLLERS
   ====================== */

/** 
* @desc Create new Article
* @route POST /api/article/create/
* @data User should be logged in
* @access Private
*/
articleController.createNewArticle = async (req, res) => {
	const { userId } = req.user;
	try {
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
* @route PATCH /api/article/title
* @data title and article id in the request body
* @access Private
! To be Tested
*/
articleController.updateTitle = async (req, res) => {
	const { userId } = req.user;
	let { title, articleId } = req.body;
	try {
		// Pre checks
		title = title && typeof title === 'string' ? title : false;
		articleId = articleId && typeof articleId === 'string' ? articleId : false;
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
articleController.publishArticle = async (req, res) => {
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

/**
* @description <Controller description here>
* @route METHOD <Route>
* @data <Data either in body, params, or query>
* @access <Access Level>
* ! To be Tested
*/
articleController.deleteArticle = async (req, res) => { };

// Exporting Article Controller
module.exports = articleController;
