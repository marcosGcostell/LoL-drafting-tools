import Component from './component.js';
import {
  IMG_SRC,
  ICONS,
  PROFILE_CHAMPION_ITEM,
  CHAMPION_ON_HOLD_TEMPLATE,
  CHAMPION_TEMPLATE,
} from '../../utils/config';

export default class ChampionComponent extends Component {
  constructor({ style, champion, index }) {
    if (!style || !champion || !index) return null;
    const template =
      style === 'profile' ? PROFILE_CHAMPION_ITEM : CHAMPION_TEMPLATE;
    super({ style, id, type: 'champion', template });
    this._parentPool = document.querySelector(`#${style}__pool`);
    this._componentElement = this._parentPool;
    this._championElement = null;
    this._templateOnHold = null;
    this._templateOnHoldPromise = fetch(CHAMPION_ON_HOLD_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._templateOnHold = data;
        return data;
      });
    this._style = style;
    this._data = champion;
    this.index = index;
  }

  _getChampionElement() {
    this._championElement = document.querySelector(`#${style}__${index}`);
  }

  bind(closeHandler, bookmarkHandler) {
    // Callback to remove the champion
    this._championElement
      .querySelector(`.${this._style}__champion__close`)
      .addEventListener('click', e => {
        e.preventDefault();
        this._remove();
        closeHandler(this);
      });
    this._championElement
      .querySelector(`.${this._style}__champion__bookmark`)
      .addEventListener('click', e => {
        e.preventDefault();
        bookmarkHandler(this);
      });
  }

  async load() {
    if (!this._template || !this._templateOnHold) {
      await Promise.all([this._templatePromise, this._templateOnHoldPromise]);
    }

    if (this._style !== 'profile') {
      this._renderOnHold();
      this._getChampionElement();
    }
  }

  showChampion(champion = null) {
    if (champion) this._data = champion;
    if (this._style !== 'profile') this._remove();
    this._render(false);
    this._getChampionElement();
    return this;
  }

  changeIndex(newIndex) {
    this._championElement.setAttribute('id', `#${this._style}__${newIndex}`);
    return this;
  }

  _remove() {
    this._championElement.remove();
  }

  _renderOnHold() {
    const markup = this._generateMarkup();
    this._componentElement.insertAdjacentHTML('beforeend', markup);
  }

  _generateMarkup() {
    let output = this._template.replace(/{%INDEX%}/g, this.index);
    output = output.replace(/{%STYLE%}/g, this._style);
    output = output.replace(/{%IMG_SRC%}/g, IMG_SRC);
    output = output.replace(/{%IMG%}/g, this._data.img);
    output = output.replace(/{%NAME%}/g, this._data.name);
    output = output.replace(/{%WR%}/g, this._data.winRatio.toFixed(2));
    output = output.replace(/{%LANE%}/g, this._data.lane);
    output = output.replace(
      /{%LANE_RATE%}/g,
      this._data.roleRates[this._data.lane].toFixed(2),
    );
    return output;
  }

  _generateOnHoldMarkup(index) {
    let output = this._templateOnHold.replace(/{%INDEX%}/g, this.index);
    output = output.replace(/{%ICONS%}/g, ICONS);
    return output;
  }
}
