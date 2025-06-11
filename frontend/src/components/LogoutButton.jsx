import { useNavigate } from "react-router-dom";
import Button from "./Button";


const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;