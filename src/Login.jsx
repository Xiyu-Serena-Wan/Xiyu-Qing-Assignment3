import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import './loginForm.css';
import Navbar from './components/NavBar';

function Login() {
  const navigate = useNavigate();

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

      navigate('/pokemon');
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
      <div className="container">
        <h1 style={{ backgroundColor: 'lightyellow' }}>
          Welcome to my Website!
        </h1>
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
      </div>
    </div>
  );
}

export default Login;
