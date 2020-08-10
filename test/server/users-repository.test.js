import usersRepository from '../../server/users-repository';

describe('usersRepository', () => {
  let usersRepo;

  beforeEach(() => {
    usersRepo = usersRepository.getInstance();
  });

  it('should NOT create more than one instance (singleton pattern check)', () => {
    const usersRepoSecondInstance = usersRepository.getInstance();
    expect(usersRepo).toEqual(usersRepoSecondInstance);
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

  it('should add a new user to the users array', () => {
    const user = usersRepo.createUser('12345', 'Mike');

    expect(usersRepo.getUsers()).toEqual(expect.arrayContaining([user]));
  });
});
