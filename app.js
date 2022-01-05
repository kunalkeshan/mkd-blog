const express= require('express')
const app = express()
const { port } = require("./src/helper/config")

app.get("/", (req, res) => {
    res.send("Inialized");
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})