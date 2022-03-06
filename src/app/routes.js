/**
 * App Routes
 */

"use strict";

// Dependencies
const Router = require("express").Router();

// Index Controller 
const indexController = require("./controller");

// App Routers
const userRouter = require("./user");
const articleRouter = require("./article");

// Using App Routers
Router.use(userRouter);
Router.use(articleRouter);

/* ====================== 
    UNAUTHENTICATED ROUTES
   ====================== */

Router.get('/api/search', indexController.search);

// Page Render Routes

Router.get("/", indexController.toIndex);

Router.get("/home", indexController.toHome);

Router.get("/index", indexController.redirectToIndex);

Router.get('/search', indexController.toSearch);

/* ====================== 
    AUTHENTICATED ROUTES
   ====================== */




module.exports = Router;
