import { IMG_SRC, TIERLIST_ITEM_TEMPLATE } from '../common/config.js';
import View from './view.js';

class ListView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.tierlist');
    this._errorMessage = 'No champion data recieved!';
    this._message = '';
    this._itemTemplate = null;
    this._templatePromise = fetch(`${TIERLIST_ITEM_TEMPLATE}`)
      .then(response => response.text())
      .then(data => {
        this._itemTemplate = data;
        return data;
      });
  }

  // FIXME this handler has no purpose anymore
  addHandlerTierlist(handler) {
    document
      .querySelector('.btn__tierlist')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
  }

  async _generateMarkup(options) {
    if (!options?.lane) return -1;

    // TODO Maybe the templates should be cached in sessionStorage
    if (!this._itemTemplate) await this._templatePromise;

    return this._data
      .map(champion => this._generateItemMarkup(champion, options.lane))
      .join('');
  }

  _generateItemMarkup(champion, lane) {
    let output = this._itemTemplate.replace(/{%LANE_IMG%}/g, lane.img);
    output = output.replace(/{%LANE_NAME%}/g, lane.name);
    output = output.replace(/{%WR%}/g, champion.winRatio);
    output = output.replace(/{%PR%}/g, champion.pickRate);
    output = output.replace(/{%IMG_SRC%}/g, IMG_SRC);
    output = output.replace(/{%IMG%}/g, champion.img);
    output = output.replace(/{%NAME%}/g, champion.name);
    return output;
  }

  _clear() {
    this._parentElement
      .querySelectorAll('.row, .spinner')
      .forEach(el => el.remove());
  }
}

export default new ListView();
