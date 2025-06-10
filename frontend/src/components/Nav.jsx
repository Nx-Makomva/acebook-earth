import { useState } from "react";
import {
  HomeIcon,
  User2Icon,
  SettingsIcon,
  SearchIcon,
  MenuIcon,
} from "lucide-react";
import LogoutButton from "../components/LogoutButton";

import "../assets/styles/Nav.css";
import { useEffect } from "react";

const Nav = ({ logo, onSearch, users, addFriend }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      onSearch(debouncedSearchTerm);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [debouncedSearchTerm, onSearch]);

  const handleSearch = (event) => {
    event.preventDefault();

    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowSearchResults(true);
    }
  };

  const HandleAddfriend = (friendId) => {
    addFriend(friendId);
    // This functionality should be moved out of search functionality
  };

  return (
    <nav className="nav">
      <div className="nav-inner flex items-center justify-between p-6">
        <div className="nav-logo">
          <a
            href="/posts"
            className="nav-home-link flex items-center justify-center"
          >
            <img src={logo} alt="Logo" className="h-10" />
          </a>
        </div>

        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for anything..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onFocus={() => searchTerm.trim() && setShowSearchResults(true)}
            className="search-input"
          />
          <SearchIcon className="search-icon w-5 h-5" />
        </form>

        {showSearchResults && searchTerm.trim() && (
          <div className="search-dropdown absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border z-50 max-h-60 overflow-y-auto">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="search-result-item p-3 hover:bg-gray-50 cursor-pointer flex items-center border-b last:border-b-0"
                  // onClick={() => handleUserClick(user)} this will link to user profiles
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <User2Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
                    </p>
                    {/* {user.email && (
                      <p className="text-sm text-gray-500">{user.email}</p>
                    // )} Might change this to tag of whether result is friend of user 
                    // or users profile themself
                    // */}
                    <button onClick={() => HandleAddfriend(user._id)}>
                      Add Friend
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No users found for: {searchTerm}
              </div>
            )}
          </div>
        )}

        <div className="home">
          <a
            href="/posts/feed/:userId"
            className="nav-home-link flex items-center justify-center"
          >
            <HomeIcon className="home-icon w-6 h-6" />
          </a>
        </div>

        {/* Profile - dropdown with Profile/Settings options when profile clicked */}
        <div className="profile-container">
          <button
            onClick={() => setDropdownMenuOpen(!dropdownMenuOpen)}
            className="profile-button flex items-center justify-center"
          >
            <MenuIcon className="menu-icon w-5 h-5" />
          </button>

          {/* Conditionally render menu by toggling the state between true & false */}
          {dropdownMenuOpen && (
            <div className="dropdown-menu">
              <a href="/profile" className="dropdown-item">
                <User2Icon className="dropdown-icon w-5 h-5" />
                Profile
              </a>
              <a href="/settings" className="dropdown-item">
                <SettingsIcon className="dropdown-icon w-5 h-5" />
                Account Settings
              </a>
              <LogoutButton className="ml-4 text-sm font-medium text-red-600 hover:text-red-800" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
