import { IMG_SRC } from '../common/config.js';
import View from './view.js';

class CountersView extends View {
  _parentElement = document.querySelector('.container');
  _errorMessage = 'No champion data recieved!';
  _message = '';

  addHandlerCounters(handler) {
    document
      .querySelector('.btn__counters')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
  }

  _generateMarkup() {
    console.log(this._data);
    const header = `
      <li class="row">
        <p class="first-row void"></p>
        <p class="first-row name">Champion</p>
        <p class="first-row">Winratio</p>
        <p class="first-row">delta1</p>
        <p class="first-row">delta2</p>
      </li>
    `;
    return (
      header +
      this._data.map(champion => this._generateItemMarkup(champion)).join('')
    );
  }

  _generateItemMarkup(champion) {
    return `
      <li class="row">
        <img src="${IMG_SRC}${champion.img}" class="data thumbnail" />
        <p class="data name">${champion.name}</p>
        <p class="data">${champion.winRatio}%</p>
        <p class="data">${champion.delta1}</p>
        <p class="data">${champion.delta2}</p>
      </li>
    `;
  }
}

export default new CountersView();
