import EVENTS from '../../../common/socket-events';

export const UserModel = (socket) => {
  const state = {
    isLoggedIn: false,
  };

  function loginUser() {
    state.isLoggedIn = true;
  }

  document
    .getElementById('get-users-from-repository')
    .addEventListener('click', () => {
      socket.emit('get-users');
    });

  socket.on('get-users-return', (data) => {
    console.log(data);
  });

  return {
    handleAddUser(userName) {
      socket.emit(EVENTS.USER_ADD, userName);
    },
    handlePersistUser(userId, userName) {
      socket.emit(
        EVENTS.USER_PERSIST_ATTEMPT,
        { userId, userName },
        (persistSuccess) => {
          if (persistSuccess) loginUser();
        }
      );
    },
    loginUser,
    isUserLoggedIn() {
      return state.isLoggedIn;
    },
  };
};
