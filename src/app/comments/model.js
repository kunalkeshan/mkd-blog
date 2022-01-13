const {nanoid} = require("nanoid");
const User = require("../user/model");
const Article = require("../article/model");
const { sequelize, Sequelize: { DataTypes, Model } } = require("../../helper/database");
const {  secrets: { idLength } } = require("../../helper/config");

// Comments Model inherited from Sequelize Model
class Comment extends Model {

}

Comment.init({
    commentId: {
        type: DataTypes.STRING(40),
        primaryKey: true,
        defaultValue: () => nanoid(idLength),
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
    modelName: "article_comments"
});

// Comment Relationship with other Models
User.hasMany(Comment, {
    foreignKey: {
        name: "userId",
    },
});

Article.hasMany(Comment, {
    foreignKey: {
        name: "articleId",
    }
})
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