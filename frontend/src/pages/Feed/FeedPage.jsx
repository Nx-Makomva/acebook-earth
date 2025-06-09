
import './FeedPage.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getFeed } from "../../services/posts";
import Post from "../../components/Post";
import LogoutButton from "../../components/LogoutButton";
// import { post } from '../../../../api/models/imageSchema';


export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    getFeed(token)
      .then((data) => {
        setPosts(data.posts);
        localStorage.setItem('token', data.token);
      })
      .catch((err) => {
        console.error(err);
        navigate('/login');
      });
  }, [navigate]);


return (
  <>
    <h2 className="feed-title">My Feed</h2>
    <div className="feed" role="feed">
      {posts.length === 0 ? (
        <div className="empty-feed">You could use some friends!Your feed is empty.</div>
      ) : (
        posts.map((post) => <Post post={post} key={post._id} />)
      )}
    </div>
    <LogoutButton />
  </>
);
}
