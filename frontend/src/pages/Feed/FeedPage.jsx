
import './FeedPage.css';
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getFeed } from "../../services/posts";
import Post from "../../components/Post";
import PostForm from '../../components/PostForm.jsx'

export function FeedPage({ refreshTrigger }) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
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

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     const userId = localStorage.getItem("userId");
//     setUser(userId);
//     const loggedIn = token !== null;
//     if (loggedIn) {
//       getFeed(userId, token)
//         .then((data) => {
//           setPosts(data);
//           console.log("DATA FROM GETFEED:", data);
//         })
//         .catch((err) => {
//           console.error(err);
//           navigate("/login");
//         });
//     }
//   }, [navigate, refreshTrigger]);

//   const likedByCurrentUser = (userId, post) => {
//     return post.likes.includes(userId);
//   };

//   return (
//     <>
//       <h2>Posts</h2>

//       <div className="feed" role="feed">
//         {posts.map((post) => (

          <Post
            post={post}
            key={post._id}
            isLiked={likedByCurrentUser(user, post)}
          />
        ))
        )}
    </div>
  </>
);

}

