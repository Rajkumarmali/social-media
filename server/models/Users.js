const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    pic: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg"
    },
    followers: [{ type: ObjectId, ref: "Users " }],
    following: [{ type: ObjectId, ref: "Users " }],
})

const Users = mongoose.model("Users", userSchema);
module.exports = Users;