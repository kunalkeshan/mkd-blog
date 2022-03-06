/**
 * Article Model
 */

"use strict";

// Dependencies
const { sequelize, Sequelize: { DataTypes, Model, Op, col } } = require("../../helper/database");
const User = require("../user/model");
const moment = require('moment');
const { textFormatConvertor, nanoid } = require('../../helper/utils')
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

    /**
     * @description Get's Articles based on params provided, coverts date and body to display directly
     * @param {object} options Options to get Articles
     * @returns {Promise<array>} Array of Articles
     */
    static async getArticles({ offset, limit, articleId, userId }) {
        offset = offset ? +offset : 0;
        limit = limit ? +limit : 5;
        search = search ? search : false;

        const whereQuery = [];
        articleId ? whereQuery.push({ articleId }) : null;
        userId ? whereQuery.push({ userId }) : null;

        const where = {
            [Op.or]: whereQuery,
        };
        if (!articleId && !userId) delete where[Op.or]

        const articles = await this.findAll({
            where,
            offset, limit
        });

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
        allowNull: true,
    }
}, {
    sequelize,
    modelName: "articles",
    hooks: {
        beforeFind: (query) => {
            query.include = {
                model: User,
                required: true,
                attributes: ['userId', 'fullName', 'username', 'image']
            };
        }
    }
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



