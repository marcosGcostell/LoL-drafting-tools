import {
  STATS_COLUMN_TEMPLATE,
  STATS_ITEM_TEMPLATE,
} from '../../utils/config.js';
import View from '../global/view.js';

export default class StatsView extends View {
  constructor() {
    super();
    this._errorMessage = 'Cannot load the stats...';
    this._message = 'Please, select champion...';
    this._templateColumn = null;
    this._templateItem = null;
    this._tempColumnPromise = fetch(STATS_COLUMN_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._templateColumn = data;
        return data;
      });
    this._tempItemPromise = fetch(STATS_ITEM_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._templateItem = data;
        return data;
      });
  }

  init() {
    this._rootElement = document.querySelector('.stats-container');
    this._parentElement = this._rootElement;
  }

  _checkOptions(options) {
    return (
      Number.isInteger(options?.index) && (options?.addColumn || options.length)
    );
  }

  _selectListContainerElement(index) {
    this._parentElement = this._rootElement.querySelector(`#s${index} ul`);
    return this._parentElement;
  }

  // options = { addColumn: true/false, length: list.length, index: column }
  async _generateMarkup(options) {
    if (!this._checkOptions(options)) return this._message;

    if (!this._templateColumn || !this._templateItem) {
      await Promise.all([this._tempColumnPromise, this._tempItemPromise]);
    }

    if (options.addColumn) {
      this._parentElement = this._rootElement;
      return this._generateSectionMarkup(options.index);
    }

    if (!this._selectListContainerElement(options.index)) return this._message;

    return this._data
      .map(item => {
        return this._generateItemMarkup(item);
      })
      .join('');
  }

  _generateItemMarkup(item) {
    let output = this._templateItem.replace(
      /{%SCORE%}/g,
      item.winRatio !== 0 ? item.score : '-'
    );
    output = output.replace(
      /{%WR%}/g,
      item.winRatio !== 0 ? item.winRatio.toFixed(2) : '-'
    );
    output = output.replace(
      /{%DELTA%}/g,
      item.winRatio !== 0 ? `Δ${item.delta2.toFixed(2)}` : '-'
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
    const index = this._rootElement.children.length;
    await this.render(['no data'], { addColumn: true, noClear: true, index });
    // Leave the _parentElement selected to the list container
    this._selectListContainerElement(index);
    return index;
  }

  removeColumn(index) {
    const column = document.querySelector(`#s${index}`);
    column.remove();
  }

  changeIndex(index, newIndex) {
    const column = document.querySelector(`#s${index}`);
    column.setAttribute('id', `s${newIndex}`);
  }

  clearSection() {
    this._rootElement.innerHTML = '';
  }
}
