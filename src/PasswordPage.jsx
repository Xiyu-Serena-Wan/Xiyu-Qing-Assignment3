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
          </div>
          <br></br>
          <div>
            <label>Length:</label>{' '}
            <input
              value={pwdPasswordState}
              onInput={(event) => updatePwdPassword(event)}
            />
          </div>
          <br></br>

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
