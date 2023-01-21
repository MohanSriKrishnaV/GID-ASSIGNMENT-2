const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const user = require("../models/user");
const conn = require("../connections/connection");
const post = require("../models/post");
const router = express.Router();
router.use(bodyParser.json());






router.post("/posts", async (req, res) => {
    try {

        const blog = await post.create({
            title: req.body.title,
            body: req.body.body,
            image: req.body.image,
            user: req.user
        });
        res.status(200).json({
            status: "success", blog
        })
    }
    catch (e) {
        res.status(400).json({
            status: "failed"
        })
    }
})

router.get("/posts", async (req, res) => {
    try {
        const blogs = await post.find();
        res.json({
            status: "succes", blogs
        })
    } catch (e) {

        res.status(400).json({
            status: "failed",
            message: e.message
        })
    }
})

router.put("/posts/:postId", async (req, res) => {
    try {
        const id = req.params.postId;

        // if (req.user ===) {

        // }
        const data = await post.find({ _id: id });


        if (data[0].user === req.user) {
            console.log("yes");
            const changed = await post.updateOne({ _id: id }, req.body);
            res.status(200).json({
                status: "success",
                data: changed
            })
        }

        else {
            res.status(400).json({
                status: "failed",
                msg: "not valid user for this post"
            })
        }

    } catch (e) {
        res.status(400).json({
            status: "failed"
        })
    }

})




router.delete("/posts/:postId", async (req, res) => {
    try {
        const id = req.params.postId;
        const data = await post.find({ _id: id });

        if (data[0].user === req.user) {
            const deleted = await post.deleteOne({ _id: id });
            res.status(200).json({
                status: "success",
                data: "deleted"
            })
        }
        else {
            res.status(400).json({
                status: "failed",
                msg: "not valid user for this post"
            })
        }

    } catch (e) {
        res.status(400).json({
            status: "failed"
        })
    }
})



module.exports = router;