// Navbar.js
import React from 'react';
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faUser } from "@fortawesome/free-solid-svg-icons";
import './NavBar.css';

// const logo = require('../../../assets/images/logoNest.png');

const Navbar = () => {
  return (
    <div className="navbar">
      {/* <img src={logo} alt="logoOfNest" className="logoImg" /> */}
      <div className="links">
        <a href="HomePage">Home</a>
        <a href="login">LogIn</a>
        <a href="/register">SignUp</a>
        {/* <a href="/">RENT</a> */}
      </div>
      <div className="buttons">
        {/* <button>
          <a className="signIn" href="/App.js">
            Sign In
          </a>
        </button>
        &nbsp; */}
        <a href="/account">Profile</a>
      </div>
    </div>
  );
};

export default Navbar;
