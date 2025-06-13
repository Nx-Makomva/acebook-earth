const Post = require("../models/post");
const { generateToken } = require("../lib/token");
const User = require("../models/user")

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
  const posts = await Post.find({ userId: friendId }).populate('userId', 'name');
  
  return posts.map(post => ({
    ...post.toObject(),
    username: post.userId.name
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

    const token = generateToken(userId);
    res.status(200).json({ posts: allPosts, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load feed", error });
  }
}

// async function createPost(req, res) {
//   //we need an error handling
//   try
// {  const post = new Post(req.body);
//   post.save();

//   const newToken = generateToken(req.user_id);
//   res.status(201).json({ message: "Post created", token: newToken });}
//   catch (error){
//   res.status(500).json({message: "It's not you, it's me", error})
// }
// }

async function createPost(req, res) {
  try {
    // Validate required fields
    if (req.body.content.trim().length === 0 && !req.body.image) {
      return res.status(400).json({ message: "Content or image required" });
    }
    
    const post = new Post(req.body);
    await post.save(); // Add await here
    
    const newToken = generateToken(req.user_id);
    res.status(201).json({ message: "Post created", token: newToken });
  } catch (error) {
    res.status(500).json({ message: "It's not you, it's me", error });
  }
}

async function editPost(req, res) {
  try
{ const postId = req.params.postId;
  const updatedPost = await Post.findByIdAndUpdate(postId, req.body,{
    new: true
  });
  if (!updatedPost){
    return res.status(404).json({message: 'Post not found.'});
  }
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: updatedPost, token: token });}
  catch (error){
  res.status(500).json({message: "It's not you, it's me", error})
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
  getPostsByFriend: getPostsByFriend
};

module.exports = PostsController;
