import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './pwdPage.css';
import './components/NavBar.css';
import './loginForm.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function PasswordPage() {
  // let guestpwdListElement=[]

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
  const [includeAlpha, setIncludeAlpha] = useState(false);
  const [includeNum, setIncludeNum] = useState(false);
  const [includeSym, setIncludeSym] = useState(false);
  const [sharingGroup, setSharingGroup]=useState([]);
  const [guestName, setGuestName] = useState('');
  const [guestpwdListState, setGuestPwdListState] = useState([]);
  const [guestID, setGuestID] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [pwdError, setPwdError] = useState("");
  async function getAllPwd() {
    const response = await axios.get('/api/pwdManager');
    setPwdListState(response.data);
  }

  async function deletePwd(pwdId) {
    await axios.delete('/api/pwdManager/' + pwdId);
    await getAllPwd();
  }

  async function sendRequest(){
    setErrorMsgState('');
    setPwdError('');
    setErrorMsg('');

    try {
      const getUserResponse = await axios.get(`/api/users/${guestName}`);
      if (!getUserResponse) {
        setErrorMsgState('user does not exist!');
        return;
      }
      
      if (username === guestName) {
        // setErrorMsgState("You can't share passwords with yourself");
        setErrorMsg("You can't share passwords with yourself");
        return;
      }
      setGuestID(getUserResponse.data._id)
      const sharedByUsers = getUserResponse.sharedByUsers || [];
      sharedByUsers.push(username);
      await axios.put(`/api/users/${guestName}`, { sharedByUsers });

      //get passwords by owner
      const sharedPasswords = await axios.get(`/api/pwdManager/${guestID}`);
      // guestpwdListElement = sharedPasswords;
      // setGuestPwdListState(sharedPasswords)

      
      const response = await axios.get('/api/pwdManager');
      setGuestPwdListState(response.data);

    } catch (error) {
      setErrorMsgState(error.response.data);
    }
  }

  async function onSubmit() {
    setErrorMsgState('');
    try {
      if (!pwdURLState) {
        setPwdError('URL is required!');
        return;
      }

      if (editingState.isEditing) {
        await axios.put('/api/pwdManager/' + editingState.editingpwdId, {
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

  const generatePw = () => {
    if (!pwdPasswordState) {
      if (!includeAlpha && !includeNum && !includeSym) {
        setPwdError('At least one checkbox must be checked');
        return;
      }
      if (pwdLengthState < 4 || pwdLengthState > 50) {
        setPwdError('the length must be between 4 and 50, inclusive');
        return;
      }
    }

    const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const num = '1234567890';
    const sym = '!@#$%^&*()-_=+';

    let pw = '';
    let charSet = '';
    if (includeAlpha) {
      charSet += alpha;
    }
    if (includeNum) {
      charSet += num;
    }
    if (includeSym) {
      charSet += sym;
    }
    for (let i = 0; i < pwdLengthState; i++) {
      const randomIdx = Math.floor(Math.random() * charSet.length);
      pw += charSet[randomIdx];
    }
    setPwdPasswordState(pw);
  };

  function updatePwdPassword(event) {
    setPwdPasswordState(event.target.value);
  }

  function updatePwdURL(event) {
    setPwdURLState(event.target.value);
  }

  function updatePwdLength(event) {
    setPwdLengthState(event.target.value);
  }

  function updateGuestName(event) {
    setGuestName(event.target.value);
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
      const sender  = await axios.get(`/api/users/${username}`);
      // setGuestID(sender.data._id);
      setSharingGroup(sender.data.sharedByUsers);
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

  for (let i = 0; i < guestpwdListState.length; i++) {
    guestpwdListElement.push(
      <li>
        URL: {guestpwdListState[i].URL} - Password: {guestpwdListState[i].password} &nbsp;&nbsp;
      </li>,
    );
  }
  const guestpwdListElement = [];
  for (let i = 0; i < guestpwdListState.length; i++) {
    guestpwdListElement.push(
      <li>
        URL: {guestpwdListState[i].URL} - Password: {guestpwdListState[i].password} &nbsp;&nbsp;
      </li>,
    );
  }
  // console.log("00000000000000")
  // console.log(guestpwdListElement)

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
              <Popup
        trigger={<button className="button" > Notifications </button>}
        modal
        nested
      >
        {close => (
          <div className="modal">
            <button className="close" onClick={close}>
              &times;
            </button>
            <div className="content">
            {' '}
              {sharingGroup? <div>
                <br></br>
              You received the passwords shared by <strong>{sharingGroup[0]}</strong>.
              <br></br>
              Do you want to accept?
              </div> : 
              <div> No message found </div>}
            
            </div>
            <br></br>

            <div className="actions">
              <Popup
                trigger={<button className="button"> Show me </button>}
                position="bottom center"
                nested
              >
           <ul>{guestpwdListElement.map(pwd=><div>URL: {pwd.URL} - Password: {pwd.password} </div>)}</ul>
              </Popup>
              <span>{' '}</span>
              <button
                className="button"
                onClick={() => {
                  close();
                }}
              >
                Deny
              </button>
            </div>
          </div>
        )}
      </Popup>

            </div>
            <hr></hr>
          </div>
          <br></br>
          {errorMsgState && <h1>{errorMsgState}</h1>}
          <h2>Here are all your passwords:</h2>
          <ul>{pwdListElement}</ul>

          </div></div>
          <div className="centerForm">
        <div className="container">
          <hr></hr>
          <div>
            <h2>{inputFieldTitleText}</h2>
          </div>
          <h2>{pwdError}</h2>
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
              <button onClick={generatePw}>Generate Password</button>
            </div>
            <br></br>
            <div>
              <label>Password Length(optional):</label>{' '}
              <br></br>
              <input className='pwdInput'
                value={pwdLengthState}
                onInput={(event) => updatePwdLength(event)}
                min="4"
                max="50"
              />
            </div>
            <br></br>
            <div>
            <label>Options:</label>{' '}
            <input 
              type="checkbox"
              checked={includeAlpha}
              onChange={(event) => setIncludeAlpha(event.target.checked)} />
            <label>Alphabet</label>
            <input 
              type="checkbox"
              checked={includeNum}
              onChange={(event) => setIncludeNum(event.target.checked)} />
              <label>Numerals</label>{' '}
            <input 
              type="checkbox"
              checked={includeSym}
              onChange={(event) => setIncludeSym(event.target.checked)} />
              <label>Symbols</label>{' '}
          </div>
          <br />
            <div>
              <button onClick={() => onSubmit()}>Submit</button>
              &nbsp; &nbsp;&nbsp;
              <button onClick={() => onCancel()}>Cancel</button>
            </div>
          </div>
          </div></div>
          <div className="centerForm">
        <div className="container">
          <hr></hr>
          <div>
            <h2>Would you like to share passwords?</h2>
            <div>
            {errorMsg && <h1 className='warning'>{errorMsg}</h1>}

              <label>Input another user's username:</label>{' '}
            <br></br>
              <br></br>
              <input className='guestInput'
                value={guestName}
                onInput={(event) => updateGuestName(event)}
              />
              <button onClick={() => sendRequest()}>Send a message</button>
            <br></br>
            <br></br>

            </div>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

    </div>
  );
}

export default PasswordPage;