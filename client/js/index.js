import { showAlert } from './views/test-view';
import EVENTS from '../../common/socket-events';
import socket from './socket';

const handleAddUser = (e) => {
  e.preventDefault();

  const userName = document.querySelector('form > input').value;
  console.log(userName);
  socket.emit(EVENTS.USER_ADD, userName);
};

const displayUserData = ({ userName, numberOfUsers, activeUsers }) => {
  console.log(userName, numberOfUsers, activeUsers);
  document.getElementById('user-name').textContent = userName;
  document.getElementById('number-of-users').textContent = numberOfUsers;
};

socket.on(EVENTS.USER_JOINED, displayUserData);

socket.on(EVENTS.USER_EXISTS, ({ userName }) => {
  alert(`${userName} is already active in the chat!`);
});

document.querySelector('form').addEventListener('submit', handleAddUser);

document.querySelector('.btn').addEventListener('click', showAlert);
