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

// Router.get("/:articleId");

Router.get("/api/article", articleController.getArticles);;

/* ====================== 
    AUTHENTICATED ROUTES
   ====================== */

Router.post('/api/article/', authenticate, articleController.createNewArticle);

Router.patch('/api/article/title', authenticate, articleController.updateTitle);

module.exports = Router;
