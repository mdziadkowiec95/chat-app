const usersRepository = (function () {
  let instance;

  function createInstance() {
    const state = {
      users: [],
    };

    return {
      getState() {
        return state;
      },
      createUser(socketId, userName) {
        const user = {
          socketId,
          userName,
        };

        state.users.push(user);

        return user;
      },
      isUserNameAlreadyTaken(userName) {
        return state.users.find((user) => user.userName === userName);
      },
      deleteUser(socketId) {
        state.users = state.users.filter((user) => user.socketId !== socketId);
      },
      getUsers() {
        return state.users;
      },
      getUsersWithoutCurrentClient(socketId) {
        return state.users.filter((user) => user.socketId !== socketId);
      },
      getNumberOfUsers() {
        return state.users.length;
      },
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    },
  };
})();

export default usersRepository;
