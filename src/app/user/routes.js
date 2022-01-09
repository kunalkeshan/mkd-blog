const Router = require("express").Router();
const userController = require("./controller");
const authenticate = require("../../helper/middleware/auth");

/* ====================== 
    UNAUTHENTICATED ROUTES
   ====================== */

Router.get("/api/isEmailUnique", userController.isEmailUnique);

Router.get("/api/isUsernameUnique", userController.isUsernameUnique);

Router.post("/api/register", userController.registerUser);

Router.post("/api/login", userController.loginUser);

Router.get("/api/user/id", userController.getUserById);

Router.get("/api/user/username", userController.getUserByUsername);

Router.get("/author/:username", userController.toUserProfile);

/* ====================== 
    AUTHENTICATED ROUTES
   ====================== */

Router.patch("/api/updateBio", authenticate, userController.updateBio);

Router.patch("/api/updateLinks", authenticate, userController.updateLinks);

Router.patch("/api/updateUserDetails", authenticate, userController.updateUserDetails);

Router.patch("/api/updatePassword", authenticate, userController.updateUserPassword);

Router.post("/api/logout", authenticate, userController.logoutUser);

Router.delete("/api/deleteUser", authenticate, userController.deleteUserAccount);

Router.get("/author/:username/edit", authenticate, userController.toUserEdit);

module.exports = Router;

