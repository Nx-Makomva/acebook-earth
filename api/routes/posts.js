const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload');

const PostsController = require("../controllers/posts");

router.get("/", PostsController.getAllPosts);
router.post("/",upload.single('image'), PostsController.createPost);
router.get("/:postId", PostsController.getPostById);
router.patch("/:postId",upload.single('image'), PostsController.editPost);
router.get('/feed/:userId', PostsController.getFeed);
router.delete('/:postId', PostsController.deletePost);

module.exports = router;
