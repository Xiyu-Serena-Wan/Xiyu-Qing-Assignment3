import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Navbar from './components/NavBar';
import './pwdPage.css';

function PasswordPage() {
  const navigate = useNavigate();

  const [pwdListState, setPwdListState] = useState([]);
  const [pwdURLState, setPwdURLState] = useState('');
  const [pwdPasswordState, setPwdPasswordState] = useState('');
  const [pwdLengthState, setPwdLengthState] = useState('');
  const [editingState, setEditingState] = useState({
    isEditing: false,
    editingpwdId: '',
  });
  const [errorMsgState, setErrorMsgState] = useState('');
  const [username, setUsername] = useState('');

  const [includeAlpha, setIncludeAlpha] = useState(false);
  const [includeNum, setIncludeNum] = useState(false);
  const [includeSym, setIncludeSym] = useState(false);

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
      if (!pwdURLState) {
        setErrorMsgState('URL is required!');
        return;
      }

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

  const generatePw = () => {
    if (!pwdPasswordState) {
      if (!includeAlpha && !includeNum && !includeSym) {
        setErrorMsgState('At least one checkbox must be checked');
        return;
      }
      if (pwdLengthState < 4 || pwdLengthState > 50) {
        setErrorMsgState('the length must be between 4 and 50, inclusive');
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
    navigate('/');
  }

  async function isLoggedIn() {
    try {
      const response = await axios.get('/api/users/loggedIn');
      const username = response.data.username;
      setUsername(username);
    } catch (e) {
      navigate('/');
    }
  }

  useEffect(onStart, []);

  const pwdListElement = [];
  for (let i = 0; i < pwdListState.length; i++) {
    pwdListElement.push(
      <li>
        URL: {pwdListState[i].URL}- password: {pwdListState[i].password}-{' '}
        <button onClick={() => deletePwd(pwdListState[i]._id)}>
          Delete
        </button>
        -{' '}
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
    : 'Add new password';

  if (!username) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="pmContainer">
        <div>
          <button onClick={logout}>Logout</button>
        </div>
        {errorMsgState && <h1>{errorMsgState}</h1>}
        Here are all your passwords, {username}!
        <ul>{pwdListElement}</ul>
        <div>
        <h4>{inputFieldTitleText}</h4>
        <br></br>
        </div>
        <div>
          <div>
            <label>URL:</label>{' '}
            <input
              value={pwdURLState}
              onInput={(event) => updatePwdURL(event)}
            />
          </div>
          <br></br>

          <div>
            <label>Password:</label>{' '}
            <input
              value={pwdPasswordState}
              onInput={(event) => updatePwdPassword(event)}
            />
            <button onClick={generatePw}>Generate Password</button>
          </div>
          <br></br>
          <div>
            <label>Length:</label>{' '}
            <input
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
            <button onClick={() => onCancel()}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordPage;
