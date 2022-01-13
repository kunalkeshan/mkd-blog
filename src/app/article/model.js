"use strict";

const {nanoid} = require("nanoid");
const {marked} = require("marked");
const turndown = require("turndown");
const { sequelize, Sequelize: { DataTypes, Model } } = require("../../helper/database");
const {  secrets: { idLength } } = require("../../helper/config");
const User = require("../user/model");

const htmlToMkd = new turndown({headingStyle: "atx"});

// Article Model inherited from Sequelize Model
class Article extends Model {

    //Instance Functions

    returnBodyToMarkdown(){
        const markdown = htmlToMkd.turndown(this.body);
        return markdown;
    }

    returnBodyToHtml(){
        const html = marked(this.body);
        return html;
    }

    convertBodyToHTML(){
        this.body = marked(this.body);
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


module.exports = Article;



