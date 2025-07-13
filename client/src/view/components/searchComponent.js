import appData from '../../model/appData.js';
import Component from './component.js';
import { SPRITE_SRC, SEARCH_ITEM_TEMPLATE } from '../../utils/config.js';

export default class SarchComponent extends Component {
  constructor({ style, id }) {
    if (!style || !id || !data) return null;
    super({ style, id, type: 'search', template: SEARCH_ITEM_TEMPLATE });

    this._parentBtn = document.querySelector(`#${id}__search__btn`);
    this._popUpElement = document.querySelector(`#${id}__search__popup`);
    this._inputElement = document.querySelector(`#${id}__search__input`);

    this.searchList = [];
    this.isVisible = false;
    this.value = null;
  }

  bind(selectorHandler, parentHandler = null) {
    if (selectorHandler) {
      this._componentElement.addEventListener('click', e => {
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

  async load() {
    if (!this._template) await this._templatePromise;

    // prevent propagation for clicking inside a displayed popup
    this._popUpElement.addEventListener('click', e => e.stopPropagation());

    return this;
  }

  _render(list) {
    if (!list || (Array.isArray(list) && list.length === 0)) return;
    // TODO Should think how to handle this error

    const markup = this._generateMarkup(list);
    this._clear();
    this._componentElement.insertAdjacentHTML('beforeend', markup);
  }

  _clear() {
    this._componentElement.innerHTML = '';
  }

  _generateMarkup(list) {
    return list
      .map(champion => {
        if (champion?.id) {
          return this._generateItemMarkup(champion);
        } else {
          return '<hr>';
        }
      })
      .join('');
  }

  _generateItemMarkup(champion) {
    let output = this._template.replace(/{%ID%}/g, champion.id);
    output = output.replace(/{%SPRITE_SRC%}/g, SPRITE_SRC);
    output = output.replace(/{%FILE%}/g, champion.sprite.file);
    output = output.replace(/{%X%}/g, champion.sprite.x);
    output = output.replace(/{%Y%}/g, champion.sprite.y);
    output = output.replace(/{%NAME%}/g, champion.name);
    return output;
  }

  toggle() {
    this._popUpElement.classList.toggle('hidden');
    this.isVisible = !this.isVisible;
    if (this.isVisible) {
      this._inputElement.focus();
    } else {
      this._inputElement.value = '';
      this._clear();
    }
  }
}
