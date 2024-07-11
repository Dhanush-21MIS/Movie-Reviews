import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Header.css'; // Make sure to import your CSS file for styling
import Logo from './logo.png'; // Import your logo image

const NavigationBar = ({ isLoggedIn, handleSignIn, handleSignOut }) => {
  return (
    <>
      <nav className="navbar">
        <div className="left">
          <h1> <img src={Logo} alt="Logo" className="logo" />Movie Review</h1>
        </div>
        <div className="right">
          <ul className="nav-items">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              {isLoggedIn ? (
                <>
                  <Link to="/account">Account</Link>
                  <button onClick={handleSignOut}>Sign Out</button>
                </>
              ) : (
                <button onClick={handleSignIn}>Sign In</button>
              )}
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default NavigationBar;
