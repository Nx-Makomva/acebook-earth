
import '../../assets/styles/FeedPage.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getFeed } from "../../services/posts";
import Post from "../../components/Post";
// import LogoutButton from "../../components/LogoutButton"; // sure whether this is needed.
import Button from "../../components/Button"; // added


export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [confirmed, setConfirmed] = useState(false); // added
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
//new code added a little similar to the original one
    getPosts(token)
      .then((data) => {
        setPosts(data.posts);
        localStorage.setItem("token", data.token);
      })
      .catch((e) => {
        console.error(e);
        navigate("/login");
      });
    // const loggedIn = token !== null;
    // if (loggedIn) {
    //   getPosts(token)
    //     .then((data) => {
    //       setPosts(data.posts);
    //       localStorage.setItem("token", data.token);
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //       navigate("/login");
    //     });
    // }
  }, [navigate]);

  // const token = localStorage.getItem("token");
  // if (!token) {
  //   navigate("/login");
  //   return;
  // }

  //added code below from lines 37 to 44 - handleButtonClick
  const handleButtonClick = () => {
    if (confirmed) {
      alert("Post cancelled!");
    } else {
      alert("Post confirmed!");
    }
    setConfirmed(!confirmed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <>
      <h2>Posts</h2>
        {/* added below code: div class of my-4 */}
      <div className="my-4"> 
        <Button
          variant={confirmed ? "cancel" : "confirm"}
          onClick={handleButtonClick}
        >
          {confirmed ? "Cancel Post" : "Confirm Post"}
        </Button>
      </div>
      {/* added this code below and commented out the original logout button */}
      <div className="my-4">
        {/* <Button variant="cancel" onClick={() => {
          localStorage.removeItem("token");
          navigate("/login")
          }}
        >
          Log out
        </Button> */}
        {/* changed the above button to the below code */}

        <Button variant="cancel" onClick={handleLogout}>
          Log out
        </Button>
      </div>

      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div>
      {/* <LogoutButton /> */}
    </>
  );
  
}

