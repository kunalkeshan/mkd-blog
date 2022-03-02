/**
 * App Export
 */

"use strict";

// Dependencies
const Router = require("express").Router();
const routerHub = require("./routes");

Router.use(routerHub);

module.exports = Router;