/**
 * App Routes
 */

"use strict";

// Dependencies
const Router = require("express").Router();
const { checkJwt } = require('../helper/middleware/auth')

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

// Page Render Routes

Router.get("/", indexController.toIndex);

Router.get("/home", checkJwt, indexController.toHome);

Router.get("/index", checkJwt, indexController.redirectToIndex);

Router.get("/auth", indexController.toAuth);

/* ====================== 
    AUTHENTICATED ROUTES
   ====================== */




module.exports = Router;
