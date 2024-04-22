import axios from 'axios';
import { useState } from 'react';
import Navbar from './components/NavBar';
import './loginForm.css';
import { useNavigate } from 'react-router';


function Register() {
  const [usernameState, setUsernameState] = useState('');
  const [passwordState, setPasswordState] = useState('');
  const [verifyPasswordState, setVerifyPasswordState] = useState('');
  const [errorMsgState, setErrorMsgState] = useState('');
  const navigate = useNavigate();

  async function onSubmit() {
    setErrorMsgState('');
    if (verifyPasswordState !== passwordState) {
      setErrorMsgState('Please verify passwords are the same :)');
      return;
    }

    try {
      await axios.post('/api/users/register', {
        username: usernameState,
        password: passwordState,
      });

      setPasswordState('');
      setUsernameState('');
      navigate('/login')
    } catch (error) {
      setErrorMsgState(error.response.data);
    }
  }

  function updatePassword(event) {
    setPasswordState(event.target.value);
  }

  function updateVerifyPassword(event) {
    setVerifyPasswordState(event.target.value);
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
      <br></br>
      <br></br>

        <h1>Registeration</h1>
        {errorMsgState && <h1>{errorMsgState}</h1>}

<hr></hr>
        <div>
          <div>
            <br></br>
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
            <label>Verify Password:</label>{' '}
            <input
              value={verifyPasswordState}
              onInput={(event) => updateVerifyPassword(event)}
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

export default Register;
