import {
  ICONS,
  IMG_SRC,
  CHAMPION_TEMPLATE,
  CHAMPION_ON_HOLD_TEMPLATE,
} from '../common/config.js';
import View from './view.js';

class PoolView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.pool-section');
    this._errorMessage = 'No champion match that name...';
    this._message = 'Please, enter a champion name...';
    this._template = null;
    this._templateOnHold = null;
    this._templatePromise = fetch(`${CHAMPION_TEMPLATE}`)
      .then(response => response.text())
      .then(data => {
        this._template = data;
        return data;
      });
    this._templateOnHoldPromise = fetch(`${CHAMPION_ON_HOLD_TEMPLATE}`)
      .then(response => response.text())
      .then(data => {
        this._templateOnHold = data;
        return data;
      });
    // prevent propagation for clicking inside a displayed popup
    // this._panelElement.addEventListener('click', e => e.stopPropagation());
  }

  // handlers for clicking remove champion, move, etc.

  async _generateMarkup(options) {
    if (!options?.length) return this._message;

    if (!this._template || !this._templateOnHold) {
      await Promise.all([this._templatePromise, this._templateOnHoldPromise]);
    }

    return this._data
      .map(champion => {
        return options.onHold
          ? this._generateOnHoldMarkup(options.index++)
          : this._generateItemMarkup(champion, options.index++);
      })
      .join('');
  }

  _generateItemMarkup(champion, index) {
    let output = this._template.replace(/{%INDEX%}/g, index);
    output = output.replace(/{%IMG_SRC%}/g, IMG_SRC);
    output = output.replace(/{%IMG%}/g, champion.img);
    output = output.replace(/{%WR%}/g, champion.winRatio.toFixed(2));
    output = output.replace(/{%BR%}/g, champion.banRate.toFixed(2));
    return output;
  }

  _generateOnHoldMarkup(index) {
    let output = this._templateOnHold.replace(/{%INDEX%}/g, index);
    output = output.replace(/{%ICONS%}/g, ICONS);
    return output;
  }
}

export default new PoolView();
