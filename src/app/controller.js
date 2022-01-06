const { renderAppPage } = require("../helper/middleware/appFunctions");
const Article = require("./article/model");

/* ====================== 
    UNAUTHENTICATED CONTROLLERS
   ====================== */

exports.toIndex = (req, res) => {
    const token = req.cookies.authToken;
    if(token) return res.redirect("/home");
    renderAppPage({res: res, renderTo: "index", options: {
        page: {
            title: "Markdown Blog",
            link: "index"
        }
    }});
}

/* ====================== 
    AUTHENTICATED CONTROLLERS
   ====================== */

exports.toHome = (req, res) => {

    // TODO: API Call to get latest posts and send them to views to render

    renderAppPage({res: res, renderTo: "home", options: {
        page: {
            title: "Home | Mkd Blog",
            link: "home"
        }
    }});
}