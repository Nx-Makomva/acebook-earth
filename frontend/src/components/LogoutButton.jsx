// To be fixed
import { LogOutIcon } from "lucide-react";

function LogoutButton({ className }) {
  function logOut() {
    localStorage.clear();
    sessionStorage.clear();

    localStorage.removeItem("token");
    window.dispatchEvent(new Event('authChange'));
    
    window.location.replace("/");
  }

  return (
  <button 
    onClick={logOut} 
    className={`dropdown-item logout-item ${className}`}
  >
    <LogOutIcon className="dropdown-icon" />
    Log out
  </button>
  )
}
export default LogoutButton;

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
