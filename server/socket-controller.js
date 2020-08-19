import EVENTS from '../common/socket-events';

export default (socket, usersRepository) => {
  // State of the current user (socket)
  const userState = {
    isAdded: false,
  };

  return {
    handleDisconnect() {
      if (userState.isAdded) {
        usersRepository.deleteUser(socket.id);

        // Emit to other users that current user has disconnected
        socket.broadcast.emit(EVENTS.USER_DISCONNECTED, {
          socketId: socket.id,
          userName: socket.userName,
        });
      }
      console.log(`User "${socket.userName}" disconnected`);
    },

    handleUserAdd(userName) {
      userName = userName.trim();

      if (userState.isAdded) {
        return socket.emit(EVENTS.USER_EXISTS, { userName: socket.userName });
      } else if (usersRepository.isUserNameAlreadyTaken(userName)) {
        return socket.emit(EVENTS.USER_NAME_ALREADY_TAKEN, { userName });
      }

      socket.userName = userName;

      // Add new user to the list of active users
      const createdUser = usersRepository.createUser(
        socket.id,
        socket.userName
      );

      userState.isAdded = true;

      // Emit global event with app state details
      socket.broadcast.emit(EVENTS.USER_JOINED, {
        numberOfUsers: usersRepository.getNumberOfUsers(),
        createdUser: createdUser,
      });

      // Emit an event (only to current socket) after current user is logged in
      socket.emit(EVENTS.USERS_INITIAL_UPDATE, {
        userName: socket.userName,
        numberOfUsers: usersRepository.getNumberOfUsers(),
        activeUsers: usersRepository.getUsersWithoutCurrentClient(socket.id),
      });

      console.log('users', usersRepository.getState());
    },
  };
};
