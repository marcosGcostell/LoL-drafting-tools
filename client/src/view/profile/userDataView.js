import View from '../global/view.js';

export default class UserDataView extends View {
  _parentElement;

  constructor() {
    super();

    this.form = document.querySelector('.user__profile');
    this.passwordPopup = document.querySelector('.password__popup');
    this.passwordInput = document.querySelector('#password');
    this.newPasswordInput = document.querySelector('#new__password');
    this.confirmPasswordInput = document.querySelector('#confirm__password');
    this.passwordPopup.addEventListener('click', e => e.stopPropagation());

    this.userMsg = 'Check your username or email before saving the data';

    this.isActive = {
      username: false,
      email: false,
    };
    this.isPanelShowed = false;
  }

  init({ name, userName, email, config }) {
    document.querySelector('#name').value = name || '';
    document.querySelector('#username').value = userName || '';
    document.querySelector('#email').value = email || '';
    this._setMaxItems(config?.maxListItems);
    this._setPickRateThreshold(config?.pickRateThreshold);
  }

  addHandlerBtn(target, handler) {
    document
      .querySelector(`#${target}__btn`)
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler(target);
      });
  }

  addHandlerInput(target, handler) {
    document
      .querySelector(`#${target}`)
      .addEventListener('input', function (e) {
        e.preventDefault();
        handler(target);
      });
  }

  addHandlerCommit(target, handler) {
    document
      .querySelector(`#${target}`)
      .addEventListener('change', function (e) {
        e.preventDefault();
        handler(e.target.value);
      });
  }

  togglePanel() {
    this.passwordInput.value = '';
    this.newPasswordInput.value = '';
    this.confirmPasswordInput.value = '';

    this.passwordPopup.classList.toggle('hidden');

    this.isPanelShowed = !this.isPanelShowed;
    if (this.isPanelShowed) {
      this.passwordInput.focus();
    }
  }

  // Pass handler to activate. Omit handler to disable
  async changeCheckBtn(target, handler = null) {
    if (this.isActive[target] === (handler !== null)) return;

    const btn = document.querySelector(`#${target}__btn`);
    this._parentElement = btn.parentElement;

    const action = handler ? 'activate' : 'disable';
    await this.render([target, action], { noClear: true });
    btn.remove();

    this.isActive[target] = !!handler;
    if (handler) this.addHandlerBtn(target, handler);
  }

  setFocus(target) {
    const input = document.querySelector(`#${target}`);
    if (input) {
      input.focus();
      input.select();
    }
  }

  clearInput(target) {
    const input = document.querySelector(`#${target}`);
    if (input) {
      if (target === 'password') {
        ['', 'new__password', 'confirm__password'].forEach(id => {
          const passInput = document.querySelector(`#${id}`);
          if (passInput) {
            passInput.value = '';
          }
        });
      } else {
        input.value = '';
      }
    }
  }

  async _generateMarkup(_) {
    const [target, mode] = this._data;
    return mode === 'activate'
      ? this._generateActiveMarkup(target)
      : this._generateDisabledMarkup(target);
  }

  _generateActiveMarkup(target) {
    return `<button id="${target}__btn" class="selector__clickable">Check</button>`;
  }

  _generateDisabledMarkup(target) {
    return `<div id="${target}__btn" class="inline__btn">
          <svg>
            <use href="assets/img/icons/icons.svg#icon-check"></use>
          </svg>
        </div>`;
  }

  setMaxItems(value) {
    if (!value || isNaN(value) || value < 1) return;
    const maxItemsElement = document.querySelector('#max-items');
    maxItemsElement.value = value.toFixed(0);
    maxItemsElement.blur();
  }

  setPickRateThreshold(value) {
    if (!value || isNaN(value) || value < 1) return;
    const pickRateElement = document.querySelector('#min-pr');
    pickRateElement.value = value.toFixed(1);
    pickRateElement.blur();
  }

  showPasswordMsg(message) {
    const msgElement = document.querySelector('#password__msg');
    if (msgElement) msgElement.textContent = message;
  }

  showUserMsg(message) {
    const msgElement = document.querySelector('#user__msg');
    if (msgElement) msgElement.textContent = message;
  }

  resetUserMsg() {
    const msgElement = document.querySelector('#user__msg');
    if (msgElement) msgElement.textContent = this.userMsg;
  }
}
