import React from 'react';
import './NavBar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="links">
        <a href="HomePage">Home</a>
            <a href="login">LogIn</a>
            <a href="/register">SignUp</a>
      </div>
    </div>
  );
};

export default Navbar;
