"use strict";

const Router = require("express").Router();
const authenticate = require("../../helper/middleware/auth");
const User = require("../user/model");
const articleController = require("./controller");
const Article = require("./model");

/* ====================== 
    UNAUTHENTICATED ROUTES
   ====================== */


/* ====================== 
    AUTHENTICATED ROUTES
   ====================== */

Router.post("/api/createArticle", authenticate, articleController.createNewArticle);

(async () => {
    try{
    const all = await Article.findAll({
        where: {
            userId: "BOlzX24SmQsubc5Z"
        },
        include: [{
            model: User,
            required: false,
        }]
    })    
    all.forEach(article => console.log(article.toJSON()))
    } catch(error) {
        console.log(error);
    }
})();

module.exports = Router;