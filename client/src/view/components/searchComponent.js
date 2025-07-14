import * as searchModel from '../../model/searchModel.js';
import Component from './component.js';
import { SPRITE_SRC, SEARCH_ITEM_TEMPLATE } from '../../utils/config.js';

export default class SarchComponent extends Component {
  constructor({ style, id }) {
    if (!style || !id || !data) return null;
    super({ style, id, type: 'search', template: SEARCH_ITEM_TEMPLATE });

    this._parentBtn = document.querySelector(`#${id}__search__btn`);
    this._popUpElement = document.querySelector(`#${id}__search__popup`);
    this._inputElement = document.querySelector(`#${id}__search__input`);

    this._searchResults = [];
    this._splitIndex = -1;
    this.isVisible = false;
    this.value = null;
    this._bindInternalBehaviour();
  }

  async load() {
    if (!this._template) await this._templatePromise;

    // prevent propagation for clicking inside a displayed popup
    this._popUpElement.addEventListener('click', e => e.stopPropagation());

    return this;
  }

  _bindInternalBehaviour() {
    this._inputElement.addEventListener('input', e => {
      e.preventDefault();

      const { primarySearch, splitIndex } = searchModel.handleQuery(
        e.target.value.toLowerCase(),
      );
      if (!primarySearch.length) return this._clear();
      this._searchResults = primarySearch;
      this._splitIndex = splitIndex;

      this._render();
    });
  }

  bind(pickedChampionHandler, parentHandler) {
    // Event for clicking a champion from the search list
    this._componentElement.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      const id = e.target.closest('li').dataset.value;
      const champion = this._searchResults.find(champion => champion.id === id);
      if (!champion) return;

      this.toggle();
      if (pickedChampionHandler) pickedChampionHandler(champion, this);
    });

    // Event for submitting the search query
    this._inputElement.addEventListener('change', e => {
      e.preventDefault();
      e.stopPropagation();

      const champion = searchModel.checkSubmitQuery(
        this._searchResults,
        this._splitIndex,
      );

      if (!champion) return;

      this.toggle();
      if (pickedChampionHandler) pickedChampionHandler(champion, this);
    });

    // Event for clicking the parent button to show/hide the popup
    this._parentBtn.addEventListener('click', e => {
      e.preventDefault();
      parentHandler(e, this);
    });
  }

  _generateMarkup() {
    return this._searchResults
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
    } else this.reset();
  }

  reset() {
    this._inputElement.value = '';
    this._searchResults = [];
    this._splitIndex = -1;
    this._clear();
  }
}
