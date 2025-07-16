import View from './view.js';

export default class HeaderView extends View {
  addHandlerUserBtn(handler) {
    document.querySelector('.header__users').addEventListener('click', e => {
      e.preventDefault();
      handler(e);
    });
  }

  showUserName(username) {
    document.querySelector('.header__username span').textContent = username;
  }
}
