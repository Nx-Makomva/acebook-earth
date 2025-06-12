import "../../assets/styles/ProfilePage.css";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getById, updateById, getUserPosts } from "../../services/users";
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
import toast from "react-hot-toast";
import { FriendsTab } from "../../components/FriendsTab";
import { ActivityTab } from "../../components/ActivityTab";
import UsersForm from "../../components/UsersForm";
import Button from "../../components/Button";

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

  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);

  // Edit profile details functionality
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    bio: "",
    location: "",
    status: "",
  });

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
        setFriendCount(user.friends.length);
        
        setFormData({
          name: user.name || "",
          dob: user.dob || "",
          bio: user.bio || "",
          location: user.location || "",
          status: user.status || "",
        });
      })
      .catch((err) => {
        console.error(err);
        setNotFound(true);
      });
  }, [id, navigate, token, authenticatedUserId]);

  useEffect(() => {
    getUserPosts(id)
      .then((data) => {
        const posts = data.posts
        const postCount = data.postCount
        setPosts(posts)
        setPostCount(postCount)
        console.log("These are the posts", posts)
        console.log("These are the NUMBER of posts", postCount)
      })
      .catch((error) => {
        console.error(error);
      })

  }, [id])

  const checkFrienshipStatus = async () => {
    try {
      const data = await getById(authenticatedUserId);
      const userViewingProfile = data.user;
      const listOfFriends = userViewingProfile.friends;
      console.log("this is friends list broooo", listOfFriends); // REMOVE

      if (listOfFriends.includes(id)) {
        setIsFriend(true);
      }
      console.log("This is my friends list (the person viewing)", listOfFriends); // REMOVE
    } catch (error) {
      console.error("Failed to check friendship status", error);
    }
  };

  const HandleAddfriend = async (id) => {
    setIsAddingFriend(true);
    try {
      await addFriend(id);
    } catch (error) {
      console.error("Could not add friend");
    } finally {
      setIsAddingFriend(false);
      setFriendAddedSuccessfully(true);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditingField("name");
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      name: userProfile.name || "",
      dob: userProfile.dob || "",
      bio: userProfile.bio || "",
      location: userProfile.location || "",
      status: userProfile.status || "",
    });
    setEditingField(null);
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = formData[editingField];

    if (editingField === "name" && (!value || value.trim() === "")) {
      console.error("Name cannot be empty");
      return;
    }

    try {
      let updatePayload = { [editingField]: value };

      if (editingField === "dob" && value) {
        const date = new Date(value);
        if (isNaN(date)) {
          console.error("Invalid DOB", value);
          return;
        }
        updatePayload.dob = date.toISOString();
      }

      console.log("Sending update:", updatePayload);

      const response = await updateById(id, updatePayload, token);
      console.log("Server Response:", response);

      setUserProfile(prev => ({ 
        ...prev, 
        [editingField]: response.updatedUser[editingField] 
      }));
      
      // Update profile name if name was changed
      if (editingField === "name") {
        const userName = response.updatedUser.name.charAt(0).toUpperCase() + 
                        response.updatedUser.name.slice(1);
        setProfileName(userName);
      }
      
      setEditingField(null);
      setIsEditing(false);

      console.log("update successful");
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

    // Message handlers - Not a real functioning method yet
  const handleMessageClick = () => {
    if (!isFriend) {
      toast.error("Woah there eager beaver! You need to be friends to send messages! 👫");
      return;
    } else {
      toast("Easy tiger 🐅 the devs are working on it...")
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
          <p>The profile you&#39;re looking for doesn&#39;t exist.</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="profile-page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>...Loading, go and do something useful while you wait.</p>
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
                  <Button 
                    buttonText="Edit Profile"
                    buttonIcon={<Edit className="btn-icon" />}
                    optionalStyling="action-btn primary"
                    onClick={handleEditClick}
                  />

                  <Button 
                    buttonText="Settings"
                    buttonIcon={<Settings className="btn-icon" />}
                    optionalStyling="action-btn secondary"
                  />
                </>
              ) : (
                <>
                  {isFriend ? (
                    <p>We are already friends! No backsies 😤</p>
                  ) : (
                    <Button 
                      buttonText={isAddingFriend ? "Adding..." : "Add Friend"}
                      buttonIcon={<UserPlus className="btn-icon" />}
                      optionalStyling={`action-btn primary ${
                        isAddingFriend ? "loading" : ""
                      }`}
                      onClick={() => HandleAddfriend(id)}
                      disabled={isAddingFriend}
                    />

                  )}
                  <Button 
                    buttonText="Message"
                    buttonIcon={<MessageCircle className="btn-icon" />}
                    optionalStyling="action-btn secondary"
                    onClick={handleMessageClick}
                  />
                    
                </>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="edit-overlay">
            <div className="edit-modal">
              <UsersForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                showName={editingField === "name"}
                showDOB={editingField === "dob"}
                showBio={editingField === "bio"}
                showLocation={editingField === "location"}
                showStatus={editingField === "status"}
                name={formData.name}
                dob={formData.dob}
                bio={formData.bio}
                location={formData.location}
                status={formData.status}
                onNameChange={(event) => handleChange("name", event.target.value)}
                onDOBChange={(event) => handleChange("dob", event.target.value)}
                onBioChange={(event) => handleChange("bio", event.target.value)}
                onLocationChange={(event) => handleChange("location", event.target.value)}
                onStatusChange={(event) => handleChange("status", event.target.value)}
              />

              <div className="field-selector">
                <h3>Select field to edit:</h3>
                <Button 
                  buttonText="Name"
                  optionalStyling={editingField === "name" ? "active" : ""}
                  onClick={() => setEditingField("name")}
                />

                <Button 
                  buttonText="Date of Birth" 
                  optionalStyling={editingField === "dob" ? "active" : ""}
                  onClick={() => setEditingField("dob")}
                />

                <Button 
                  buttonText="Bio" 
                  optionalStyling={editingField === "bio" ? "active" : ""}
                  onClick={() => setEditingField("bio")}
                />

                <Button 
                  buttonText="Location" 
                  optionalStyling={editingField === "location" ? "active" : ""}
                  onClick={() => setEditingField("location")}
                />

                <Button 
                  buttonText="Status" 
                  optionalStyling={editingField === "status" ? "active" : ""}
                  onClick={() => setEditingField("status")}
                />

              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation between sections */}
        <div className="profile-tabs">
          <Button 
            buttonText="About"
            buttonIcon={<User className="tab-icon" />}
            optionalStyling={`tab-btn ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          />

          <Button 
            buttonText="Friends"
            buttonIcon={<Users className="tab-icon" />}
            optionalStyling={`tab-btn ${activeTab === "friends" ? "active" : ""}`}
            onClick={() => setActiveTab("friends")}
          />

          <Button 
            buttonText="Activity"
            buttonIcon={<Activity className="tab-icon" />}
            optionalStyling={`tab-btn ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          />

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
                      <div className="stat-number">{friendCount}</div>
                      <div className="stat-label">Friends</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">{postCount}</div>
                      <div className="stat-label">Posts</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">{postCount + friendCount}</div>
                      <div className="stat-label">Cool Points</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "friends" && (
            <div className="friends-tab-content">
              <FriendsTab
                isOwnProfile={isOwnProfile}
                profileId={id}
              />
            </div>
          )}

          {activeTab === "activity" && (
            <div className="profile-card activity-card">
              <ActivityTab 
                posts={posts}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}