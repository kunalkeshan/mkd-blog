const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.cookies.authToken;
    if(!token) return res.redirect("/");
    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
        if(error) return res.redirect("/");
        delete decodedToken.hashedPassword;
        req.user = decodedToken;
        return next();
    }) 
}

const redirectToAuth = (req, res, next) => {
    const token = req.cookies.authToken;
    if(!token) return next();
    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
        if(error) return next(error);
        delete decodedToken.hashedPassword;
        req.user = decodedToken;
        console.log(decodedToken)
        return res.redirect("/home");
    })
}

module.exports = {
    auth,
    redirectToAuth,
};