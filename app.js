// Importing Packages
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const { port, secrets: { cookieSecret } } = require("./src/helper/config");

// Importing App Router
const appRouter = require("./src/app");

// Initializing Express Application
const app = express();

app.disable("x-powered-by")

// Setting up Middleware's 
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(cookieSecret));
app.use(logger("tiny"));

// Using App Router
app.use("/", appRouter);

app.get("/", (req, res) => {
    res.status(200).send("Hi");
})

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
});

app.listen(port, (err) => {
    if(err) console.log(`Error in running server! Error: ${err}`);
    else console.log(`Server running at http://localhost:${port}`);
});
