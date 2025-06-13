const Post = require("../models/post");
const { generateToken } = require("../lib/token");
const User = require("../models/user");
const Image = require("../models/imageSchema");

async function getAllPosts(req, res) {
try
{  const posts = await Post.find();
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: posts, token: token });}
catch (error){
  res.status(500).json({message: "It's not you, it's me", error})
}
}

async function getPostById(req, res) {
try
{  const postId = req.params.postId;
  const post = await Post.findById(postId);

  if (!post){
    return res.status(404).json({message: 'Try again loser.'});
  }
  const token = generateToken(req.user_id);
  res.status(200).json({ post: post, token: token });}
  catch (error){
  res.status(500).json({message: "It's not you, it's me", error})
}};

async function getPostsByFriend(friendId) {
  const posts = await Post.find({ userId: friendId })
    .populate("images")
    .populate("userId", "name");

  return posts.map(post => ({
    ...post.toObject(),
    username: post.userId.name,
    images: post.images.map(img => ({
      ...img.toObject(),
      // Convert Buffer to Base64 string
      data: img.data ? img.data.toString('base64') : null
    }))
  }));
}

async function getFeed(req, res) {
  try {
    const userId = req.params.userId; 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found.'});
    }
    const friends = user.friends;

    // Get posts from all friends in parallel
    const postsArrays = await Promise.all(
      friends.map(friendId => getPostsByFriend(friendId))
    );

    // Flatten array of arrays into a single array of posts
    const allPosts = postsArrays.flat();
    console.log("DATA FROM GET FEED:", allPosts)
    const token = generateToken(userId);
    res.status(200).json({ posts: allPosts, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load feed", error });
  }
}


async function createPost(req, res) {
  console.log("WE'RE IN CREATE POST", req.body, req.file);
  try {
    const content = req.body.content || '';
    
    // Validate input
    if (!content.trim() && !req.file) {
      return res.status(400).json({ message: "Content or image required" });
    }

    // Create new post with initialized images array
    const newPost = new Post({
      content,
      userId: req.user_id,
      likes: [],
      images: [] // Initialize images array here
    });

    // Handle image if present
    let imageData = null;
    if (req.file) {
      const newImage = new Image({
        name: req.file.originalname,
        image: {
          data: req.file.buffer,
          contentType: req.file.mimetype
        }
      });
      
      await newImage.save();
      newPost.images.push(newImage._id);
      imageData = req.file.buffer.toString('base64');
    }

    await newPost.save();

    // Generate new token
    const newToken = generateToken(req.user_id);

    // Prepare response
    const response = {
      _id: newPost._id,
      content: newPost.content,
      userId: newPost.userId,
      likes: newPost.likes,
      createdAt: newPost.createdAt,
      message: "Post created", 
      token: newToken,
      images: newPost.images.map(imgId => ({
        _id: imgId,
        image: {
        ...(imageData && {
          name: req.file.originalname,
          contentType: req.file.mimetype,
          data: imageData
        })
    }}))
    };
    console.log("DATA STRUCTURE CREATE POST:", response)
    res.status(201).json(response);

  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({ 
      message: "Error creating post",
      error: error.message 
    });
  }
}

async function editPost(req, res) {
  try {
    const postId = req.params.postId;
    
    // First validate post exists and belongs to user
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.userId.toString() !== req.user_id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Prepare update object
    const update = {};
    if (req.body.content) update.content = req.body.content;
    
    // Handle image if present
    if (req.file) {
      const image = new Image({
        name: req.file.originalname,
        image: {
          data: req.file.buffer,
          contentType: req.file.mimetype
        }
      });
      await image.save();
      update.$push = { images: image._id };
    }

    // Perform update
    const updatedPost = await Post.findByIdAndUpdate(
      postId, 
      update,
      { new: true }
    ).populate('images');

    // Generate new token
    const newToken = generateToken(req.user_id);

    res.status(200).json({ 
      post: updatedPost, 
      token: newToken 
    });
  } catch (error) {
    console.error("Post edit error:", error);
    res.status(500).json({ 
      message: "Error updating post",
      error: error.message 
    });
  }
}

async function deletePost(req, res) {
  try
{  const postId = req.params.postId;
  const deletePost = await Post.findByIdAndDelete(postId);
  if (!deletePost){
    return res.status(404).json({message: 'Post not found.'});
  }
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: deletePost, token: token });}
  catch (error){
  res.status(500).json({message: "It's not you, it's me", error})
}
}

async function addComment(req, res) {
  console.log("ADD COMMENT has been triggered")
  try {
    const postId = req.params.postId;
    const { userId, comment } = req.body;
    console.log("LET'S CHECK THESE PARAMS:", postId, userId, comment);
    if (!comment) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const user = await User.findById(userId);
    console.log("USER:", user);
    const userName = user.name;
    console.log("USERNAME:", userName)
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { userName, comment } } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = generateToken(req.body.userId);
    res.status(201).json({ 
      message: "Comment added", 
      comments: updatedPost.comments,
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add comment", error });
  }
}

async function getComments(req, res) {
  try {
    console.log("get comments");
    const postId = req.params.postId;
    const post = await Post.findById(postId).select('comments');
    console.log(JSON.stringify(post));
    const comms = await Post.findById(postId);
    console.log(JSON.stringify(comms));
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = generateToken(req.user_id);
    res.status(200).json({ 
      comments: post.comments,
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get comments", error });
  }
}

async function deleteComment(req, res) {
  try {
    const { postId, commentId } = req.params;
    
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } }},
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = generateToken(req.user_id);
    res.status(200).json({ 
      message: "Comment deleted",
      comments: updatedPost.comments,
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete comment", error });
  }
}


async function toggleLike(req, res) {
  const userId = req.body.userId; 
  const { postId } = req.params;
  console.log("I AM USER ID FROM TOGGLE LIKE:", req.body)
  console.log("I AM POST ID FROM TOGGLE LIKE:", postId)
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: userId not found" });
  }
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    console.log("LIKES:", post)
    const alreadyLiked = post.likes.map(id => id.toString()).includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId); // remove like
    } else {
      post.likes.push(userId); // add like
    }

    await post.save();

    res.json({ 
      liked: !alreadyLiked,
      likesCount: post.likes.length 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  getPostById: getPostById,
  getFeed: getFeed,
  editPost: editPost,
  deletePost: deletePost,
  addComment: addComment,
  getComments: getComments,
  deleteComment: deleteComment,
  toggleLike: toggleLike,
};

module.exports = PostsController;
