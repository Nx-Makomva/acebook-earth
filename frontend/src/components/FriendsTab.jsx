import { Users, UserCheck, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFriends } from "../services/friends";

// import img1 from "../assets/images/pic-1.webp";
// import img2 from "../assets/images/pic-2.webp";
// import img3 from "../assets/images/pic-3.jpeg";
// import img4 from "../assets/images/pic-4.webp";
// import img5 from "../assets/images/pic-5.jpeg";
// import img6 from "../assets/images/pic-6.webp";
// import img7 from "../assets/images/pic-7.webp";

export function FriendsTab({isOwnProfile = false, profileId}) {
  
  const [friends, setFriends] = useState([]);

  // const defaultImages = [img1, img2, img3, img4, img5, img6, img7]
  // const profilePic = defaultImages[Math.floor(Math.random() * defaultImages.length)]

  useEffect(() => {
    if (!profileId) return;
    
    getAllFriends(profileId)
      .then((data) => {
        const friends = data.friends
        console.log("friend data???", friends)
        setFriends(friends)
      })
      .catch((error) => {
        console.error("Error fetching friends", error)
      });
  }, [profileId])


  
  if (!friends || friends.length === 0) {
    return (
      <div className="friends-list-container">
        <div className="friends-empty-state">
          <Users className="empty-icon" />
          <h3>No friends yet</h3>
          <p>
            {isOwnProfile 
              ? "No friends gang? Might be time to touch some grass." 
              : "This user is sad and lonely or a bot 🤷."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="friends-list-container">
      <div className="friends-header">
        <div className="friends-title">
          <Users className="friends-icon" />
          <span>Friends ({friends.length})</span>
        </div>
      </div>
      
      <div className="friends-grid">
      
        {friends.map((friend) => (
          <div key={friend._id} className="friend-card">
            <div className="friend-avatar-container">
              <img
                src={friend.avatar || <UserCheck /> } ///// how to render icon?
                alt={`${friend.name}'s avatar`}
                className="friend-avatar"
              />
              <div className="friend-status-indicator"></div>
            </div>
            
            <Link to={`/profile/${friend._id}`} className="friend-info">
              <h4 className="friend-name">{friend.name}</h4>
              <p className="friend-status">{friend.status || "Status pending 🥱"}</p>
            </Link>

            
            <div className="friend-actions">
              <button
                className="friend-action-btn"
                onClick={() => "Okay eager beaver! The dev team is working on it..."}
                title="Send message"
              >
                <MessageCircle className="action-icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}