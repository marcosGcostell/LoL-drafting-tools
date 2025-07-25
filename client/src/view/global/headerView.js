export default class HeaderView {
  constructor() {
    this.loginMode = false;
  }

  addHandlerBtn(target, handler) {
    document.querySelector(`#${target}__btn`).addEventListener('click', e => {
      e.preventDefault();
      handler(e);
    });
  }

  toggleMode(username = undefined) {
    const userText = username || 'Not logged in';
    document.querySelector('.header__username span').textContent = userText;
    document.querySelector('#login__btns').classList('hidden').toggle();
    document.querySelector('#user__navbar').classList('hidden').toggle();
  }
}
