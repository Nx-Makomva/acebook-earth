import { Link } from "react-router-dom";

import "./HomePage.css";

export function HomePage() {
  return (
    <div className="homepageContainer">
      <h1>Welcome to Acebook!</h1>
      <div className="linkGroup">
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Log In</Link>
      </div>
    </div>
  );
}
