import "../../assets/styles/ProfilePage.css"

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getById, updateById } from "../../services/users";

import UsersForm from "../../components/UsersForm";
import "./ProfilePage.css"

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
    const[notFound, setNotFound] = useState(false);

    const token = localStorage.getItem("token");
    const decoded = decodeToken(token);
    const user_id = decoded?.sub;

    const [editingField, setEditingField] = useState(null);
    const [formData, setFormData] = useState({
    name: "",
    dob: "",
    bio: "",
    location: "",
    status: "",
    });

    useEffect(() => {
    if (!token || !user_id) {
        navigate("/login");
        return;
    }

        getById(id)
            .then((data) => {
                setUser(data.user)
                setFormData({
                    name: data.user.name || "",
                    dob: data.user.dob || "",
                    bio: data.user.bio || "",
                    location: data.user.location || "",
                    status: data.user.status || "",
                });
            })
            .catch((err) => {
                console.error(err)
                setNotFound(true)
            })
        }, [id, navigate, token, user_id])

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleCancel = () => {
        setFormData({
            name: user.name || "",
            dob: user.dob || "",
            bio: user.bio || "",
            location: user.location || "",
            status: user.status || "",
        });
        setEditingField(null);
        };

    const handleSubmit = async (event) => {
    event.preventDefault();
    const value = formData[editingField];

    if (editingField === "name" && (!value || value.trim() === "")) { 
            console.error("Name cannot be empty")
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
        console.log("Server Response:", response)

        setUser(prev => ({ ...prev, [editingField]: response.updatedUser[editingField] }));
        setEditingField(null); // Close the form

        console.log("update successful")
    } catch (err) {
        console.error("Failed to update:", err);
    }
    };

    if (notFound) {
        return <div>404 error: Profile not found</div>
    }
    if (!user) {
        return <div>...Loading, go and do something useful while you wait.</div>
    }

    const HandleAddfriend = async (id) => {
    try {
      await addFriend(id);
      // setShowSearchResults(false);
    } catch (error) {
      console.error("Could not add friend");
    }
  };

    if (id === user_id) {
        return (
        <>
            <h1>My Profile</h1>
            <div className="profile-card">
                <p>
                <img
                src="https://i0.wp.com/eos.org/wp-content/uploads/2025/02/everest-peak.jpg?fit=1200%2C675&ssl=1"
                alt="profile picture"
                width="200"
                height="200"
                /></p>
                <div id="name">
                    <strong>Name: </strong>{" "}
                    {editingField === "name" ? (
                        <UsersForm
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            showName={true}
                            name={formData.name}
                            onNameChange={(event) => handleChange("name", event.target.value)}
                        />
                    ) : (
                        <>
                            {user.name}
                            <button onClick={() => setEditingField("name")} id="editName" aria-label="edit name">✏️edit</button>
                        </>
                    )}
                </div>
                <div id="age">
                    <strong>Age:</strong>{" "}
                    {editingField === "dob" ? (
                        <UsersForm
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            showDOB={true}
                            dob={formData.dob}
                            onDOBChange={(event) => handleChange("dob", event.target.value)}
                        />
                    ) : (
                        <>
                            {Math.floor(
                            (new Date(Date.now() - new Date(user.dob).getTime())).getUTCFullYear() - 1970
                            )}
                            <button onClick={() => setEditingField("dob")} id="editAge" aria-label="edit age">✏️edit</button>
                        </>
                    )}
                </div>
            </div>
            <div className="bio-card">
                <div id="status">
                    <strong><br />Status:<br /></strong>
                    {editingField === "status" ? (
                        <UsersForm
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            showStatus={true}
                            status={formData.status}
                            onStatusChange={(event) => handleChange("status", event.target.value)}
                        />
                    ) : (
                    <>
                        {user.status}
                        <button onClick={() => setEditingField("status")} id="editStatus" aria-label="edit status">✏️edit</button>
                    </>
                    )}
                </div>
                <div id="location">
                    <strong>location:<br /></strong>
                    {editingField === "location" ? (
                        <UsersForm
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            showLocation={true}
                            location={formData.location}
                            onLocationChange={(event) => handleChange("location", event.target.value)}
                        />
                    ) : (
                    <>
                        {user.location}
                        <button onClick={() => setEditingField("location")} id="editLocation" aria-label="edit location">✏️edit</button>
                    </>
                    )}
                </div>
                <div id="bio">
                    <strong>Bio:<br /></strong>
                    {editingField === "bio" ? (
                        <UsersForm
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            showBio={true}
                            bio={formData.bio}
                            onBioChange={(event) => handleChange("bio", event.target.value)}
                        />
                    ) : (
                    <>
                        {user.bio}
                        <button onClick={() => setEditingField("bio")} id="editBio" aria-label="edit bio">✏️edit</button>
                    </>
                    )}
                </div>
            </div>
        </>
    )} else {
        return (
        <>
            <h1>{user.name}&#39;s Profile</h1>
            <div className="profile-card">
                <p>
                <img
                src="https://i0.wp.com/eos.org/wp-content/uploads/2025/02/everest-peak.jpg?fit=1200%2C675&ssl=1"
                alt="profile picture"
                width="200"
                height="200"
                /></p>
                <p id="name"><strong>Name: </strong>{user.name}</p>
                <p id="age"><strong>Age: </strong>{Math.floor(
                    (new Date(Date.now() - new Date(user.dob).getTime())).getUTCFullYear() - 1970
                    )
                }</p>
            </div>
            <div className="bio-card">
                <p id="status"><strong>Status: <br /></strong>{user.status}</p>
                <p id="location"><strong>Location: <br /></strong>{user.location}</p>
                <p id="bio"><strong>Bio: <br /></strong>{user.bio}</p>
            </div>
        </>
        )
    }
}