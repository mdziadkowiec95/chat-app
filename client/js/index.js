import { showAlert } from './views/test-view';
import EVENTS from '../../common/socket-events';
import socket from './socket';

import '../scss/main.scss';

let isLoggedIn = false;

const handleAddUser = (e) => {
  e.preventDefault();

  const userName = document.querySelector('form > input').value;
  console.log(userName);
  socket.emit(EVENTS.USER_ADD, userName);
};

const createNewUserItem = (user) => {
  const el = document.createElement('li');
  el.setAttribute('data-user-id', user.socketId);
  el.textContent = user.userName;
  return el;
};

const displayActiveUsers = (createdUser) => {
  const list = document.getElementById('active-users');

  list.appendChild(createNewUserItem(createdUser));
};

const displayInitialUserList = ({ userName, numberOfUsers, activeUsers }) => {
  document.getElementById('user-name').textContent = userName;
  document.getElementById('number-of-users').textContent = numberOfUsers;

  const list = document.getElementById('active-users');

  activeUsers.forEach((user) => list.appendChild(createNewUserItem(user)));
};

const handleUserLogIn = (data) => {
  isLoggedIn = true;

  displayInitialUserList(data);
};

const updateActiveUsers = ({ numberOfUsers, createdUser }) => {
  if (isLoggedIn) {
    document.getElementById('number-of-users').textContent = numberOfUsers;
    displayActiveUsers(createdUser);
  }
};

const handleUserDisconnect = ({ socketId, userName }) => {
  const listEl = document.getElementById('active-users');
  const userEl = listEl.querySelector(`li[data-user-id=${socketId}`);

  if (userEl) listEl.removeChild(userEl);

  // TODO
  // 1. apply push notification informing that user has disconnected the chat
};

// Update active users only when current client has already logged in

socket.on(EVENTS.USER_JOINED, updateActiveUsers);

socket.on(EVENTS.USERS_INITIAL_UPDATE, handleUserLogIn);

socket.on(EVENTS.USER_DISCONNECTED, handleUserDisconnect);

socket.on(EVENTS.USER_EXISTS, ({ userName }) => {
  alert(`${userName} is already active in the chat!`);
});

socket.on(EVENTS.USER_NAME_ALREADY_TAKEN, ({ userName }) => {
  alert(`Name "${userName}" is already taken!`);
});

document.querySelector('form').addEventListener('submit', handleAddUser);
document.querySelector('.btn').addEventListener('click', showAlert);
