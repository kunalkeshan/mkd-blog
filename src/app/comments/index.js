"use strict";

const Router = require("express").Router();
const commentsRouter = require("./routes");

Router.use(commentsRouter);

module.exports = Router;