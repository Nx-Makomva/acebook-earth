
import '../../assets/styles/FeedPage.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getFeed } from "../../services/posts";
import Post from "../../components/Post";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const loggedIn = token !== null;
    if (loggedIn) {
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