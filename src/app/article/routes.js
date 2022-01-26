'use strict';

const Router = require('express').Router();
const authenticate = require('../../helper/middleware/auth');
const articleController = require('./controller');

/* ====================== 
    UNAUTHENTICATED ROUTES
   ====================== */

// Router.get("/:articleId");

// Router.get("/all");

/* ====================== 
    AUTHENTICATED ROUTES
   ====================== */

Router.post('/api/article/create', authenticate, articleController.createNewArticle);

Router.patch('/api/article/updateTitle', authenticate, articleController.updateTitle);

module.exports = Router;
