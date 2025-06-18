import {
  STATS_COLUMN_TEMPLATE,
  STATS_ITEM_TEMPLATE,
} from '../common/config.js';
import View from './view.js';

class StatsView extends View {
  constructor() {
    super();
    this._rootElement = document.querySelector('.stats-container');
    this._parentElement = this._rootElement;
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

  checkOptions(options) {
    return (
      Number.isInteger(options?.index) && (options?.addColumn || options.length)
    );
  }

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
    if (!this.checkOptions(options)) return this._message;

    await this._resolveTemplates();

    console.log('Generating markup...');
    console.log(options);
    if (options.addColumn) {
      console.log('Adding new stat column markup...');
      this._parentElement = this._rootElement;
      return this._generateSectionMarkup(options.index);
    }

    this._parentElement = this._rootElement.querySelector(
      `#s${options.index} ul`
    );
    if (!this._parentElement) {
      return this._message;
    }

    return this._data
      .map(item => {
        return this._generateItemMarkup(item);
      })
      .join('');
  }

  _generateItemMarkup(item) {
    // TODO Score needs to be a computed
    let output = this._templateItem.replace(
      /{%SCORE%}/g,
      item.winRatio !== 0 ? '5' : '-'
    );
    output = output.replace(
      /{%WR%}/g,
      item.winRatio !== 0 ? item.winRatio : '-'
    );
    output = output.replace(
      /{%DELTA%}/g,
      item.winRatio !== 0 ? `Δ${item.delta2}` : '-'
    );
    return output;
  }

  _generateSectionMarkup(index) {
    return this._templateColumn.replace(/{%INDEX%}/g, index);
  }

  _clear() {
    this._parentElement
      .querySelectorAll('.row, .spinner')
      .forEach(el => el.remove());
  }

  async addNewColumn() {
    console.log('Adding a new stats column...');
    const index = this._rootElement.children.length;
    await this.render(['no data'], { addColumn: true, noClear: true, index });
    return index;
  }

  deleteColumn() {
    this._rootElement.querySelector(`#${options.index}`).remove();
  }

  clearSection() {
    this._rootElement.innerHTML = '';
  }
}

export default new StatsView();
