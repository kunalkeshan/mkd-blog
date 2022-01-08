const jwt = require("jsonwebtoken");
const User = require("../../app/user/model");
const {  secrets: { jwtSecret } } = require("../config")

const authenticate = (req, res, next) => {
    const token = req.cookies.authToken;
    if(!token) return res.redirect("/");
    jwt.verify(token, jwtSecret, async (err, decoded) => {
        try {
            if(err) throw new Error(err.message);
            const user = await User.findByPk({userId: decoded.userId});
            if(!user) throw new Error("Unable to find user.");
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