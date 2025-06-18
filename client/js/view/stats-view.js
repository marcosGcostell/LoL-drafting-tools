import {
  STATS_COLUMN_TEMPLATE,
  STATS_ITEM_TEMPLATE,
} from '../common/config.js';
import View from './view.js';

class StatsView extends View {
  constructor() {
    super();
    this._rootElement = document.querySelector('.stats-container');
    this._parentElement = null;
    this._listElements = null;
    this._errorMessage = 'Cannot load the stats...';
    this._message = 'Please, select champion...';
    this._tempColumnPromise = fetch(`${STATS_COLUMN_TEMPLATE}`);
    this._tempItemPromise = fetch(`${STATS_ITEM_TEMPLATE}`);
    this._templateColumn = null;
    this._templateItem = null;
    // prevent propagation for clicking inside a displayed popup
    // this._panelElement.addEventListener('click', e => e.stopPropagation());
  }

  // handlers for clicking remove champion, move, etc.

  async _resolveTemplates() {
    if (!this._templateColumn) {
      const response = await this._tempColumnPromise;
      this._templateColumn = await response.text();
    }
    if (!this._templateItem) {
      const response = await this._tempItemPromise;
      this._templateItem = await response.text();
    }
  }

  // options = { addColumn: true/false, length: list.length, index: column }
  async _generateMarkup(options) {
    if (!options?.index || (!options?.addColumn && !options.length))
      return this._message;

    await this._resolveTemplates();

    let markup;
    if (options.addColumn) {
      markup = this._generateHeaderMarkup(options.index);
      this._parentElement = this._rootElement;
    } else {
      this._listElements = document.getElementsByClassName('.stats');
      this._parentElement = this._listElements.item(options.index);
      if (!this._parentElement) return this._message;
    }

    markup += this._data
      .map(stat => {
        return this._generateItemMarkup(stat);
      })
      .join('');

    return markup;
  }

  _generateHeaderMarkup(index) {
    return this._templateColumn.replace(/{%INDEX%}/g, index);
  }

  _generateItemMarkup(stat) {
    let output = this._template.replace(/{%SCORE%}/g, stat.score);
    output = output.replace(/{%WR%}/g, stat.winRatio);
    output = output.replace(/{%BR%}/g, stat.delta);
    return output;
  }
}

export default new StatsView();
