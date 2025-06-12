const fs = require ("fs");
const path = require("path");
const imageSchema = require("./imageSchema");
const commentSchema = require("./commentSchema");

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  content: {type: String, required: true},
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    default: [],
  }],
  comments: [commentSchema],
}, { timestamps: true });

const imagePath = path.join(__dirname, "..", "..", "pictures", "puppies.jpeg");
const imageData = fs.readFileSync(imagePath);
const Post = mongoose.model("Post", PostSchema);

const dateTimeString = new Date().toLocaleString("en-GB");

module.exports = Post;
