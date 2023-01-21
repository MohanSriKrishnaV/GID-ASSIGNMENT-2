const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
const { body, validationResult } = require('express-validator');
const secret = "10xacademy";

const User = require("./models/user");
const Post = require("./models/post");
const postroutes = require("./routes/post");

const bcrypt = require('bcrypt');

const loginroutes = require("./routes/login");
app.use("/", loginroutes);
const conn = require("./connections/connection");
conn();




//Home


app.get("/", (req, res) => {
    res.send("ok");
})



///////register
app.post("/register", body("name").isAlpha(), body("email").isEmail(), body("password").isLength({ min: 3, max: 8 }), async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const { name, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({
                status: "failed",
                message: "user already exists"
            })
        }

        bcrypt.hash(password, 10, async function (err, hash) {
            // Store hash in your password DB.
            if (err) {
                return res.status(400).json({
                    status: "failed",
                    msg: err.message
                })
            }
            const data = await User.create({ name, email, password: hash });
            res.status(200).json({
                status: "success",
                data
            });

        })
    } catch (e) {
        return res.status(400).json({
            status: "failed",
            msg: "registration unsuccessfull"
        })

    }
})



////////login

app.post("/login", body("email").isEmail(), async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const { name, email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({
                status: "failed",
                message: "user unknown/not registered"
            })
        }

        bcrypt.compare(password, user.password, function (err, result) {
            // result == true

            if (err) {
                return res.status(400).json({
                    status: "failed",
                    msg: e.message
                })
            }
            if (result) {
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: user._id
                }, secret);
                return res.status(200).json({
                    status: "success",
                    msg: "login succesfull",
                    token
                })
            }
            else {
                return res.status(400).json({
                    status: "failed",
                    msg: "password not correct"
                })

            }
        })


    } catch (e) {
        return res.status(400).json({
            status: "failed",
            msg: "login unsuccesssfull"
        })
    }


})








//////////posts




app.use("/posts", (req, res, next) => {

    const token = req.headers.authorization;
    if (token) {

        jwt.verify(token, secret, function (err, decoded) {

            if (err) {
                return res.status(400).json({
                    status: "failed",
                    msg: "session expired"
                })
            }
            req.user = decoded.data;
            next();
        });

    }
    else {
        return res.status(400).json({
            status: "failed",
            msg: "user not authenticated"
        })
    }

})

app.use("", postroutes);





app.listen(3000, () => {
    console.log("server is running");
});