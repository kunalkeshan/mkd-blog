/**
 * Article Model
 */

"use strict";

// Dependencies
const { sequelize, Sequelize: { DataTypes, Model } } = require("../../helper/database");
const User = require("../user/model");
const moment = require('moment');
const { nanoid } = require("nanoid");
const { textFormatConvertor } = require('../../helper/utils')
const { secrets: { idLength } } = require("../../helper/config");

// Article Model inherited from Sequelize Model
class Article extends Model {

    //Instance Functions

    // get sanitized user, delete password and date in readable format
    generateSanitizedArticle() {
        const article = this.toJSON();
        article.publishedAt = moment(article.publishedAt).format('MMMM Do YYYY, h:mm:ss a');
        article.createdAt = moment(article.createdAt).format('MMMM Do YYYY, h:mm:ss a');
        article.updatedAt = moment(article.updatedAt).format('MMMM Do YYYY, h:mm:ss a');
        article.body = textFormatConvertor(article.body, { format: 'html' });
        return article;
    }

    static async getArticles({ offset, limit, articleId }) {
        offset = offset ? +offset : 0;
        limit = limit ? +limit : 5;
        const articles = await this.findAll({ where: { articleId }, offset, limit });
        const sanitized = [];
        articles.forEach((article) => {
            sanitized.push(article.generateSanitizedArticle());
        });
        return sanitized;
    }
}

Article.init({
    articleId: {
        type: DataTypes.STRING(40),
        defaultValue: () => nanoid(idLength),
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    title: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
        defaultValue: "",
    },
    body: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
        defaultValue: "",
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    publishedAt: {
        type: DataTypes.DATE,
    }
}, {
    sequelize,
    modelName: "articles",
});

// Article Relations with other Models
User.hasMany(Article, {
    foreignKey: {
        name: "userId"
    }
});
Article.belongsTo(User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "userId"
    }
});

// Exporting Article Model
module.exports = Article;



