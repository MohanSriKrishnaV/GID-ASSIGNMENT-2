const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const user = require("../models/user");
const conn = require("../connections/connection");
const post = require("../models/post");
const router = express.Router();

router.post("/login", (req, res) => {
    res.send("login page")
})

router.get("/register", (req, res) => {
    res.send("register page");
})

module.exports = router;