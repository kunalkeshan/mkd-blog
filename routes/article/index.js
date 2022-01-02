const Router = require("express").Router();

const createRouter = require("./createArticle");
const readRouter = require("./readArticle");
const editRouter = require("./editArticle");
const deleteRouter = require("./deleteArticle");

Router.use("/create", createRouter);
Router.use("/read", readRouter);
Router.use("/edit", editRouter);
Router.use("/delete", deleteRouter);

module.exports = Router;