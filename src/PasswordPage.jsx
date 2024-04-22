import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './pwdPage.css';
import './components/NavBar.css';
import './loginForm.css';

export const Context = React.createContext();

function PasswordPage() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const [pwdListState, setPwdListState] = useState([]);
  const [pwdURLState, setPwdURLState] = useState('');
  const [pwdPasswordState, setPwdPasswordState] = useState('');
  const [pwdLengthState, setPwdLengthState] = useState('12');
  const [editingState, setEditingState] = useState({
    isEditing: false,
    editingpwdId: '',
  });
  const [errorMsgState, setErrorMsgState] = useState('');
  const [username, setUsername] = useState('');

  async function getAllPwd() {
    const response = await axios.get('/api/pwdManager');
    setPwdListState(response.data);
  }

  async function deletePwd(pwdId) {
    await axios.delete('/api/pwdManager/' + pwdId);
    await getAllPwd();
  }

  async function onSubmit() {
    setErrorMsgState('');
    try {
      if (editingState.isEditing) {
        await axios.put('/api/pwdManager/' + editingState.editingPwdId, {
          URL: pwdURLState,
          password: pwdPasswordState,
          length: pwdLengthState,
        });
      } else {
        await axios.post('/api/pwdManager', {
          URL: pwdURLState,
          password: pwdPasswordState,
          length: pwdLengthState,
        });
      }

      setPwdPasswordState('');
      setPwdURLState('');
      setPwdLengthState('');
      setEditingState({
        isEditing: false,
        editingPwdId: '',
      });
      await getAllPwd();
    } catch (error) {
      setErrorMsgState(error.response.data);
    }
  }

  function updatePwdPassword(event) {
    setPwdPasswordState(event.target.value);
  }

  function updatePwdURL(event) {
    setPwdURLState(event.target.value);
  }

  function updatePwdLength(event) {
    setPwdLengthState(event.target.value);
  }

  function setEditingPwd(pwdURL, pwdPassword, pwdId) {
    setPwdPasswordState(pwdPassword);
    setPwdURLState(pwdURL);
    setPwdLengthState(pwdLength);
    setEditingState({
      isEditing: true,
      editingPwdId: pwdId,
    });
  }

  function onStart() {
    isLoggedIn().then(() => {
      getAllPwd();
    });
  }

  function onCancel() {
    setPwdPasswordState('');
    setPwdURLState('');
    setEditingState({
      isEditing: false,
      editingPwdId: '',
    });
  }

  async function logout() {
    await axios.post('/api/users/logout');
    setLoggedIn(false);
    navigate('/');
  }

  async function isLoggedIn() {
    try {
      const response = await axios.get('/api/users/loggedIn');
      const username = response.data.username;
      setUsername(username);
      setLoggedIn(true);
    } catch (e) {
      navigate('/');
    }
  }

  useEffect(onStart, []);

  const pwdListElement = [];
  for (let i = 0; i < pwdListState.length; i++) {
    pwdListElement.push(
      <li>
        URL: {pwdListState[i].URL} - Password: {pwdListState[i].password} &nbsp;&nbsp;
        <button onClick={() => deletePwd(pwdListState[i]._id)}>Delete</button> -{' '}
        <button
          onClick={() =>
            setEditingPwd(
              pwdListState[i].URL,
              pwdListState[i].password,
              pwdListState[i].length,
              pwdListState[i]._id,
            )
          }
        >
          Edit
        </button>
      </li>,
    );
  }

  const inputFieldTitleText = editingState.isEditing
    ? 'Edit password'
    : 'Create new password';

  if (!username) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="navbar">
        <div className="links">
          <div>
            <a href="HomePage">Home</a>
          </div>
          {loggedIn ? (
            <div>
              <a href="/pwdManager">Profile</a>
            </div>
          ) : (
            <div>
              <a href="/login">LogIn</a>
              <a href="/register">SignUp</a>
            </div>
          )}
        </div>
      </div>
      <br></br>
      <br></br>

      <div className="centerForm">
        <div className="container">
          <div>
            <div className="userContainer">
              <p className="noBold">
                User: <strong>{username}</strong>
              </p>{' '}
              &nbsp;&nbsp;&nbsp;&nbsp;
              <button className="logoutButton" onClick={logout}>
                Logout
              </button>
              &nbsp;&nbsp;&nbsp;&nbsp;

              <button className="shareButton">
                Share
              </button>
            </div>
            <hr></hr>
          </div>
          <br></br>
          {errorMsgState && <h1>{errorMsgState}</h1>}
          <h4>Here are all your passwords:</h4>
          <ul>{pwdListElement}</ul>
          <hr></hr>
          <div>
            <h4>{inputFieldTitleText}</h4>
            <br></br>
          </div>
          <div>
            <div>
              <label>Website URL (Format: www.xxx.com)</label>{' '}
              <br></br>
              <input className='pwdInput'
                value={pwdURLState}
                onInput={(event) => updatePwdURL(event)}
              />
            </div>
            <br></br>

            <div>
              <label>Password:</label>{' '}
              <br></br>
              <input className='pwdInput'
                value={pwdPasswordState}
                onInput={(event) => updatePwdPassword(event)}
              />
            </div>
            <br></br>
            <div>
              <label>Password Length(optional):</label>{' '}
              <br></br>
              <input className='pwdInput'
                value={pwdLengthState}
                onInput={(event) => updatePwdLength(event)}
              />
            </div>
            <br></br>
            <br></br>

            <div>
              <button onClick={() => onSubmit()}>Submit</button>
              &nbsp; &nbsp;&nbsp;
              <button onClick={() => onCancel()}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordPage;
