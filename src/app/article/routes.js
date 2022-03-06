/**
 * Article Routes
 */

'use strict';

// Dependencies
const Router = require('express').Router();
const articleController = require('./controller');
const { authenticate } = require('../../helper/middleware/auth');

/* ====================== 
    UNAUTHENTICATED ROUTES
   ====================== */

Router.get("/api/article", articleController.getArticles);

Router.post('/api/article/html', articleController.convertToHtml);

// Page Routes

Router.get("/article/:username/:articleTopic", articleController.toSingleArticle);

/* ====================== 
    AUTHENTICATED ROUTES
   ====================== */

Router.post('/api/article/', authenticate, articleController.createNewArticle);

Router.patch('/api/article/title', authenticate, articleController.updateTitle);

Router.patch('/api/article/body', authenticate, articleController.updateBody);

Router.patch('/api/article/publish', authenticate, articleController.publishArticle);

Router.delete('/api/article', authenticate, articleController.deleteArticle);

// Page Routes

Router.get('/article/:articleId/edit', authenticate, articleController.toEditArticle);

module.exports = Router;
