import { IMG_SRC, CHAMPION_TEMPLATE } from '../common/config.js';
import View from './view.js';

class PoolView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.pool-section');
    this._errorMessage = 'No champion match that name...';
    this._message = 'Please, enter a champion name...';
    this._template = null;
    this._templatePromise = fetch(`${CHAMPION_TEMPLATE}`)
      .then(response => response.text())
      .then(data => {
        this._template = data;
        return data;
      });
    // prevent propagation for clicking inside a displayed popup
    // this._panelElement.addEventListener('click', e => e.stopPropagation());
  }

  // handlers for clicking remove champion, move, etc.

  async _generateMarkup(options) {
    if (!options?.length) return this._message;

    if (!this._template) await this._templatePromise;

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
    // FIXME WinRate and BanRate sould come with champion from API
    output = output.replace(/{%WR%}/g, '50.00');
    output = output.replace(/{%BR%}/g, '3.00');
    return output;
  }
}

export default new PoolView();
