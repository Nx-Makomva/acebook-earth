import Button from "./Button";
import { LogOutIcon } from "lucide-react";

const LogoutButton = ({ className }) => {

    const handleLogout = () => {
      localStorage.clear();
      sessionStorage.clear();

      localStorage.removeItem("token");
      window.dispatchEvent(new Event('authChange'));
      
      window.location.replace("/");
    };

    return (
    <Button 
      onClick={handleLogout}
      buttonIcon={<LogOutIcon className="dropdown-icon" />}
      buttonText="Log out"
      optionalStyling={`dropdown-item logout-item ${className}`}
    />
  )
};

export default LogoutButton;
