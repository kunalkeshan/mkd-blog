"use strict";

const Router = require("express").Router();
const articleRouter = require("./routes");

Router.use(articleRouter);

module.exports = Router;