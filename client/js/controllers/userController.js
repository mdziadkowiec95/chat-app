import { userView } from '../views';
import { UserModel } from '../models';
import socket from '../socket';
import EVENTS from '../../../common/socket-events';

function _handleAddUser(e) {
  e.preventDefault();

  const userName = userView.getUserName();
  UserModel.handleAddUser(userName);
}

function _handleUserLogIn({ userName, numberOfUsers, activeUsers }) {
  UserModel.loginUser();
  userView.handleUserLogin(userName, numberOfUsers, activeUsers);
}

// Socket and Event listeners init functions
function _setupSocketListeners() {
  socket.on(EVENTS.USERS_INITIAL_UPDATE, _handleUserLogIn);
}

function _setupDOMListeners() {
  document
    .getElementById('login-form')
    .addEventListener('submit', _handleAddUser);
}

export const registerUserController = () => {
  _setupSocketListeners();
  _setupDOMListeners();
};
