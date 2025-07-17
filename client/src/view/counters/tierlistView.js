import { SPRITE_SRC, TIERLIST_ITEM_TEMPLATE } from '../../utils/config.js';
import View from '../global/view.js';

export default class ListView extends View {
  constructor() {
    super();
    this._errorMessage = 'No champion data recieved!';
    this._message = '';
    this._itemTemplate = null;
    this._templatePromise = fetch(TIERLIST_ITEM_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._itemTemplate = data;
        return data;
      });
  }

  async initView() {
    this._parentElement = document.querySelector('.tierlist');

    if (!this._itemTemplate) await this._templatePromise;
  }

  _generateMarkup(options) {
    if (!options?.lane) return -1;

    return this._data
      .map(champion => this._generateItemMarkup(champion, options.lane))
      .join('');
  }

  _generateItemMarkup(champion, lane) {
    let output = this._itemTemplate.replace(/{%LANE_IMG%}/g, lane.img);
    output = output.replace(/{%LANE_NAME%}/g, lane.name);
    output = output.replace(/{%WR%}/g, champion.winRatio.toFixed(2));
    output = output.replace(/{%PR%}/g, champion.pickRate.toFixed(2));
    output = output.replace(/{%SPRITE_SRC%}/g, SPRITE_SRC);
    output = output.replace(/{%FILE%}/g, champion.sprite.file);
    output = output.replace(/{%X%}/g, champion.sprite.x);
    output = output.replace(/{%Y%}/g, champion.sprite.y);
    output = output.replace(/{%NAME%}/g, champion.name);
    return output;
  }

  _clear() {
    this._parentElement
      .querySelectorAll('.row, .spinner')
      .forEach(el => el.remove());
  }
}
