const Router = require("express").Router();

const userRouter = require("./user");
const commentsRouter = require("./comments");

Router.use(userRouter);
Router.use(commentsRouter);

module.exports = Router;