"use strict";

const jwt = require("jsonwebtoken");
const User = require("../../app/user/model");
const {  secrets: { jwtSecret } } = require("../config");

/* 
* @desc Middleware that authenticates if the user is Logged In
*/
const authenticate = (req, res, next) => {
    try {
        const token = req.signedCookies.authToken;
        if(!token) throw new Error("No Auth Token");
        jwt.verify(token, jwtSecret, async (err, decoded) => {
            if(err) throw err;
            const user = await User.findByPk(decoded.userId);
            if(!user) throw new Error("Unable to find user.");
            req.token = token;
            req.user = user.toJSON();
            return next();
        });
    } catch (error) {
        console.log(error);
        return res.status(401).clearCookie("authToken").redirect("/");
    }
}

module.exports = authenticate;