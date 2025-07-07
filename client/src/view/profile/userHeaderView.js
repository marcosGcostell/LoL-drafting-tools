import View from '../global/view.js';

export default class ProfileView extends View {
  constructor() {
    super();
  }

  addHandlerBtn(target, handler) {
    document
      .querySelector(`#${target}__btn`)
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
  }
}
