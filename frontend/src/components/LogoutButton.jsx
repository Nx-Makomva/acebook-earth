import Button from "./Button";


const LogoutButton = () => {

    const handleLogout = () => {
      localStorage.clear();
      sessionStorage.clear();

      localStorage.removeItem("token");
      window.dispatchEvent(new Event('authChange'));
      
      window.location.replace("/");
    };

    return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
