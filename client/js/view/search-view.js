import { IMG_SRC, SEARCH_ITEM_TEMPLATE } from '../common/config.js';
import View from './view.js';

class ListView extends View {
  constructor() {
    super();
    this._panelElement = document.querySelector('.search__popup');
    this._inputElement = document.querySelector('#search');
    this._parentElement = document.querySelector('.search__results');
    this._errorMessage = 'No champion match that name...';
    this._message = 'Please, enter a champion name...';
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
    if (!options?.length) {
      return this._message;
    }

    // TODO Maybe the templates should be cached in sessionStorage
    const response = await fetch(`${SEARCH_ITEM_TEMPLATE}`);
    const itemTemplate = await response.text();

    return this._data
      .map(champion => {
        if (champion?.id) {
          return this._generateItemMarkup(champion, itemTemplate);
        } else {
          return '<hr>';
        }
      })
      .join('');
  }

  _generateItemMarkup(champion, itemTemplate) {
    let output = itemTemplate.replace(/{%ID%}/g, champion.id);
    output = output.replace(/{%IMG_SRC%}/g, IMG_SRC);
    output = output.replace(/{%IMG%}/g, champion.img);
    output = output.replace(/{%NAME%}/g, champion.name);
    return output;
  }

  toggleSearchPanel() {
    this._inputElement.value = '';
    this._clear();
    this._panelElement.classList.toggle('hidden');
    this.isPanelShowed = !this.isPanelShowed;
  }
}

export default new ListView();
