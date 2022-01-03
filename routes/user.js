const Router = require("express").Router();
const { database, sendQuery } = require("../database");
const { errorLogger } = require("../middleware/appFunctions");



Router.put("/bio/:userId", (req, res) => {
    const {bio} = req.body;
    // Query
    const setUserBio = `UPDATE user_details SET bio='${bio}' WHERE userId='${req.user.userId}';`;
});

Router.put("/links", (req, res) => {
    const {links} = req.body;
    // Query
    const setUserLinks = `UPDATE user_details SET links='${links}' WHERE userId='${req.user.userId}';`;
});

Router.patch("/info", (req, res) => {

})

Router.delete("/delete/", async (req, res) => {
    // Query
    const setDeleteUser =  `DELETE FROM user_details WHERE userId='${req.user.userId}';`

    try {
        
        const deleteUser = await sendQuery(setDeleteUser);
        if(deleteUser.affectedRows > 0){
            res.status(201).json({message: "Account Deleted Successfully!"})
        } else throw new Error("Error in deleting account!")

    } catch (error) {
        errorLogger("Delete User", error);
    }
});

module.exports = Router;