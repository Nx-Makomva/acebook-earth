
import './FeedPage.css';
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getFeed } from "../../services/posts";
import Post from "../../components/Post";

// export function FeedPage() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const { userId } = useParams(); 

//   const fetchFeed = useCallback(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//   }
//   setLoading(true);
//   getFeed(userId, token)
//     .then((data) => {
//     // check if data.posts references correct data
//     console.log(data)
//       const sortedPosts = [...data].sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//     setPosts(sortedPosts);
//     localStorage.setItem('token', data.token);
//   })

//     .catch((err) => {
//       console.error(err);
//       navigate('/login');
//     })
//     .finally(() => setLoading(false));
//   }, [navigate]);

//   useEffect(() => {
//     fetchFeed();
//   }, [fetchFeed]);
export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const loggedIn = token !== null;
    if (loggedIn) {
      // change to getFeed method
      getFeed(userId, token)
        .then((data) => {
          setPosts(data);
          console.log("DATA FROM GETFEED:", data)
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
    // setLoading(true);
  }, [navigate]);
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  return (
    <>
      <h2>Posts</h2>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div>
    </>
  );
}