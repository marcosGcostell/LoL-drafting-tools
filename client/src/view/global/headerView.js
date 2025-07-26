export default class HeaderView {
  constructor() {
    this.loginMode = '';
  }

  addHandlerBtn(target, handler) {
    document.querySelector(`#${target}__btn`).addEventListener('click', e => {
      e.preventDefault();
      handler(e);
    });
  }

  toggleMode(username = '') {
    const userText = username || 'Not logged in';
    document.querySelector('.header__username span').textContent = userText;
    document.querySelector('#login__btns').classList.toggle('hidden');
    document.querySelector('#user__navbar').classList.toggle('hidden');
    this.loginMode = username;
  }
}
