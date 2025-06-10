import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getById } from "../../services/users";

import UsersForm from "../../components/UsersForm";
import "./ProfilePage.css"

const token = localStorage.getItem("token");

function decodeToken(token) {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = atob(payloadBase64);
    return JSON.parse(decodedPayload);
}

const decoded = decodeToken(token)
const user_id = decoded.sub;

export function ProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const[notFound, setNotFound] = useState(false);

    useEffect(() => {
    if (!token) {
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
    }, [id, navigate])

    if (notFound) {
        return <div>404 error: Profile not found</div>
    }
    if (!user) {
        return <div>...Loading, go and do something useful while you wait.</div>
    }

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
                <p id="name">Name: {user.name}</p>
                <p id="age">Age: {Math.floor(
                    (new Date(Date.now() - new Date(user.dob).getTime())).getUTCFullYear() - 1970
                    )
                }</p>
            </div>
            <div className="bio-card">
                <p id="status">Status:<br />{user.status}</p>
                <p id="location">Location:<br />{user.location}</p>
                <p id="bio">Bio:<br />{user.bio}</p>
            </div>
        </>
    )} else {
        return (
        <>
            <h1>{user.name}'s Profile</h1>
            <div className="profile-card">
                <p>
                <img
                src="https://i0.wp.com/eos.org/wp-content/uploads/2025/02/everest-peak.jpg?fit=1200%2C675&ssl=1"
                alt="profile picture"
                width="200"
                height="200"
                /></p>
                <p id="name">Name: {user.name}</p>
                <p id="age">Age: {Math.floor(
                    (new Date(Date.now() - new Date(user.dob).getTime())).getUTCFullYear() - 1970
                    )
                }</p>
            </div>
            <div className="bio-card">
                <p id="status">Status:<br />{user.status}</p>
                <p id="location">Location:<br />{user.location}</p>
                <p id="bio">Bio:<br />{user.bio}</p>
            </div>
        </>
        )
    }
}