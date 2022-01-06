const { renderAppPage } = require("../helper/middleware/appFunctions");

/* ====================== 
    UNAUTHENTICATED CONTROLLERS
   ====================== */

exports.toIndex = (req, res) => {
    // res.status(200).render("index");
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
    res.status(200).render("home");
}