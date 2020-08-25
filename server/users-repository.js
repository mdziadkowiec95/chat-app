const usersRepository = (function () {
  let instance;

  function createInstance() {
    const users = {};

    return {
      createUser(socketId, userName, userId) {
        if (!users[userId]) {
          users[userId] = {
            userId,
            userName,
            sockets: [socketId],
          };
          return users[userId];
        } else {
          throw new Error(
            `User "${userName}" already exists. Socket ID: ${socketId}, User ID: ${userId}`
          );
        }
      },
      isUserActive(userId) {
        return !!users[userId];
      },
      updateActiveUserAndReturn(userId, socketId) {
        users[userId].sockets.push(socketId);
        return users[userId];
      },
      isUserNameAlreadyTaken(userName) {
        return !!Object.values(users).find(
          (user) => user.userName === userName
        );
      },
      deleteSocket(userId, socketId) {
        if (users[userId]) {
          console.log('sockets BEFORE -> ', users[userId].sockets);
          users[userId].sockets = users[userId].sockets.filter(
            (socket) => socket !== socketId
          );
          console.log('sockets AFTER -> ', users[userId].sockets);
          if (!users[userId].sockets.length) delete users[userId];
        }
      },
      getUsers() {
        return users;
      },
      getUsersWithoutCurrentClient(userId) {
        const otherUsers = { ...users };

        if (otherUsers[userId]) delete otherUsers[userId];

        return Object.values(otherUsers);
      },
      getNumberOfUsers() {
        return Object.keys(users).length;
      },
      emitToUser(userId, eventName, eventData) {
        users[userId].sockets.forEach((socketId) => {
          socket.emit(eventName, eventData);
        });
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
