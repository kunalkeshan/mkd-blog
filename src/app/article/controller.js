"use strict";

const Article = require("./model");
const { renderAppPage } = require("../../helper/middleware/appFunctions");

/* ====================== 
    UNAUTHENTICATED CONTROLLERS
   ====================== */

exports.getAllArticles = async (req, res) => {

}

exports.getArticleById = async (req, res) => {

}

/* ====================== 
    AUTHENTICATED CONTROLLERS
   ====================== */

exports.createNewArticle = async (req, res) => {
    const { userId } = req.user;
    try {
        const newArticle = Article.build({userId});
        await newArticle.save();
        return res.status(201).json({message: "Article Created!", article: newArticle.toJSON()});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message});
    }
}

exports.saveTitle = async (req, res) => {
    const { userId } = req.user;
    const { title, articleId } = req.body;
    try {
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message})
    }
}

exports.saveBody = async (req, res) => {

}

exports.editArticle = async (req, res) => {

}

exports.deleteArticle = async (req, res) => {

}

