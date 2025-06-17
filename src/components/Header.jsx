import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <nav className="header">
      <div className="logo">My Personal Workspace</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/files">Files</Link></li>
        <li><Link to="/links">Links</Link></li>
        <li><Link to="/photos">Photos</Link></li>
        <li><Link to="/reminders">Reminders</Link></li>
      </ul>
    </nav>
  );
};

export default Header;