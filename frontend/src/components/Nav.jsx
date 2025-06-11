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
import { useRef } from "react";

const Nav = ({ logo, onSearch, users, addFriend }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const userId = localStorage.getItem("userId");

  // Creating references for search field and menu so they close
  // when user clicks away from them
  const searchContainerRef = useRef(null);
  const menuContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }

      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target)
      ) {
        setShowDropdownMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
  }, [debouncedSearchTerm]); // ignore this warning. onSearch should NOT be a dependency

  const handleSearch = (event) => {
    event.preventDefault();

    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowSearchResults(true);
    }
  };

  const HandleAddfriend = async (friendId) => {
    try {
      await addFriend(friendId);
      // This functionality should be moved out of search functionality
      setShowSearchResults(false);
    } catch (error) {
      console.error("Could not add friend");
    }
  };

  return (
    <nav className="nav">
      <div className="nav-inner flex items-center justify-between p-6">
        <div className="nav-logo">
          <a
            href={`/posts/feed/${userId}`}
            className="nav-home-link flex items-center justify-center"
          >
            <img src={logo} alt="Logo" className="h-10" />
          </a>
        </div>

        <div className="relative" ref={searchContainerRef}>
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
                    className="search-result-item p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between border-b last:border-b-0"
                  >
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <User2Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <a href={`/profile/${user._id}`}>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name.charAt(0).toUpperCase() +
                              user.name.slice(1)}
                          </p>
                        </div>
                      </a>
                    {/* <button
                      onClick={() => HandleAddfriend(user._id)}
                      className="ml-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Add Friend
                    </button> */}
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500 text-center">
                  No users found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="home">
          <a
            href={`/posts/feed/${userId}`}
            className="nav-home-link flex items-center justify-center"
          >
            <HomeIcon className="home-icon w-6 h-6" />
          </a>
        </div>

        {/* Menu container with ref */}
        <div className="profile-container" ref={menuContainerRef}>
          <button
            onClick={() => setShowDropdownMenu(!showDropdownMenu)}
            className="profile-button flex items-center justify-center"
          >
            <MenuIcon className="menu-icon w-5 h-5" />
          </button>

          {showDropdownMenu && (
            <div className="dropdown-menu">
              <a href={`/profile/${userId}`} className="dropdown-item">
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
