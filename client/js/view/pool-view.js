import { IMG_SRC, CHAMPION_TEMPLATE } from '../common/config.js';
import View from './view.js';

class PoolView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.pool-section');
    this._errorMessage = 'No champion match that name...';
    this._message = 'Please, enter a champion name...';
    this._templatePromise = fetch(`${CHAMPION_TEMPLATE}`);
    this._template = null;
    // prevent propagation for clicking inside a displayed popup
    // this._panelElement.addEventListener('click', e => e.stopPropagation());
  }

  // handlers for clicking remove champion, move, etc.

  async _getTemplate() {
    if (this._template) {
      return this._template;
    }
    const response = await this._templatePromise;
    return await response.text();
  }

  async _generateMarkup(options) {
    if (!options?.length) {
      return this._message;
    }

    this._template = await this._getTemplate();

    return this._data
      .map(champion => {
        return this._generateItemMarkup(champion, options.index++);
      })
      .join('');
  }

  _generateItemMarkup(champion, index) {
    let output = this._template.replace(/{%INDEX%}/g, index);
    output = output.replace(/{%IMG_SRC%}/g, IMG_SRC);
    output = output.replace(/{%IMG%}/g, champion.img);
    // FIXME WinRate and BanRate sould come with champion from
    output = output.replace(/{%WR%}/g, '50.00');
    output = output.replace(/{%BR%}/g, '3.00');
    return output;
  }
}

export default new PoolView();
