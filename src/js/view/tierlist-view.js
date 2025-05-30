import { IMG_SRC } from '../common/config.js';
import View from './view.js';

class ListView extends View {
  _parentElement = document.querySelector('.container');
  _errorMessage = 'No champion data recieved!';
  _message = '';

  addHandlerTierlist(handler) {
    document
      .querySelector('.btn-tierlist')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
  }

  _generateMarkup() {
    console.log(this._data);
    const header = `
      <li class="row">
        <p class="header void"></p>
        <p class="header name">Champion</p>
        <p class="header">Winratio</p>
        <p class="header">pick</p>
        <p class="header">ban</p>
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
        <p class="data">${champion.pickRate}</p>
        <p class="data">${champion.banRate}</p>
      </li>
    `;
  }
}

export default new ListView();
