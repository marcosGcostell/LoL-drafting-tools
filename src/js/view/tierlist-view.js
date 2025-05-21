import { CHAMPION_PATH } from '../common/config.js';
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
      <li class="counter-list">
        <p class="data void header"></p>
        <p class="data name header">Champion</p>
        <p class="data header">Winratio</p>
        <p class="data header">pick</p>
        <p class="data header">ban</p>
      </li>
    `;

    return (
      header +
      this._data.map(champion => this._generateItemMarkup(champion)).join('')
    );
  }

  _generateItemMarkup(champion) {
    return `
      <li class="counter-list">
        <img src="${CHAMPION_PATH}${champion.img}" class="data thumbnail" />
        <p class="data name">${champion.name}</p>
        <p class="data">${champion.winRatio}%</p>
        <p class="data">${champion.pickRate}</p>
        <p class="data">${champion.banRate}</p>
      </li>
    `;
  }
}

export default new ListView();
