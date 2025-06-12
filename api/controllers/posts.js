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
}

}
async function getPostsByFriend(friendId) {
  const posts = await Post.find({userId: friendId});
  return posts;
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

// async function createPost(req, res) {
//   try {
//     // Validate required fields
//     if (req.body.content.trim().length === 0 && !req.body.image) {
//       return res.status(400).json({ message: "Content or image required" });
//     }
    
//     const post = new Post(req.body);
//     await post.save(); // Add await here
    
//     const newToken = generateToken(req.user_id);
//     res.status(201).json({ message: "Post created", token: newToken });
//   } catch (error) {
//     res.status(500).json({ message: "It's not you, it's me", error });
//   }
// }

async function createPost(req, res) {
  try {
    const { content } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!content && !image) {
      return res.status(400).json({ message: 'Content or image required'});
    }
    const post = new Post({
      content,
      image,
      createdAt: new Date()
    });

    await post.save();

    const newToken = generateToken(req.user_id);
    res.status(201).json({ message: 'Post created', post, token: newToken});
  } catch (error) {
    console.error('Error in createPost:', error);
    res.status(500).json({ message: "It's not you, it's me", error});
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



const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  getPostById: getPostById,
  getFeed: getFeed,
  editPost: editPost,
  deletePost: deletePost,
};

module.exports = PostsController;
