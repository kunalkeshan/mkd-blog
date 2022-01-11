const Router = require("express").Router();
const authenticate = require("../helper/middleware/auth");

// Index Controller 
const indexController = require("./controller");

// App Routers
const userRouter = require("./user");
const articleRouter = require("./article");
const commentsRouter = require("./comments");
const featuresRouter = require("./features");

// Using App Routers
Router.use(userRouter);
Router.use(articleRouter);
Router.use(commentsRouter);
Router.use(featuresRouter);

// Implementing the Index Controller
/* ====================== 
    UNAUTHENTICATED ROUTES
   ====================== */

Router.get("/", indexController.toIndex);
Router.get("/index", indexController.redirectToIndex);

/* ====================== 
    AUTHENTICATED ROUTES
   ====================== */

Router.get("/home", authenticate, indexController.toHome);



module.exports = Router;
