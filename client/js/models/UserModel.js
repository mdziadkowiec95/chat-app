import EVENTS from '../../../common/socket-events';

export const UserModel = (socket) => {
  const state = {
    isLoggedIn: false,
  };

  function _setIsLoggedIn(isLoggedIn) {
    state.isLoggedIn = isLoggedIn;
  }

  return {
    handleAddUser(userName) {
      socket.emit(EVENTS.USER_ADD, userName);
    },
    loginUser() {
      _setIsLoggedIn(true);
    },
    isUserLoggedIn() {
      return state.isLoggedIn;
    },
  };
};
