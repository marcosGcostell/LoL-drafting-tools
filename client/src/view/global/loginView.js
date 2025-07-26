import View from './view.js';
import { LOGIN_PAGE_TEMPLATE } from '../../utils/config.js';

export default class LoginView extends View {
  _parentElement;

  constructor() {
    super();
    this._parentElement = document.querySelector('main');
    this._errorMessage = '';
    this._template = null;
    this._templatePromise = fetch(LOGIN_PAGE_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._template = data;
        return data;
      });
  }

  set errorMessage(message) {
    this._errorMessage = message;
  }

  async initView() {
    if (!this._template) await this._templatePromise;

    await this.render(true);

    this._parentElement = document.querySelector('.login__msg');
    this.userInput = document.querySelector('#user__logname');
    this.passwordInput = document.querySelector('#user__password');
    this.userInput.value = '';
    this.passwordInput.value = '';

    // Reset error message when focus on inputs
    [this.userInput, this.passwordInput].forEach(el =>
      el.addEventListener('focus', _ => {
        this._clear();
      }),
    );

    this.userInput.focus();
  }

  _generateMarkup(_) {
    return this._template;
  }

  addHandleBtn(target, handler) {
    document.querySelector(`.btn__${target}`).addEventListener('click', e => {
      e.preventDefault();
      handler();
    });
  }

  addHandlerForm(handler) {
    document.querySelector('#login__form').addEventListener('submit', e => {
      e.preventDefault();
      handler(e);
    });
  }
}
