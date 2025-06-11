import { useNavigate } from "react-router-dom";
import Button from "./Button";


const LogoutButton = () => {
    const navigate = useNavigate();

// function LogoutButton() {
//   function logOut() {
//     localStorage.removeItem("token");
//     window.dispatchEvent(new Event('authChange'))
//     window.location.href = "/"
//  }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;