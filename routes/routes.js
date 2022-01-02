const Router = require("express").Router();

// Importing Routes 
const indexRouter = require("./index");

// Using Routes
Router.use("/", indexRouter);

module.exports = Router;