import View from '../global/view.js';
import { LANE_STARTER_TEMPLATE } from '../../utils/config.js';

class StarterView extends View {
  _parentElement;

  constructor() {
    super();
    this._errorMessage = 'Can not load the data';
    this._message = '';
    this._template = null;
    this._templatePromise = fetch(LANE_STARTER_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._template = data;
        return data;
      });
  }

  addHandlerSelector(handler) {
    document
      .querySelector('.starter__selector')
      .addEventListener('click', function (e) {
        e.preventDefault();
        const id = e.target.dataset.value;
        handler(id);
      });
  }

  async insertSelector(roles) {
    if (!this._template) {
      await this._templatePromise;
    }

    this._parentElement = document.querySelector('.starter-options');
    await this.render(roles);
  }

  async _generateMarkup(_) {
    return this._data.map(item => this._generateItemMarkup(item)).join('');
  }

  _generateItemMarkup(item) {
    let output = this._template.replace(/{%ID%}/g, item.id);
    output = output.replace(/{%NAME%}/g, item.name);
    output = output.replace(/{%IMG%}/g, item.img);
    return output;
  }
}

export default new StarterView();
