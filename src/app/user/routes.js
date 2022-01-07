const Router = require("express").Router();
const userController = require("./controller");
const authenticate = require("../../helper/middleware/auth");

/* ====================== 
    UNAUTHENTICATED ROUTES
   ====================== */

Router.get("/api/isEmailUnique", userController.isEmailUnique);

Router.get("/api/isUsernameUnique/:username", userController.isUsernameUnique);

Router.post("/api/register", userController.registerUser);

Router.post("/api/login", userController.loginUser);

Router.get("/api/user/id", userController.getUserById);

Router.get("/api/user/username", userController.getUserByUsername);

Router.get("/author/:username", userController.toUserProfile);

/* ====================== 
    AUTHENTICATED ROUTES
   ====================== */

Router.post("/api/updateBio", authenticate, userController.updateBio);

Router.post("/api/updateLinks", authenticate, userController.updateLinks);

Router.post("/api/updateUserDetails", authenticate, userController.updateUserDetails);

Router.post("/api/updateUserPassword", authenticate, userController.updateUserPassword);

Router.post("/api/logout", authenticate, userController.logoutUser);

Router.post("/user/:id/edit", authenticate, userController.toUserEdit);

module.exports = Router;

