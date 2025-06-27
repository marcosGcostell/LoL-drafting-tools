import { SPRITE_SRC, SEARCH_ITEM_TEMPLATE } from '../common/config.js';
import View from './view.js';

class SearchView extends View {
  constructor() {
    super();
    this._panelElement = document.querySelector('.search__popup');
    this._inputElement = document.querySelector('#search');
    this._parentElement = document.querySelector('.search__results');
    this._errorMessage = 'No champion match that name...';
    this._message = 'Please, enter a champion name...';
    this._template = null;
    this._templatePromise = fetch(`${SEARCH_ITEM_TEMPLATE}`)
      .then(response => response.text())
      .then(data => {
        this._template = data;
        return data;
      });

    this.isPanelShowed = false;

    // prevent propagation for clicking inside a displayed popup
    this._panelElement.addEventListener('click', e => e.stopPropagation());
  }

  addHandlerSearchContent(handler) {
    this._inputElement.addEventListener('input', function (e) {
      e.preventDefault();
      handler(e);
    });
  }

  addHandlerAddChampion(handler) {
    document
      .querySelector('#select-champion')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler(e);
      });
  }

  addHandlerPickChampion(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      handler(e);
    });
  }

  async _generateMarkup(options) {
    if (!options?.length) return this._message;

    // TODO Maybe the templates should be cached in sessionStorage
    if (!this._template) await this._templatePromise;

    return this._data
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

  toggleSearchPanel() {
    this._inputElement.value = '';
    this._clear();
    this._panelElement.classList.toggle('hidden');
    this.isPanelShowed = !this.isPanelShowed;
    if (this.isPanelShowed) {
      this._inputElement.focus();
    }
  }

  toggleSearchBtn() {
    document.querySelector('#select-champion').classList.toggle('hidden');
  }
}

export default new SearchView();
