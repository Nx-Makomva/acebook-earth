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
