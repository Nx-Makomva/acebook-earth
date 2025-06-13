const express = require("express");
const multer = require('multer');
const router = express.Router();

const PostsController = require("../controllers/posts");

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Routes that need JSON parsing
router.get("/", PostsController.getAllPosts);
router.get("/:postId", PostsController.getPostById);
router.get('/feed/:userId', PostsController.getFeed);
router.get('/:postId/comments', PostsController.getComments);

// Routes that need file uploads
router.post("/", upload.single('image'), PostsController.createPost);
router.patch("/:postId", upload.single('image'), PostsController.editPost);

// Other routes (no file upload)
router.delete('/:postId', PostsController.deletePost);
router.post('/:postId/comments', express.json(), PostsController.addComment);
router.delete('/:postId/comments/:commentId', PostsController.deleteComment);
router.post('/:postId/like', express.json(), PostsController.toggleLike);

module.exports = router;