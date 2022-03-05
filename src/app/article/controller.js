/**
 * Article Controllers
 */

'use strict';

// Dependencies
const Article = require('./model');
const { textFormatConvertor } = require('../../helper/utils');

// Article Controller Container
const articleController = {};

/* ====================== 
	UNAUTHENTICATED CONTROLLERS
   ====================== */

/** 
* @desc Get all articles - Limit to about 20
* @route GET /api/article/
* @data {offset, articleId, limit, userId} in Request Query
* @access Public
*/
articleController.getArticles = async (req, res) => {
	try {
		const articles = await Article.getArticles({ ...req.query });
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

/**
* @description Convert text to html
* @route POST /api/article/html
* @data {text} : 'String' in Request Body
* @access Public
*/
articleController.convertToHtml = (req, res) => {
	// Collecting Required data from Request Body
	const { text } = req.body;
	try {
		const converted = textFormatConvertor(text, { format: 'html' });
		return res.status(200).json({
			message: 'Text Converted to HTML',
			data: { converted },
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
*/
articleController.updateBody = async (req, res) => {
	let { body, articleId } = req.body;
	try {
		// Pre checks
		articleId = articleId && typeof articleId === 'string' ? articleId : false;
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
				data: {
					article: articleToUpdate.toJSON(),
				},
				success: true,
			});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: error.message });
	}
};

/**
* @description Toggles between a article being published or not published
* @route PATCH /api/article/publish
* @data {articleId} : 'String' in Request Body
* @access Author
*/
articleController.publishArticle = async (req, res) => {
	let { articleId } = req.body;
	try {
		// Pre checks
		articleId = articleId && typeof articleId === 'string' ? articleId : false;
		if (!articleId) throw new Error('Article Id is Required');

		// Getting article
		const articleToUpdate = await Article.findByPk(articleId);
		if (!articleToUpdate) throw new Error('Unable to find article!');
		const article = articleToUpdate.toJSON();

		// Updating Article Details
		const details = {
			isPublished: !article.isPublished,
		};
		details.publishedAt = details.isPublished ? Date.now() : null;
		await articleToUpdate.update({ ...details });

		return res
			.status(200)
			.json({
				message: 'Body updated Successfully',
				data: {
					article: articleToUpdate.toJSON(),
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
* @description Delete a Article
* @route DELETE /api/article
* @data {articleId} : 'String' in Request Body
* @access Author
*/
articleController.deleteArticle = async (req, res) => {
	// Collecting Required Data from Request Body
	let { articleId } = req.body;
	try {
		// Pre checks
		articleId = articleId && typeof articleId === 'string' ? articleId : false;
		if (!articleId) throw new Error('Article Id is Required');

		const deleted = await Article.destroy({ where: { articleId } });
		if (deleted === 0) throw new Error('Unable to delete Article');
		return res
			.status(200)
			.json({
				message: 'Article Deleted Successfully',
				data: {},
				success: true
			});
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message, data: {}, success: false });
	}
};

// Exporting Article Controller
module.exports = articleController;
