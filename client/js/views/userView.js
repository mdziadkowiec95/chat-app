import { Button } from '../components/Button';
import { elements } from './elements';

const renderNewUserItem = (user) => `
    <li data-user-id="${user.socketId}">${user.userName}</li>
  `;

const displayBaseInfo = (userName, numberOfUsers) => {
  const html = `
    <p>Welcome, ${userName}</p>
    <p>Users online: ${numberOfUsers}</p>

    ${Button({
      text: 'Sample button',
      tag: 'unique-btn123',
      attrs: {
        id: '12312414',
        other: '14124',
        disabled: null,
      },
    })}
  `;

  elements.BASE_CHAT_INFO.insertAdjacentHTML('afterbegin', html);
};

const displayActiveUsers = (activeUsers) => {
  if (activeUsers && activeUsers.length > 0) {
    const html = activeUsers.map(renderNewUserItem).join('');
    elements.ACTIVE_USERS_LIST.insertAdjacentHTML('afterbegin', html);
  }
};

export const displayInitialInfo = (userName, numberOfUsers, activeUsers) => {
  displayBaseInfo(userName, numberOfUsers);
  displayActiveUsers(activeUsers);
};

export const getUserName = () => document.querySelector('form > input').value;
