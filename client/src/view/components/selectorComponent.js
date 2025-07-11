import appData from '../../model/appData.js';
import Component from './component.js';
import {
  LANE_ICONS,
  RANK_ICONS,
  SELECTOR_ITEM_TEMPLATE,
} from '../../utils/config.js';

export default class SelectorComponent extends Component {
  constructor({ style, id, data }) {
    if (!style || !id || !data) return null;
    super({ style, id, type: 'selector', template: SELECTOR_ITEM_TEMPLATE });
    this._data = data;
    this._parentBtn = document.querySelector(`#${id}__btn`);
    this._path = data === 'rank' ? RANK_ICONS : LANE_ICONS;
    this._selectorData =
      data === 'rank'
        ? appData.toSortedArray('ranks')
        : appData.toSortedArray('roles');
    this._parentData = data === 'rank' ? appData.ranks : appData.roles;
    this.isVisible = false;
    this.value = null;
  }

  async load() {
    if (!this._template) await this._templatePromise;

    this._render();
    return this;
  }

  _render() {
    const markup = this._generateMarkup();
    this._clear();
    this._componentElement.insertAdjacentHTML('beforeend', markup);
  }

  _clear() {
    this._componentElement.innerHTML = '';
  }

  _generateMarkup() {
    return this._selectorData
      .map(item => this._generateItemMarkup(item))
      .join('');
  }

  _generateItemMarkup(item) {
    let output = this._template.replace(/{%ID%}/g, item.id);
    output = output.replace(/{%NAME%}/g, item.name);
    output = output.replace(/{%IMG%}/g, item.img);
    output = output.replace(/{%STYLE%}/g, this._style);
    output = output.replace(/{%DATA%}/g, this._data);
    output = output.replace(/{%URL%}/g, this._path);
    return output;
  }

  toggle() {
    this._componentElement.classList.toggle('hidden');
    this.isVisible = !this.isVisible;
    return this;
  }

  setActiveItem(optionId) {
    Array.from(this._componentElement.children).forEach(el =>
      el.dataset.value === optionId
        ? el.classList.add('item__active')
        : el.classList.remove('item__active'),
    );
    this.value = optionId;
    return this;
  }

  changeParentButton(optionId) {
    const image = this._parentBtn.querySelector('img');
    const text = this._parentBtn.querySelector('span');

    image.setAttribute('src', `${this._path}${this._parentData[optionId].img}`);
    text.textContent = this._parentData[optionId].name;
    this.value = optionId;
  }
}
