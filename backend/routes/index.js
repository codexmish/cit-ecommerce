const express = require("express")
const route = express.Router()
const authRoute = require("./authRoute")

route.get("/", (req, res)=>{
    res.status(200).send("Healthy")
})


route.use("/user", authRoute)


module.exports = route