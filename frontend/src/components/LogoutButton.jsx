function LogoutButton() {
  function logOut() {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event('authChange'))
    window.location.href = "/"
  }

  return <button onClick={logOut}>Log out</button>;
}

export default LogoutButton;
