const Router = require("express").Router();

const { auth } = require("../middleware/auth");

// Importing Routes 
const indexRouter = require("./index");
const homeRouter = require("./home");
const userRouter = require("./user");
const articleRouter = require("./article");
const featuresRouter = require("./features");

// Using Routes
Router.use("/", indexRouter);
Router.use("/home", auth, homeRouter);
Router.use("/user", auth, userRouter);
Router.use("/article", auth, articleRouter);
Router.use("/feature", auth, featuresRouter);

module.exports = Router;