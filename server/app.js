import { createServer } from 'http';
import socketIO from 'socket.io';
import path from 'path';
import EVENTS from '../common/socket-events';

// Gloabl state of the application
const state = {
  users: [],
};

function createUser(socketId, userName) {
  return {
    socketId,
    userName,
  };
}

function deleteUser(socketId) {
  state.users = state.users.filter((user) => user.socketId !== socketId);
}

export const initApp = (app) => {
  const http = createServer(app);
  const io = socketIO(http);

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
  });

  io.on('connection', (socket) => {
    // State of the current user
    const userState = {
      isAdded: false,
    };

    console.log('a user connected');

    socket.on('disconnect', () => {
      deleteUser(socket.id);
      console.log('user disconnected');
    });

    socket.on(EVENTS.USER_ADD, (userName) => {
      if (userState.isAdded) {
        return socket.emit(EVENTS.USER_EXISTS, { userName: socket.userName });
      }

      socket.userName = userName;

      // Add new user to the list of active users
      state.users.push(createUser(socket.id, socket.userName));

      userState.isAdded = true;

      // echo globally (all clients) that a person has connected
      socket.emit(EVENTS.USER_JOINED, {
        userName: socket.userName,
        numberOfUsers: state.users.length,
        activeUsers: state.users,
      });
      console.log(socket.userName, state);
    });
  });

  const PORT = process.env.PORT || 3000;

  http.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });

  return app;
};
