import { Users, UserCheck, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFriends } from "../services/friends";

export function FriendsTab({isOwnProfile = false, profileId}) {
  
  const [friends, setFriends] = useState([]);

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
      

      {/* Profile picture is now just called image */}
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