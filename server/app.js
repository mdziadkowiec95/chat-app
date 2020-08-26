import express from 'express';
import { createServer } from 'http';
import socketIO from 'socket.io';
import path from 'path';
import EVENTS from '../common/socket-events';
import usersRepo from './users-repository';
import socketControllerFactory from './socket-controller';

const app = express();
const http = createServer(app);
const io = socketIO(http);
const usersRepository = usersRepo.getInstance();

io.on('connect', (socket) => {
  console.log('a new user (socket) connected');

  socket.emit('test_server', 'server is connected to the client!!!');

  const socketController = socketControllerFactory(io, socket, usersRepository);

  // Setup socket disconnection listener
  socket.on('disconnect', socketController.handleDisconnect);

  // Debug user list
  socket.on('get-users', () => {
    socket.emit('get-users-return', usersRepository.getUsers());
  });

  // Setup adding new user listener
  socket.on(EVENTS.USER_PERSIST_ATTEMPT, socketController.getPersistedUser);
  socket.on(EVENTS.USER_ADD, socketController.handleUserAdd);
});

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => {
  console.log(`Socket chat app listening at http://localhost:${PORT}`);
});
