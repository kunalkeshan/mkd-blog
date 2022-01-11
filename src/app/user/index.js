"use strict";

const Router = require("express").Router();
const userRouter = require("./routes");

Router.use(userRouter);

module.exports = Router;