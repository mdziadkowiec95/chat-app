import { userView } from '../views';
import { UserModel } from '../models';
import socket from '../socket';
import EVENTS from '../../../common/socket-events';

const LOCAL_STORAGE_USER_ID = 'mdz95-socket-chat-app-user-id';
const LOCAL_STORAGE_USER_NAME = 'mdz95-socket-chat-app-user-name';

// This needs to be moved into userView module
const createNewUserItem = (user) => {
  const el = document.createElement('li');
  el.setAttribute('data-user-id', user.userId);
  el.textContent = user.userName;
  return el;
};

const displayActiveUsers = (createdUser) => {
  const list = document.getElementById('active-users');

  list.appendChild(createNewUserItem(createdUser));
};

const updateActiveUsers = ({ numberOfUsers, createdUser }) => {
  if (UserModel.isUserLoggedIn()) {
    document.getElementById('number-of-users').textContent = numberOfUsers;
    displayActiveUsers(createdUser);
  }
};

// This was OK
function _handleAddUser(e) {
  e.preventDefault();

  const userName = userView.getUserName();

  UserModel.handleAddUser(userName);
}

function _handleUserLogIn({ userId, userName, numberOfUsers, activeUsers }) {
  console.log({ userId, userName, numberOfUsers, activeUsers });
  localStorage.setItem(LOCAL_STORAGE_USER_ID, userId);
  localStorage.setItem(LOCAL_STORAGE_USER_NAME, userName);

  UserModel.loginUser();
  userView.handleUserLogin(userName, numberOfUsers, activeUsers);
}

function _getPersistedUser() {
  const userId = localStorage.getItem(LOCAL_STORAGE_USER_ID);
  const userName = localStorage.getItem(LOCAL_STORAGE_USER_NAME);

  UserModel.handlePersistUser(userId, userName);
}
// Socket and Event listeners init functions
function _setupSocketListeners() {
  socket.on(EVENTS.USERS_INITIAL_UPDATE, _handleUserLogIn);
  socket.on(EVENTS.USER_JOINED, updateActiveUsers);
}

function _setupDOMListeners() {
  window.addEventListener('load', _getPersistedUser);
  document
    .getElementById('login-form')
    .addEventListener('submit', _handleAddUser);
}

export const registerUserController = () => {
  _setupSocketListeners();
  _setupDOMListeners();
};
