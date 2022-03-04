/**
 * Article Model
 */

"use strict";

// Dependencies
const moment = require('moment');
const { nanoid } = require("nanoid");
const { marked } = require("marked");
const turndown = require("turndown");
const { sequelize, Sequelize: { DataTypes, Model } } = require("../../helper/database");
const { secrets: { idLength } } = require("../../helper/config");
const User = require("../user/model");

const htmlToMkd = new turndown({ headingStyle: "atx" });

// Article Model inherited from Sequelize Model
class Article extends Model {

    //Instance Functions

    returnBodyToMarkdown() {
        const markdown = htmlToMkd.turndown(this.body);
        return markdown;
    }

    returnBodyToHtml() {
        const html = marked(this.body);
        return html;
    }

    convertBodyToHTML() {
        this.body = marked(this.body);
    }

    // get sanitized user, delete password and date in readable format
    generateSanitizedArticle() {
        const article = this.toJSON();
        article.publishedAt = moment(article.publishedAt).format('MMMM Do YYYY, h:mm:ss a');
        article.createdAt = moment(article.createdAt).format('MMMM Do YYYY, h:mm:ss a');
        article.updatedAt = moment(article.updatedAt).format('MMMM Do YYYY, h:mm:ss a');
        return article;
    }

    static async getArticles({ offset, limit }) {
        offset = offset ? +offset : 0;
		limit = limit ? +limit : 5;
        const articles = await this.findAll({ offset, limit });
        const sanitized = [];
        articles.forEach((article) => {
            sanitized.push(article.generateSanitizedArticle());
        });
        return articles;
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



