// Importing Packages
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

// Initializing Express Application
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// Importing Router
const appRouter = require("./routes/routes");

app.use(appRouter);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    console.log(error)
    res.status(error.status || 500).render("serverError", {
        error: {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
        },
    });
})

const PORT = process.env.PORT;

app.listen(PORT, function(err){
    if(err) console.log(`Error in running server! Error: ${err}`);
    else console.log(`Server running at http://localhost:${PORT}`);
})