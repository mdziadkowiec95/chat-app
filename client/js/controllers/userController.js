import { userView } from '../views';
import { UserModel } from '../models';
import socket from '../socket';
import EVENTS from '../../../common/socket-events';

const LOCAL_STORAGE_USER_NAME = 'mdz95-socket-chat-app-user-name';

function _handleAddUser(e) {
  e.preventDefault();

  const userName = userView.getUserName();

  UserModel.handleAddUser(userName);
}

function _handleUserLogIn({ userName, numberOfUsers, activeUsers }) {
  localStorage.setItem(LOCAL_STORAGE_USER_NAME, userName);

  UserModel.loginUser();
  userView.handleUserLogin(userName, numberOfUsers, activeUsers);
}

function _getPersistedUser() {
  const persistedUserName = localStorage.getItem(LOCAL_STORAGE_USER_NAME);

  if (persistedUserName) {
    UserModel.handlePersistUser(persistedUserName);
  }
}
// Socket and Event listeners init functions
function _setupSocketListeners() {
  socket.on(EVENTS.USERS_INITIAL_UPDATE, _handleUserLogIn);
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
