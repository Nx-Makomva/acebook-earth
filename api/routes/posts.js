const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload');

const PostsController = require("../controllers/posts");

router.get("/", PostsController.getAllPosts);
router.post("/", PostsController.createPost);
router.get("/:postId", PostsController.getPostById);
router.patch("/:postId", PostsController.editPost);
router.get('/feed/:userId', PostsController.getFeed);
router.delete('/:postId', PostsController.deletePost);
router.post('/:postId/comments', PostsController.addComment);
router.get('/:postId/comments', PostsController.getComments);
router.delete('/:postId/comments/:commentId', PostsController.deleteComment);

module.exports = router;
