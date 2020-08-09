import io from 'socket.io-client';
import { showAlert } from './views/test-view';

const socket = io('http://localhost:3000');

console.log(socket);

document.querySelector('.btn').addEventListener('click', showAlert);
