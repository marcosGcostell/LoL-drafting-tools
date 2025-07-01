import View from './view.js';

class LoginView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.login__msg');
    this.userInput = document.querySelector('#user__logname');
    this.passwordInput = document.querySelector('#user__password');
    this.isModalShowed = false;
  }

  addHandlerUserBtn(handler) {
    document
      .querySelector('.header__users')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler(e);
      });
  }

  toggleModal() {
    this._clear();
    this.userInput.value = '';
    this.passwordInput.value = '';
    document.querySelector('#login-modal').classList.toggle('hidden');

    this.isModalShowed = !this.isModalShowed;
    if (this.isPanelShowed) {
      this._userInput.focus();
    }
  }

  reset() {
    this.isModalShowed = false;
    document.querySelector('#login-modal').classList.add('hidden');
  }
}

export default new LoginView();
