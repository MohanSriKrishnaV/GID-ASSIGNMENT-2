const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const PostSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, data: Buffer },
    user: { type: ObjectId, ref: "User" }

});

const post = mongoose.model('PostSchema', PostSchema);
module.exports = post;
