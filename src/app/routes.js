const Router = require("express").Router();
const authenticate = require("../helper/middleware/auth");

const indexController = require("./controller");
const userRouter = require("./user");
const articleRouter = require("./article");
const commentsRouter = require("./comments");
const featuresRouter = require("./features");


Router.get("/", indexController.toIndex);
Router.get("/home", authenticate, indexController.toHome);

Router.use(userRouter);
Router.use(articleRouter);
Router.use(commentsRouter);
Router.use(featuresRouter);


module.exports = Router;
