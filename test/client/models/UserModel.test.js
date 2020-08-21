import { UserModel as UserModelCreator } from '../../../client/js/models/UserModel';
import EVENTS from '../../../common/socket-events';

describe('[client] models/UserModel', () => {
  it('should create UserModel instance properly', () => {
    const UserModel = UserModelCreator({});
    expect(UserModel).toBeTruthy();
  });

  it('should emit ADD_USER event property', () => {
    const socket = {
      emit: (event, userName) => {
        socket.event = event;
        socket.userName = userName;
      },
    };
    const UserModel = UserModelCreator(socket);

    UserModel.handleAddUser('Mike Tyson');

    expect(socket.userName).toEqual('Mike Tyson');
    expect(socket.event).toEqual(EVENTS.USER_ADD);
  });

  it('should have user state as NOT logged in at the beginning', () => {
    const UserModel = UserModelCreator({});
    expect(UserModel.isUserLoggedIn()).toEqual(false);
  });

  it('should log in user properly', () => {
    const UserModel = UserModelCreator({});
    UserModel.loginUser();
    expect(UserModel.isUserLoggedIn()).toEqual(true);
  });
});
