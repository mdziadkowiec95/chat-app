import { createServer } from 'http';
import socketIO from 'socket.io';
import path from 'path';
import EVENTS from '../common/socket-events';
import usersRepo from './users-repository';

export const initApp = (app) => {
  const http = createServer(app);
  const io = socketIO(http);
  const usersRepository = usersRepo.getInstance();

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
  });

  io.on('connection', (socket) => {
    // State of the current user
    const userState = {
      isAdded: false,
    };

    console.log('a user connected');
    console.log(usersRepository.getUsers());
    socket.on('disconnect', () => {
      if (userState.isAdded) {
        usersRepository.deleteUser(socket.id);

        // Emit to other users that current user has disconnected
        socket.broadcast.emit(EVENTS.USER_DISCONNECTED, {
          socketId: socket.id,
          userName,
        });
      }
      console.log('user disconnected');
    });

    socket.on(EVENTS.USER_ADD, (userName) => {
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
    });
  });

  const PORT = process.env.PORT || 3000;

  http.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });

  return app;
};
