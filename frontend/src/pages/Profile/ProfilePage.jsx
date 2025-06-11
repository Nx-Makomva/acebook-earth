import "../../assets/styles/ProfilePage.css"

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getById } from "../../services/users";
import { UserPlus, MapPin, Calendar, MessageCircle, Settings, Edit } from "lucide-react";

function decodeToken(token) {
    if (!token) return null;

    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return null;

        const decodedPayload = atob(payloadBase64);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
}

export function ProfilePage({ addFriend }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [notFound, setNotFound] = useState(false);
    const [isAddingFriend, setIsAddingFriend] = useState(false);

    const token = localStorage.getItem("token");
    const decoded = decodeToken(token);
    const user_id = decoded?.sub;

    useEffect(() => {
        if (!token || !user_id) {
            navigate("/login");
            return;
        }

        getById(id)
            .then((data) => {
                setUser(data.user)
            })
            .catch((err) => {
                console.error(err)
                setNotFound(true)
            })
    }, [id, navigate, token, user_id])

    const HandleAddfriend = async (id) => {
			console.log("This is friendId:", id)
        setIsAddingFriend(true);
        try {
            await addFriend(id);
						console.log("This is friendId:", id)
        } catch (error) {
            console.error("Could not add friend");
        } finally {
            setIsAddingFriend(false);
        }
    };

    if (notFound) {
        return (
            <div className="profile-page-container">
                <div className="error-container">
                    <h1>404 - Profile Not Found</h1>
                    <p>The profile you're looking for doesn't exist.</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="profile-page-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        )
    }

    const isOwnProfile = id === user_id;

    return (
        <div className="profile-page-container">
            <div className="profile-content">
                {/* Hero Section */}
                <div className="profile-hero">
                    <div className="profile-cover"></div>
                    <div className="profile-main">
                        <div className="profile-avatar-container">
                            <img
                                src="https://i0.wp.com/eos.org/wp-content/uploads/2025/02/everest-peak.jpg?fit=1200%2C675&ssl=1"
                                alt="profile picture"
                                className="profile-avatar"
                            />
                            <div className="avatar-status-indicator"></div>
                        </div>
                        
                        <div className="profile-header-info">
                            <h1 className="profile-name">
                                {isOwnProfile ? user.name : user.name}
                            </h1>
                            <p className="profile-status">{user.status}</p>
                            
                            <div className="profile-meta">
                                <div className="meta-item">
                                    <MapPin className="meta-icon" />
                                    <span>{user.location}</span>
                                </div>
                                <div className="meta-item">
                                    <Calendar className="meta-icon" />
                                    <span>{Math.floor(
                                        (new Date(Date.now() - new Date(user.dob).getTime())).getUTCFullYear() - 1970
                                    )} years old</span>
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
                                    <button 
                                        className={`action-btn primary ${isAddingFriend ? 'loading' : ''}`}
                                        onClick={() => HandleAddfriend(id)}
                                        disabled={isAddingFriend}
                                    >
                                        <UserPlus className="btn-icon" />
                                        {isAddingFriend ? 'Adding...' : 'Add Friend'}
                                    </button>
                                    <button className="action-btn secondary">
                                        <MessageCircle className="btn-icon" />
                                        Message
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="profile-grid">
                    {/* About Card */}
                    <div className="profile-card about-card">
                        <div className="card-header">
                            <h3>About {isOwnProfile ? 'Me' : user.name}</h3>
                        </div>
                        <div className="card-content">
                            <div className="about-section">
                                <h4>Bio</h4>
                                <p className="bio-text">{user.bio || 'No bio added yet.'}</p>
                            </div>
                            <div className="about-section">
                                <h4>Status</h4>
                                <p className="status-text">{user.status}</p>
                            </div>
                            <div className="about-section">
                                <h4>Location</h4>
                                <p className="location-text">{user.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="profile-card stats-card">
                        <div className="card-header">
                            <h3>Profile Stats</h3>
                        </div>
                        <div className="card-content">
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <div className="stat-number">42</div>
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

                    {/* Recent Activity Card */}
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
                </div>
            </div>
        </div>
    );
}