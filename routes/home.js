const Router = require("express").Router();
const { pageDetails } = require("../middleware/appFunctions");

Router.get("/", (req, res) => {
    
    res.render("home", {...pageDetails("Home | MKDB", "home"), user: req.user});
});

module.exports = Router;