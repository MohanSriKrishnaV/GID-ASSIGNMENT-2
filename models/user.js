const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, min: 2, max: 10 }
}, { timestamps: true });

const user = mongoose.model('users', UserSchema);

module.exports = user;

