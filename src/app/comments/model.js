const {nanoid} = require("nanoid");
const { sequelize, Sequelize: { DataTypes, Model } } = require("../../helper/database");
const {  secrets: { idLength } } = require("../../helper/config");
const User = require("../user/model");
const Article = require("../article/model");

class Comment extends Model {

}

Comment.init({
    commentId: {
        type: DataTypes.STRING(40),
        primaryKey: true,
        defaultValue: nanoid(idLength),
    },
    articleId: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT("medium"),
        allowNull: false,
    }
}, {
    sequelize,
    modelName: "test_article_comments"
});


User.hasMany(Comment, {
    foreignKey: {
        name: "userId",
    },
});
Article.hasMany(Comment, {
    foreignKey: {
        name: "articleId",
    },
});
Comment.belongsTo(User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "userId",
    },
});
Comment.belongsTo(Article, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "articleId",
    }
});

module.exports = Comment;