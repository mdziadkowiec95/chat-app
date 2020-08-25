import EVENTS from '../../common/socket-events';
import { registerControllers } from './controllers';
import socket from './socket';

import '../scss/main.scss';

registerControllers();

let isLoggedIn = false;

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

const handleUserDisconnect = ({ userId, userName, numberOfUsers }) => {
  console.log({ userId, userName });
  const listEl = document.getElementById('active-users');
  const userEl = listEl.querySelector(`li[data-user-id="${userId}"`);
  document.getElementById('number-of-users').textContent = numberOfUsers;

  if (userEl) listEl.removeChild(userEl);

  // TODO
  // 1. apply push notification informing that user has disconnected the chat
};

// Update active users only when current client has already logged in

socket.on(EVENTS.USER_DISCONNECTED, handleUserDisconnect);

socket.on(EVENTS.USER_EXISTS, ({ userName }) => {
  alert(`${userName} is already active in the chat!`);
});

socket.on(EVENTS.USER_NAME_ALREADY_TAKEN, ({ userName }) => {
  alert(`Name "${userName}" is already taken!`);
});
