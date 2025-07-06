import View from './view.js';

export default class HeaderView extends View {
  constructor() {
    super();
  }

  addHandlerUserBtn(handler) {
    document
      .querySelector('.header__users')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler(e);
      });
  }

  showUserName(userName) {
    document.querySelector('.header__username span').textContent = userName;
  }
}
