import usersRepository from '../../server/users-repository';

function removeAllUsers(users, deleteUserFn) {
  users.forEach((user) => deleteUserFn(user.socketId));
}

describe('[server] usersRepository', () => {
  let usersRepo;

  beforeEach(() => {
    usersRepo = usersRepository.getInstance();
  });

  it('should NOT create more than one instance (singleton pattern check)', () => {
    const usersRepoSecondInstance = usersRepository.getInstance();
    expect(usersRepo).toEqual(usersRepoSecondInstance);
  });

  it('should return the entire state object properly', () => {
    expect(usersRepo.getState()).toEqual({
      users: [],
    });
  });

  it('should return no users as initial state', () => {
    expect(usersRepo.getUsers()).toEqual([]);
  });

  it('should create a new user properly', () => {
    const user = usersRepo.createUser('12345', 'Mike');

    expect(user).toEqual(
      expect.objectContaining({
        socketId: '12345',
        userName: 'Mike',
      })
    );
  });

  it('should add a new user to the state', () => {
    const user = usersRepo.createUser('12345', 'Mike');

    expect(usersRepo.getUsers()).toEqual(expect.arrayContaining([user]));
  });

  it('should delete a user from the state correctly', () => {
    usersRepo.createUser('777', 'Joe will be removed');
    usersRepo.deleteUser('777');

    expect(usersRepo.getUsers()).toEqual(
      expect.not.arrayContaining([
        {
          socketId: '777',
          userName: 'Joe will be removed',
        },
      ])
    );
  });

  it('should return number of active users correctly', () => {
    ['Mike', 'Joe', 'Will', 'Greg'].forEach((user, i) =>
      usersRepo.createUser(i, user)
    );

    expect(usersRepo.getNumberOfUsers()).toEqual(4);
  });

  it('should check if user name is already taken correctly - TRUE scenario', () => {
    usersRepo.createUser('1234', 'The one and only Mike');

    expect(usersRepo.isUserNameAlreadyTaken('The one and only Mike')).toEqual(
      true
    );
  });

  it('should check if user name is already taken correctly - FALSE scenario', () => {
    usersRepo.createUser('1234', 'The one and only Mike');

    expect(usersRepo.isUserNameAlreadyTaken('Different mike')).toEqual(false);
  });

  it('should return correct users state', () => {
    ['Mike', 'Joe'].forEach((user, i) => usersRepo.createUser(`${i}`, user));
    expect(usersRepo.getUsers()).toEqual([
      { socketId: '0', userName: 'Mike' },
      { socketId: '1', userName: 'Joe' },
    ]);
  });

  it('should return users without current socket (client) correctly', () => {
    usersRepo.createUser('1', 'Some user');
    usersRepo.createUser('2', 'Current user');
    usersRepo.createUser('3', 'Some yet other user');

    const otherUsers = usersRepo.getUsersWithoutCurrentClient('2');

    expect(otherUsers).toEqual(
      expect.not.arrayContaining([{ socketId: '2', userName: 'Current user' }])
    );
    expect(otherUsers.length).toEqual(2);
  });

  afterEach(() => removeAllUsers(usersRepo.getUsers(), usersRepo.deleteUser));
});
