/**
 * @fileoverview This file contains a single place of truth for the Socket.io event names
 */

const EVENTS = {
  USER_ADD: 'USER_ADD',
  USER_EXISTS: 'USER_EXISTS',
  USER_NAME_ALREADY_TAKEN: 'USER_NAME_ALREADY_TAKEN',
  USER_JOINED: 'USER_JOINED',
  USER_DISCONNECTED: 'USER_DISCONNECTED',
  USERS_INITIAL_UPDATE: 'USERS_INITIAL_UPDATE',
  CHAT_MESSAGE_SENT: 'CHAT_MESSAGE_SENT',
};

export default EVENTS;
