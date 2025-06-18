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
    this._templateColumn = null;
    this._templateItem = null;
    this._tempColumnPromise = fetch(`${STATS_COLUMN_TEMPLATE}`)
      .then(response => response.text())
      .then(data => {
        this._templateColumn = data;
        return data;
      });
    this._tempItemPromise = fetch(`${STATS_ITEM_TEMPLATE}`)
      .then(response => response.text())
      .then(data => {
        this._templateItem = data;
        return data;
      });
    // prevent propagation for clicking inside a displayed popup
    // this._panelElement.addEventListener('click', e => e.stopPropagation());
  }

  // handlers for clicking remove champion, move, etc.

  checkOptions(options) {
    return (
      Number.isInteger(options?.index) && (options?.addColumn || options.length)
    );
  }

  selectListContainerElement(index) {
    this._parentElement = this._rootElement.querySelector(`#s${index} ul`);
    return this._parentElement;
  }

  // options = { addColumn: true/false, length: list.length, index: column }
  async _generateMarkup(options) {
    if (!this.checkOptions(options)) return this._message;

    if (!this._templateColumn || !this._templateItem) {
      await Promise.all([this._tempColumnPromise, this._tempItemPromise]);
    }

    console.log('Generating markup...');
    console.log(options);
    if (options.addColumn) {
      console.log('Adding new stat column markup...');
      this._parentElement = this._rootElement;
      return this._generateSectionMarkup(options.index);
    }

    if (!this.selectListContainerElement(options.index)) return this._message;

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
    // Leave the _parentElement selected to the list container
    this.selectListContainerElement(index);
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
