import socket from '../socket';

export const withSocket = (fn) => {
  fn();
};
