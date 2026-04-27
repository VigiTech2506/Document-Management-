import React from 'react';
import './Navbar.css';
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ onMenuClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="menu-toggle" onClick={onMenuClick} aria-label="Toggle Menu">
          <MenuIcon />
        </button>
        <div className="navbar-brand">
          <h2>Paperchime</h2>
        </div>
        <div className="navbar-actions">
          {/* Add user profile or other actions if needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
