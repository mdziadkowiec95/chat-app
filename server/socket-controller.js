import EVENTS from '../common/socket-events';
import { v4 as uuid } from 'uuid';
import { prettyPrint } from '../common/helpers/debug';

export default (io, socket, usersRepository) => {
  // A helper function to emit to all user sockets
  function emitToUser(sockets, eventName, eventData = null) {
    if (sockets && sockets.length) {
      sockets.forEach((socket) => {
        io.to(socket).emit(eventName, eventData);
      });
    }
  }

  function handleDisconnect() {
    usersRepository.deleteSocket(socket.userId, socket.id);

    if (!usersRepository.isUserActive(socket.userId)) {
      // Emit to other users that current user has disconnected
      socket.broadcast.emit(EVENTS.USER_DISCONNECTED, {
        userId: socket.userId,
        userName: socket.userName,
        numberOfUsers: usersRepository.getNumberOfUsers(),
      });
    }

    console.log(`User "${socket.userName}" disconnected`);
  }

  function getPersistedUser({ userId, userName }, setIsPersistedCb) {
    console.log(userId, userName);
    if (userId && usersRepository.isUserActive(userId)) {
      console.log('---- persisting by USER ID -----------');
      const activeUser = usersRepository.updateActiveUserAndReturn(
        userId,
        socket.id
      );

      socket.userId = userId;
      socket.userName = activeUser.userName;

      // Emit an event (only to current socket) after current user is logged in
      emitToUser(activeUser.sockets, EVENTS.USERS_INITIAL_UPDATE, {
        userId: socket.userId,
        userName: socket.userName,
        numberOfUsers: usersRepository.getNumberOfUsers(),
        activeUsers: usersRepository.getUsersWithoutCurrentClient(userId),
      });

      setIsPersistedCb(true);

      prettyPrint(usersRepository.getUsers());
    } else if (userName && !usersRepository.isUserNameAlreadyTaken(userName)) {
      console.log('---- persisting by USER NAME -----------');
      handleUserAdd(userName);
    } else {
      console.log('---- NOT persisting -----------');
      setIsPersistedCb(false);
    }
  }

  function handleUserAdd(userName) {
    userName = userName.trim();

    if (usersRepository.isUserNameAlreadyTaken(userName)) {
      return socket.emit(EVENTS.USER_NAME_ALREADY_TAKEN, { userName });
    }
    socket.userId = uuid();
    socket.userName = userName;

    try {
      // Add new user to the list of active users
      const createdUser = usersRepository.createUser(
        socket.id,
        socket.userName,
        socket.userId
      );
      // Emit global event with app state details
      socket.broadcast.emit(EVENTS.USER_JOINED, {
        numberOfUsers: usersRepository.getNumberOfUsers(),
        createdUser,
      });

      // Emit an event (only to current socket) after current user is logged in

      emitToUser(createdUser.sockets, EVENTS.USERS_INITIAL_UPDATE, {
        userId: socket.userId,
        userName: socket.userName,
        numberOfUsers: usersRepository.getNumberOfUsers(),
        activeUsers: usersRepository.getUsersWithoutCurrentClient(
          socket.userId
        ),
      });
    } catch (error) {
      console.error(error);
      // Emit an event informing that there was an Error when creating new user
    }
  }

  return {
    handleDisconnect,
    handleUserAdd,
    getPersistedUser,
  };
};
