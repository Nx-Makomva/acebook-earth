
import '../../assets/styles/FeedPage.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getFeed } from "../../services/posts";
import Post from "../../components/Post";
import Button from "../../components/Button";


export function FeedPage({ refreshTrigger }) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const userId = localStorage.getItem("userId");
    setUser(userId)
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
   
  }, [navigate, refreshTrigger]);

    }
    setConfirmed(!confirmed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
    return;
  }
  const likedByCurrentUser = (userId, post) =>{
    return post.likes.includes(userId)
  }

//   };

  return (
    <>
      <h2>Posts</h2>

      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post post={post} key={post._id} isLiked={likedByCurrentUser(user, post)} />
        ))}
      </div>
    </>
  );
  
}

