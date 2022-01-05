const {nanoid} = require("nanoid");
const { sequelize, Sequelize: { DataTypes, Model } } = require("../../helper/database");
const {  secrets: { idLength } } = require("../../helper/config");
const User = require("../user/model")

class Article extends Model {

    //Instance Functions

}

Article.init({
    articleId: {
        type: DataTypes.STRING(40),
        allowNull: false,
        defaultValue: nanoid(idLength),
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
    isPublised: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    publishedAt: {
        type: DataTypes.DATE,
    }
}, {
    sequelize,
    modelName: "test_articles"
});

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



