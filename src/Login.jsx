import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import './loginForm.css';
import Navbar from './components/NavBar';
// import {Context} from '../src/AuthContext.jsx'

function Login() {
  const navigate = useNavigate();
  // const [isLoggedIn, setIsLoggedIn] = useContext(Context);

  const [usernameState, setUsernameState] = useState('');
  const [passwordState, setPasswordState] = useState('');
  const [errorMsgState, setErrorMsgState] = useState('');

  async function onSubmit() {
    setErrorMsgState('');
    try {
      await axios.post('/api/users/login', {
        username: usernameState,
        password: passwordState,
      });
      // setIsLoggedIn(true);
      navigate('/pwdManager');
    } catch (error) {
      setErrorMsgState(error.response.data);
      console.log(error.response.data);
    }
  }

  function updatePassword(event) {
    setPasswordState(event.target.value);
  }

  function updateUsername(event) {
    setUsernameState(event.target.value);
  }

  return (
    <div>
      <Navbar />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="centerForm">
        <div className="container">
          <br></br>
          <br></br>
          <h1>User Login</h1>
          {errorMsgState && <h1>{errorMsgState}</h1>}
          <hr></hr>
          <br></br>

          <div>
            <div>
              <label>Username:</label>{' '}
              <input
                value={usernameState}
                onInput={(event) => updateUsername(event)}
              />
            </div>
            <br></br>
            <div>
              <label>Password:</label>{' '}
              <input
                value={passwordState}
                onInput={(event) => updatePassword(event)}
              />
            </div>
            <br></br>
            <div>
              <button onClick={() => onSubmit()}>Submit</button>
            </div>
          </div>
          <h4 style={{ backgroundColor: 'lightyellow' }}>
            Don't have an account?{' '}
            <a href="/register">Create a new account now.</a>
          </h4>
        </div>
      </div>
    </div>
  );
}

export default Login;
