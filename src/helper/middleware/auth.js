const jwt = require("jsonwebtoken");
const User = require("../../app/user/model");
const {  secrets: { jwtSecret } } = require("../config")

const authenticate = async (req, res, next) => {
    const token = req.cookies.authToken;
    if(!token) return res.redirect("/");
    jwt.verify(token, jwtSecret, async (error, decoded) => {
        try {
            const user = await User.findByPk({userId: decoded.userId});
            if(!user) throw new Error("Authorize session by logging in or signing up");
            delete user.hashedPassword;
            req.token = token;
            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            res.send(401).json({message: error.message});
        }
    });
}

module.exports = authenticate;