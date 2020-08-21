import { UserModel as UserModelCreator } from './UserModel';
import socket from '../socket';

// Initialize models in a single place to make sure it has only single instance
const UserModel = UserModelCreator(socket);

export { UserModel };
