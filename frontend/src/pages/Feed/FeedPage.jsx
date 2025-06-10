
import './FeedPage.css';
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getFeed } from "../../services/posts";
import Post from "../../components/Post";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFeed = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
  }
  setLoading(true);
  getFeed(userId, token)
    .then((data) => {
    // check if data.posts references correct data
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
  }, [navigate]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);


return (
  <>
    <h2 className="feed-title">My Feed</h2>
    <div className="feed" role="feed">
      {loading ? (
        <p className='loading-feed'>Loading feed...</p>
      ) : posts.length === 0 ? (
        <div className='empty-feed'>
          Youcould use some friends! Your feed is empty.
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
