import './FeedPage.css';
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getFeed } from "../../services/posts";
import Post from "../../components/Post";
import PostForm from '../../components/PostForm.jsx'

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    const token = localStorage.getItem("token");
// we may need to pass token to callback function bellow
  const fetchFeed = useCallback(() => {
    if (!token) {
      navigate("/login");
      return;
  }
  setLoading(true);
  getFeed(token)
    .then((data) => {
      const sortedPosts = [...data.posts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    setPosts(sortedPosts);
    localStorage.setItem('token', data.token);
  })

    .catch((err) => {
      console.error(err);
      navigate('/login');
    })
    .finally(() => setLoading(false));
  }, [navigate, token]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

return (
  <>
    <h2 className="feed-title">My Feed</h2>

    <PostForm token={token} onPostCreated={fetchFeed} />

    <div className="feed" role="feed">
      {loading ? (
        <p className='loading-feed'>Loading feed...</p>
      ) : posts.length === 0 ? (
        <div className='empty-feed'>
          You could use some friends! Your feed is empty.
          </div>
      ) : (
        posts.map((post) => (
          <Post
          post={post}
          key={post._id}
          onPostUpdate={fetchFeed}
          />
        ))
        )}
    </div>
  </>
);

}