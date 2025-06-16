import { IMG_SRC, TIERLIST_ITEM_TEMPLATE } from '../common/config.js';
import appData from '../model/app-data.js';
import View from './view.js';

class ListView extends View {
  _parentElement = document.querySelector('.tierlist');
  _errorMessage = 'No champion data recieved!';
  _message = '';

  // FIXME this handler has no purpose anymore
  addHandlerTierlist(handler) {
    document
      .querySelector('.btn__tierlist')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
  }

  async _generateMarkup(options) {
    if (!options?.lane) return -1;

    // TODO Maybe the templates should be cached in sessionStorage
    const response = await fetch(`${TIERLIST_ITEM_TEMPLATE}`);
    const itemTemplate = await response.text();

    return this._data
      .map(champion =>
        this._generateItemMarkup(
          champion,
          appData.roles[options.lane],
          itemTemplate
        )
      )
      .join('');
  }

  _generateItemMarkup(champion, lane, itemTemplate) {
    let output = itemTemplate.replace(/{%LANE_IMG%}/g, lane.img);
    output = output.replace(/{%LANE_NAME%}/g, lane.name);
    output = output.replace(/{%WR%}/g, champion.winRatio);
    output = output.replace(/{%PR%}/g, champion.pickRate);
    output = output.replace(/{%IMG_SRC%}/g, IMG_SRC);
    output = output.replace(/{%IMG%}/g, champion.img);
    output = output.replace(/{%NAME%}/g, champion.name);
    return output;
  }

  _clear() {
    this._parentElement
      .querySelectorAll('.row, .spinner')
      .forEach(el => el.remove());
  }
}

export default new ListView();
