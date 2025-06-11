const fs = require ("fs");
const path = require("path");
const imageSchema = require("./imageSchema");
const commentSchema = require("./commentSchema");

const mongoose = require("mongoose");

// A Schema defines the "shape" of entries in a collection. This is similar to
// defining the columns of an SQL Database.
const PostSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  content: {type: String, required: true},
  likes: {type: Number, default: 0},
  image: [imageSchema],
  comments: [commentSchema],
}, { timestamps: true });

const imagePath = path.join(__dirname, "..", "..", "pictures", "puppies.jpeg");
const imageData = fs.readFileSync(imagePath);

// We use the Schema to create the Post model. Models are classes which we can
// use to construct entries in our Database.
const Post = mongoose.model("Post", PostSchema);

// These lines will create a test post every time the server starts.
// You can delete this once you are creating your own posts.
const dateTimeString = new Date().toLocaleString("en-GB");
// new Post({ content: `Test message, created at ${dateTimeString}`, 
//   //issue how we're calling the below to generate the image
//   image: [{ 
//     name: "puppies.jpeg",
//     image: {
//       data: imageData, 
//       contentType: "image/jpeg"
//     }
//   }]
// }).save();

module.exports = Post;
