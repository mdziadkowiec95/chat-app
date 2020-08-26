import React, { useEffect, useState } from 'react';
import './App.css';
import { socket, EVENTS } from './socket-io';

const LOCAL_STORAGE_USER_ID = 'mdz95-socket-chat-app-user-id';
const LOCAL_STORAGE_USER_NAME = 'mdz95-socket-chat-app-user-name';

const INITIAL_USER_STATE = {
  isLogged: false,
  userId: null,
  userName: null,
  numberOfUsers: 0,
  activeUsers: [],
};

function App() {
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(INITIAL_USER_STATE);

  useEffect(() => {
    socket.on('test_server', (data) => {
      console.log(data);
    });

    socket.on(EVENTS.USERS_INITIAL_UPDATE, _handleUserLogIn);
  }, []);

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleUserLoginSubmit = (e) => {
    e.preventDefault();

    socket.emit(EVENTS.USER_ADD, userName);
  };

  const _handleUserLogIn = ({
    userId,
    userName,
    numberOfUsers,
    activeUsers,
  }) => {
    console.log({ userId, userName, numberOfUsers, activeUsers });
    localStorage.setItem(LOCAL_STORAGE_USER_ID, userId);
    localStorage.setItem(LOCAL_STORAGE_USER_NAME, userName);

    setUser({ isLogged: true, userId, userName, numberOfUsers, activeUsers });
  };
  return (
    <div className="App">
      {!user.isLogged && (
        <form onSubmit={handleUserLoginSubmit}>
          <input
            onChange={handleNameChange}
            onFocus={handleNameChange}
            placeholder="Enter your nickname"
            value={userName}
          />
        </form>
      )}
      {user.userName && <p>{user.userName}</p>}
    </div>
  );
}

export default App;
