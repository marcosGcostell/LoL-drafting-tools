import appData from '../../model/appData.js';
import {
  LANE_ICONS,
  RANK_ICONS,
  SELECTOR_ITEM_TEMPLATE,
} from '../../utils/config.js';

export default class SelectorComponent {
  constructor({ parentView, target, type }) {
    super();
    if (!parentView || !target || !type) return null;
    this._parentView = parent;
    this._target = target;
    this._selectorElement = document.querySelector(`#${target}__selector`);
    this._parentBtn = document.querySelector(`#${target}__btn`);
    this._path = type === 'rank' ? RANK_ICONS : LANE_ICONS;
    this._selectorData =
      type === 'rank'
        ? appData.toSortedArray('ranks')
        : appData.toSortedArray('roles');
    this.parentData = type === 'rank' ? appData.ranks : appData.roles;
    this._template = null;
    this._templatePromise = fetch(SELECTOR_ITEM_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._template = data;
        return data;
      });
    this.isVisible = false;
    this.itemSelected = null;
  }

  async load() {
    if (!this._template) await this._templatePromise;

    this._render(this._selectorData, { target: 'selector' });
    return this;
  }

  _render() {
    const markup = this._generateMarkup();
    this._clear();
    this._selectorElement.insertAdjacentHTML('beforeend', markup);
  }

  _clear() {
    this._selectorElement.innerHTML = '';
  }

  _generateMarkup() {
    return this._data.map(item => this._generateItemMarkup(item)).join('');
  }

  _generateItemMarkup(item) {
    let output = this._template.replace(/{%ID%}/g, item.id);
    output = output.replace(/{%NAME%}/g, item.name);
    output = output.replace(/{%IMG%}/g, item.img);
    output = output.replace(/{%VIEW%}/g, this._parentView);
    output = output.replace(/{%URL%}/g, this._path);
    return output;
  }

  addHandlers(selectorHandler, parentHandler = null) {
    if (selectorHandler) {
      this._selectorElement.addEventListener('click', e => {
        e.preventDefault();
        selectorHandler(e, this);
      });
    }
    if (parentHandler) {
      this._parentBtn.addEventListener('click', e => {
        e.preventDefault();
        parentHandler(e, this);
      });
    }
  }

  toggle() {
    this._selectorElement.classList.toggle('hidden');
    this.isVisible = !this.isVisible;
    return this;
  }

  setOptionActive(option) {
    Array.from(this._selectorElement.children).forEach(el =>
      el.dataset.value === option
        ? el.classList.add('item__active')
        : el.classList.remove('item__active'),
    );
    this.itemSelected = option;
    return this;
  }

  changeParentButton(option) {
    const image = this._parentBtn.querySelector('img');
    const text = this._parentBtn.querySelector('span');

    image.setAttribute('src', `${this._path}${this.parentData[option].img}`);
    text.textContent = this.parentData[option].name;
    this.itemSelected = option;
  }
}
