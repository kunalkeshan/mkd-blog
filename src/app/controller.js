const { renderAppPage } = require("../helper/middleware/appFunctions");
const Article = require("./article/model");

/* ====================== 
    UNAUTHENTICATED CONTROLLERS
   ====================== */

exports.toIndex = (req, res) => {
    // console.log(`${req.protocol}://${req.hostname}${req.originalUrl}`);
    const token = req.signedCookies.authToken;
    if(token) return res.redirect("/home");
    renderAppPage({res, renderTo: "index", options: {
        page: {
            title: "Markdown Blog",
            link: "index"
        }
    }});
}

exports.redirectToIndex = (req, res) => {
    res.redirect("/");
}

/* ====================== 
    AUTHENTICATED CONTROLLERS
   ====================== */

exports.toHome = (req, res) => {

    // TODO: API Call to get latest posts and send them to views to render

    renderAppPage({res, renderTo: "home", options: {
        page: {
            title: "Home | Mkd Blog",
            link: "home"
        }
    }});
}