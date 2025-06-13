import "../../assets/styles/FeedPage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFeed, createPost } from "../../services/posts";
import Post from "../../components/Post";
import PostForm from "../../components/PostForm";

export function FeedPage({ refreshTrigger }) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setUser(userId);
    
    if (!token) {
      navigate("/login");
      return;
    }

    getFeed(userId, token)
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });
  }, [navigate, refreshTrigger, token]);

  const handleCreatePost = async (formData) => {
      const newPost = await createPost(formData, token);
      setPosts([newPost, ...posts]); // Add new post at the beginning
    }
 

  const likedByCurrentUser = (userId, post) => {
    return post.likes.includes(userId);
  };

  return (
    <>
      <h2>Posts</h2> 
      {/* Posts to render in order from most recent to oldest */}
      
      {/* Add the PostForm at the top */}
      <PostForm onSubmit={handleCreatePost} token={token} />
      
      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post
            post={post}
            key={post._id}
            isLiked={likedByCurrentUser(user, post)}
          />
        ))}
      </div>
    </>
  );
}