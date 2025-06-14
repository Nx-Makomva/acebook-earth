
import './FeedPage.css';
import { useState, useEffect, useCallback } from "react";
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
        console.log("FROM POST ppp:", data)
        setPosts(data);
      })
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });
  }, [navigate, refreshTrigger, token]);

  const handleCreatePost = async (formData) => {
    try {
      const newPost = await createPost(formData, token);
      setPosts([newPost, ...posts]);
    } catch (err) {
      throw err;
    }
  };

  const likedByCurrentUser = (userId, post) => {
    console.log(post);
    return post.likes.includes(userId);
  };

  return (
    <>
      <h2>Posts</h2>
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