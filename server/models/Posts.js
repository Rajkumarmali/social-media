const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    body: {
        type: String,
        require: true,
    },
    photo: {
        type: String,
        require: true,
    },
    likes: [{ type: ObjectId, ref: "Users" }],
    comments: [
        {
            text: String,
            postedBy: { type: ObjectId, ref: "Users" }
        }],
    postedBy: {
        type: ObjectId,
        ref: "Users"
    }
}, { timestamps: true })
const Posts = mongoose.model("Posts", postSchema);
module.exports = Posts; 