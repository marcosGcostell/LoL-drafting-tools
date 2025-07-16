import Component from './component.js';
import { IMG_SRC, ICONS } from '../../utils/config';

export default class ChampionComponent extends Component {
  constructor({ style, id, champion, index }) {
    if (!style || !id) return undefined;
    if (index === NaN || index < 0) return undefined;
    super({ style, id, type: 'pool' });
    this._parentPool = this._componentElement;
    this._championElement = null;
    this._data = champion;
    this.index = index;
    this.fullyLoaded = false;
  }

  _getChampionElement() {
    this._championElement = document.querySelector(
      `#${this.id}__${this.index}`,
    );
  }

  bind(deleteHandler, bookmarkHandler) {
    // Callback to remove the champion
    this._championElement
      .querySelector(`.${this._style}__champion__close`)
      .addEventListener('click', e => {
        e.preventDefault();
        this.remove();
        deleteHandler(this);
      });
    // Callback to bookmark champion
    if (bookmarkHandler) {
      this._championElement
        .querySelector(`.${this._style}__champion__bookmark`)
        .addEventListener('click', e => {
          e.preventDefault();
          bookmarkHandler(this);
        });
    }
  }

  preLoad(templateOnHold) {
    this._templateOnHold = templateOnHold;

    if (this._style !== 'profile') {
      this._renderOnHold();
      this._getChampionElement();
    }
  }

  fullLoad(template, champion = null) {
    this._template = template;
    if (champion) this._data = champion;
    if (this._style !== 'profile') this.remove();
    this._render(false);
    this._getChampionElement();
    this.fullyLoaded = true;
    return this;
  }

  changeIndex(newIndex) {
    this.index = newIndex;
    this._championElement.setAttribute('id', `#${this.id}__${newIndex}`);
    return this;
  }

  remove() {
    this._championElement.remove();
  }

  _renderOnHold() {
    const markup = this._generateOnHoldMarkup();
    this._componentElement.insertAdjacentHTML('beforeend', markup);
  }

  _generateMarkup() {
    let output = this._template.replace(/{%INDEX%}/g, this.index);
    output = output.replace(/{%STYLE%}/g, this._style);
    output = output.replace(/{%ID%}/g, this.id);
    output = output.replace(/{%IMG_SRC%}/g, IMG_SRC);
    output = output.replace(/{%IMG%}/g, this._data.img);
    output = output.replace(/{%CHAMPION_ID%}/g, this._data.id);
    output = output.replace(/{%NAME%}/g, this._data.name);
    if (this._style !== 'profile') {
      output = output.replace(/{%WR%}/g, this._data.winRatio.toFixed(2));
      output = output.replace(/{%LANE%}/g, this._data.lane);
      output = output.replace(
        /{%LANE_RATE%}/g,
        this._data.roleRates[this._data.lane].toFixed(2),
      );
    }
    return output;
  }

  _generateOnHoldMarkup() {
    let output = this._templateOnHold.replace(/{%INDEX%}/g, this.index);
    output = output.replace(/{%STYLE%}/g, this._style);
    output = output.replace(/{%ICONS%}/g, ICONS);
    return output;
  }
}
