import View from '../global/view.js';

export default class ProfileView extends View {
  constructor() {
    super();

    this.headerMessage = document.querySelector('#header_msg');
  }

  addHandlerBtn(target, handler) {
    document.querySelector(`#${target}__btn`).addEventListener('click', e => {
      e.preventDefault();
      handler();
    });
  }
}
