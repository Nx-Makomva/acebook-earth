import "../../assets/styles/ProfilePage.css";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getById } from "../../services/users";
import {
  UserPlus,
  MapPin,
  Calendar,
  MessageCircle,
  Settings,
  Edit,
  User,
  Users,
  Activity,
} from "lucide-react";
import { FriendsList } from "../../components/FriendsList";

function decodeToken(token) {
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const decodedPayload = atob(payloadBase64);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export function ProfilePage({ addFriend }) {
  const { id } = useParams(); //id of profile (not necessarily logged in user)
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(); // The profile being rendered
  const [notFound, setNotFound] = useState(false);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [friendAddedSuccessfully, setFriendAddedSuccessfully] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
	const [friendCount, setFriendCount] = useState(0);
  const [profileName, setProfileName] = useState(""); // Used simply to format the name of the profile owner
  const [activeTab, setActiveTab] = useState("about"); // about, friends or activity tab

  const token = localStorage.getItem("token");
  const decoded = decodeToken(token);
  const authenticatedUserId = decoded?.sub; // id of person who is logged in

  useEffect(() => {
    if (!token || !authenticatedUserId) {
      navigate("/login");
      return;
    }

    getById(id)
      .then((data) => {
        const user = data.user;
        setUserProfile(user);
        const userName = user.name.charAt(0).toUpperCase() + user.name.slice(1);
        setProfileName(userName);
				setFriendCount(user.friends.length)
				// console.log("The user profiles matessssss", userProfile.friends)
      })
      .catch((err) => {
        console.error(err);
        setNotFound(true);
      });
  }, [id, navigate, token, authenticatedUserId]);

	// CHANGE ADD FRIEND FUNCTION TO BE BI-DIRECTIONAL

  const checkFrienshipStatus = async () => {
    try {
      const data = await getById(authenticatedUserId);
      const userViewingProfile = data.user;
      const friendsList = userViewingProfile.friends;
			console.log("this is friends list broooo", friendsList)

      if (friendsList.includes(id)) {
        setIsFriend(true);
      }
      console.log("This is my friends list (the person viewing)", friendsList);
    } catch (error) {
      console.error("Failed to check friendship status", error);
    }
  };

  const HandleAddfriend = async (id) => {
    console.log("This is friendId start func:", id);
    setIsAddingFriend(true);
    try {
      await addFriend(id);
      console.log("adding friend is:", isAddingFriend);
    } catch (error) {
      console.error("Could not add friend");
    } finally {
      setIsAddingFriend(false);
      setFriendAddedSuccessfully(true);
      console.log("This is friendId end func:", id);
      console.log("adding friend is:", isAddingFriend);
    }
  };

  useEffect(() => {
    checkFrienshipStatus();
  }, [friendAddedSuccessfully]);

  if (notFound) {
    return (
      <div className="profile-page-container">
        <div className="error-container">
          <h1>404 - Profile Not Found</h1>
          <p>The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="profile-page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = id === authenticatedUserId;

  return (
    <div className="profile-page-container">
      <div className="profile-content">
        <div className="profile-hero">
          <div className="profile-cover"></div>
          <div className="profile-main">
            <div className="profile-avatar-container">
              <img
                src={userProfile.profilePicture || "https://i0.wp.com/eos.org/wp-content/uploads/2025/02/everest-peak.jpg?fit=1200%2C675&ssl=1"}
                alt="profile picture"
                className="profile-avatar"
              />
              <div className="avatar-status-indicator"></div>
            </div>

            <div className="profile-header-info">
              <h1 className="profile-name">{profileName}</h1>
              {isFriend ? "Besties 4 lyf-y" : "Stranger Danger 🫢"}
              <p className="profile-status">{userProfile.status}</p>

              <div className="profile-meta">
                <div className="meta-item">
                  <MapPin className="meta-icon" />
                  <span>{userProfile.location}</span>
                </div>
                <div className="meta-item">
                  <Calendar className="meta-icon" />
                  <span>
                    {Math.floor(
                      new Date(
                        Date.now() - new Date(userProfile.dob).getTime()
                      ).getUTCFullYear() - 1970
                    )}{" "}
                    years old
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              {isOwnProfile ? (
                <>
                  <button className="action-btn primary">
                    <Edit className="btn-icon" />
                    Edit Profile
                  </button>
                  <button className="action-btn secondary">
                    <Settings className="btn-icon" />
                    Settings
                  </button>
                </>
              ) : (
                <>
                  {isFriend ? (
                    <p>We are already friends! No backsies 😤</p>
                  ) : (
                    <button
                      className={`action-btn primary ${
                        isAddingFriend ? "loading" : ""
                      }`}
                      onClick={() => HandleAddfriend(id)}
                      disabled={isAddingFriend}
                    >
                      <UserPlus className="btn-icon" />
                      {isAddingFriend ? "Adding..." : "Add Friend"}
                    </button>
                  )}
                  <button className="action-btn secondary">
                    <MessageCircle className="btn-icon" />
                    Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation between sections */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            <User className="tab-icon" />
            About
          </button>
          <button
            className={`tab-btn ${activeTab === "friends" ? "active" : ""}`}
            onClick={() => setActiveTab("friends")}
          >
            <Users className="tab-icon" />
            Friends
          </button>
          <button
            className={`tab-btn ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            <Activity className="tab-icon" />
            Activity
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "about" && (
            <div className="profile-grid">
              <div className="profile-card about-card">
                <div className="card-header">
                  <h3>About {profileName}</h3>
                </div>
                <div className="card-content">
                  <div className="about-section">
                    <h4>Bio</h4>
                    <p className="bio-text">
                      {userProfile.bio ||
                        `Is ${profileName} aware that you're obsessed with them and desperately want to read their bio?`}
                    </p>
                  </div>
                  <div className="about-section">
                    <h4>Status</h4>
                    <p className="status-text">
                      {userProfile.status ||
                        `When ${profileName} bothers to write something, it will show up here`}
                    </p>
                  </div>
                  <div className="about-section">
                    <h4>Location</h4>
                    <p className="location-text">
                      {userProfile.location || "Alright stalker..."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="profile-card stats-card">
                <div className="card-header">
                  <h3>Popularity Contest 🤷</h3>
                </div>
                <div className="card-content">
                  <div className="stats-grid">
                    <div className="stat-item">
                       <div className="stat-number">{friendCount}</div> {/* This needs to refresh when profile changes */}
                      <div className="stat-label">Friends</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">127</div>
                      <div className="stat-label">Posts</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">1.2k</div>
                      <div className="stat-label">Likes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "friends" && (
            <div className="friends-tab-content">
              <FriendsList
                isOwnProfile={isOwnProfile}
								profileId={id}
              />
            </div>
          )}

          {activeTab === "activity" && (
            <div className="profile-card activity-card">
              <div className="card-header">
                <h3>Recent Activity</h3>
              </div>
              <div className="card-content">
                <div className="activity-placeholder">
                  <p>Recent posts and activity will appear here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}