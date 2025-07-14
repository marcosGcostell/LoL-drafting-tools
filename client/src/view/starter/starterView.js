import View from '../global/view.js';
import SelectorComponent from '../components/selectorComponent.js';
import { STARTER_PAGE_TEMPLATE } from '../../utils/config.js';

class StarterView extends View {
  _parentElement;

  constructor() {
    super();
    this._parentElement = document.querySelector('main');
    this._errorMessage = 'Can not load the data';
    this._message = '';
    this._template = null;
    this._templatePromise = fetch(STARTER_PAGE_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._template = data;
        return data;
      });
    this.components = {};
  }

  async initView() {
    if (!this._template) await this._templatePromise;

    await this.render(true);

    this.components.starter = new SelectorComponent({
      style: 'starter',
      id: 'starter',
      data: 'lane',
    });

    await this.components.starter.load();
  }

  async _generateMarkup(_) {
    return this._template;
  }
}

export default new StarterView();
