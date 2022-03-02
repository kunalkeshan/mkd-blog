/**
 * User Routes
 */

"use strict";

// Dependencies
const Router = require("express").Router();
const userController = require("./controller");
const {authenticate} = require("../../helper/middleware/auth");

/* ====================== 
    UNAUTHENTICATED ROUTES
   ====================== */

Router.get("/api/author/isEmailUnique", userController.isEmailUnique);

Router.get("/api/author/isUsernameUnique", userController.isUsernameUnique);

Router.post("/api/author/register", userController.registerUser);

Router.post("/api/author/login", userController.loginUser);

Router.get("/api/author/id", userController.getUserById);

Router.get("/api/author/username", userController.getUserByUsername);

// Page Render Routes

Router.get("/author/:username", userController.toUserProfile);

/* ====================== 
    AUTHENTICATED ROUTES
   ====================== */

Router.patch("/api/author/updateBio", authenticate, userController.updateBio);

Router.patch("/api/author/updateLinks", authenticate, userController.updateLinks);

Router.patch("/api/author/updateUserDetails", authenticate, userController.updateUserDetails);

Router.patch("/api/author/updatePassword", authenticate, userController.updateUserPassword);

Router.post("/api/author/logout", authenticate, userController.logoutUser);

Router.delete("/api/author/deleteUser", authenticate, userController.deleteUserAccount);

// Page Render Routes

Router.get("/author/:username/edit", authenticate, userController.toUserEdit);

module.exports = Router;

