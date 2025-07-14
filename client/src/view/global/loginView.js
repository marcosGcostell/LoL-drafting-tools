import View from './view.js';

export default class LoginView extends View {
  constructor() {
    super();
    this.isModalShowed = false;
    this._errorMessage = '';
  }

  set errorMessage(message) {
    this._errorMessage = message;
  }

  initView() {
    this._modalElement = document.querySelector('#login-modal');
    this._parentElement = document.querySelector('.login__msg');
    this.userInput = document.querySelector('#user__logname');
    this.passwordInput = document.querySelector('#user__password');
    this._modalElement.classList.add('hidden');

    // Reset error message when focus on inputs
    [this.userInput, this.passwordInput].forEach(el =>
      el.addEventListener('focus', e => {
        this._clear();
      }),
    );
  }

  addHandlerUserBtn(handler) {
    document
      .querySelector('.header__users')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler(e);
      });
  }

  addHandlerModalBtns(target, handler) {
    document
      .querySelector(`.btn__${target}`)
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
  }

  addHandlerForm(handler) {
    this._modalElement
      .querySelector('form')
      .addEventListener('submit', function (e) {
        e.preventDefault();
        handler(e);
      });
  }

  addHandlerModalBackground() {
    this._modalElement.addEventListener('click', function (e) {
      e.stopImmediatePropagation();
    });
  }

  toggleModal() {
    this._clear();
    this.userInput.value = '';
    this.passwordInput.value = '';
    this._modalElement.classList.toggle('hidden');

    this.isModalShowed = !this.isModalShowed;
    if (this.isModalShowed) {
      this.userInput.focus();
    }
  }

  closeModal() {
    this._clear();
    this.userInput.value = '';
    this.passwordInput.value = '';
    this._modalElement.classList.add('hidden');

    this.isModalShowed = false;
  }
}
