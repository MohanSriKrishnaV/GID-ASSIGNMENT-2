const mongoose = require("mongoose");
async function conn() {
    await mongoose.connect('mongodb://127.0.0.1/gidasgn2');
}
module.exports = conn;