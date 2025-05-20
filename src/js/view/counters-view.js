import { CHAMPION_PATH } from '../common/config.js';
import View from './view.js';

class CountersView extends View {
  _parentElement = document.querySelector('.container');
  _errorMessage = 'No counter data recieved!';
  _message = '';

  _generateMarkup() {
    const header = `
      <li class="counter-list">
        <p class="data void header"></p>
        <p class="data name header">Champion</p>
        <p class="data header">Winratio</p>
        <p class="data header">delta1</p>
        <p class="data header">delta2</p>
      </li>
    `;
    return (
      header +
      this._data
        .map(champion => this._generateItemMarkup.render(champion, false))
        .join('')
    );
  }

  _generateItemMarkup() {
    return `
      <li class="counter-list">
        <img src="${CHAMPION_PATH}${this._data.name}.png" class="data thumbnail" />
        <p class="data name">${this._data.name}</p>
        <p class="data">${this._data.winRatio}%</p>
        <p class="data">${this._data.delta1}</p>
        <p class="data">${this._data.delta2}</p>
      </li>
    `;
  }
}

export default new CountersView();
