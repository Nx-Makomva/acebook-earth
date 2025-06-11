import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";

import { searchUsers } from "./services/users";
import { addFriend } from "./services/friends";
import Nav from "./components/Nav";
import Logo from "../src/assets/images/acebook_logo.png";

import { useState } from "react";
import { useEffect } from "react";

// docs: https://reactrouter.com/en/main/start/overview

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const logo = Logo;

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const searchDatabase = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setUsers([]);
      return;
    }

    try {
      const response = await searchUsers(searchTerm);

      setUsers(response.users || []);
    } catch (error) {
      console.error("Search Failed: ", error);
      setUsers([]);
    }
  };

  const HandleAddfriend = async (friendId) => {
    try {
      await addFriend(friendId);
      console.log("friend added:", friendId);

      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error("Error adding friend", error);
    }
  };

  const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/posts/feed/:userId",
    element: <FeedPage refreshTrigger={refreshTrigger}/>,
  },
  {
    path: "/profile/:id",
    element: <ProfilePage addFriend={HandleAddfriend}/>
  }
]);

  return (
    <>
      {isAuthenticated && (
        <Nav
          logo={logo}
          onSearch={searchDatabase}
          users={users}
          addFriend={HandleAddfriend}
        />
      )}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
