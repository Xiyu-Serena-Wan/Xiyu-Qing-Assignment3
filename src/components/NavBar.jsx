import React, { useState, useContext } from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  async function logout() {
    await axios.post('/api/users/logout');
    setIsLoggedIn(true);
    navigate('/');
  }

  return (
    // <Context.Provider value={[ isLoggedIn, setIsLoggedIn ]}>
    <div className="navbar">
      <div className="links">
        <a href="HomePage">Home</a>
        {isLoggedIn ? (
          <a href="HomePage" onClick={logout}>
            LogOut
          </a>
        ) : (
          <a href="login">LogIn</a>
        )}
        {isLoggedIn ? null : <a href="/register">SignUp</a>}
        <a href="/pwdManager">Passwords</a>
      </div>
    </div>
    // </Context.Provider>
  );
};

export default Navbar;
