import { Button } from '../components/Button';
import { elements } from './elements';
import { removeElement } from '../helpers/DOM';
import { selectors } from './selectors';

const renderNewUserItem = (user) =>
  `<li data-user-id="${user.userId}">${user.userName}</li>`;

const displayBaseInfo = (userName, numberOfUsers) => {
  const html = `
    <p>Welcome, ${userName}</p>
    <p id="number-of-users">Users online: ${numberOfUsers}</p>

    ${Button({
      text: 'Sample buttonfs',
      tag: 'unique-btn123',
      attrs: {
        id: 'get-users',
        other: '14124',
        disabled: null,
      },
    })}
  `;

  elements.BASE_CHAT_INFO.innerHTML = html;
};

const displayActiveUsers = (activeUsers) => {
  if (activeUsers && activeUsers.length > 0) {
    const html = activeUsers.map(renderNewUserItem).join('');
    elements.ACTIVE_USERS_LIST.insertAdjacentHTML('afterbegin', html);
  }
};

export const handleUserLogin = (userName, numberOfUsers, activeUsers) => {
  removeElement(elements.LOGIN_FORM);
  displayBaseInfo(userName, numberOfUsers);
  displayActiveUsers(activeUsers);
};

export const getUserName = () =>
  document.querySelector(selectors.LOGIN_INPUT).value;
