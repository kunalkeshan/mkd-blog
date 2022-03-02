/**
 * Article Export
 */

"use strict";

// Dependencies
const Router = require("express").Router();
const articleRouter = require("./routes");

Router.use(articleRouter);

module.exports = Router;