import React, { JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TokenStorage } from "../../utils/tokenStorage";
import "../styles/NavigationBar.css";

function NavigationBar(): JSX.Element {
  const navigate = useNavigate();
  const role = TokenStorage.getUserRole();

  function handleLogout(): void {
    TokenStorage.clearToken();
    navigate("/");
  }

  return (
    <nav className="navigation-bar">
      <div className="nav-left">
        {role === "USER" && (
          <>
            <Link to="/news">News</Link>
            <Link to="/saved">Saved Articles</Link>
            <Link to="/feedback?sort=like">Liked Articles</Link>
            <Link to="/feedback?sort=dislike">Disliked Articles</Link>
            <Link to="/notifications">Notifications</Link>
            <Link to="/search">Search</Link>
          </>
        )}
        {role === "ADMIN" && (
          <>
            <Link to="/admin/servers">Manage Servers</Link>
            <Link to="/admin/users">Manage Users</Link>
            <Link to="/admin/reports">Reported Articles</Link>
          </>
        )}
      </div>

      {role === "USER" && (
        <div className="nav-right">
          <Link to="/profile" className="profile-link">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {role === "ADMIN" && (
        <div className="nav-right">
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default NavigationBar;
