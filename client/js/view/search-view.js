import { IMG_SRC, SEARCH_ITEM_TEMPLATE } from '../common/config.js';
import View from './view.js';

class ListView extends View {
  _parentElement = document.querySelector('.search__results');
  _errorMessage = 'No champion data recieved!';
  _message = '<li class="row">No champion match that name...</li>';

  addHandlerTierlist(handler) {
    document
      .querySelector('.btn__tierlist')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
  }

  async _generateMarkup(options) {
    if (!options?.length) return _message;

    // TODO Maybe the templates should be cached in sessionStorage
    const response = await fetch(`${SEARCH_ITEM_TEMPLATE}`);
    const itemTemplate = await response.text();

    return this._data
      .map(champion => this._generateItemMarkup(champion, itemTemplate))
      .join('');
  }

  _generateItemMarkup(champion, itemTemplate) {
    let output = itemTemplate.replace(/{%ID%}/g, champion.id);
    output = output.replace(/{%IMG_SRC%}/g, IMG_SRC);
    output = output.replace(/{%IMG%}/g, champion.img);
    output = output.replace(/{%NAME%}/g, champion.name);
    return output;
  }
}

export default new ListView();
