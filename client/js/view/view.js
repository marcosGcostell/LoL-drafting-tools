import { ICONS } from '../common/config.js';

export default class View {
  _data;

  /**
   * Render the recieved objet to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render = true] If false, create markup string instead of rendering
   * @returns {undefined | string} A markup string is return if render=false
   * @this {Object} View instance
   * @author Marcos Garcia
   * @todo Finish the implementation
   */
  render(data, render = true) {
    console.log('Rendering the list');
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  getInputs() {
    return {
      champion: document.getElementById('champion').value,
      rank: document.getElementById('rank').value,
      role: document.getElementById('role').value,
      vslane: document.getElementById('vslane').value,
    };
  }

  update(data) {}

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
            <div class="spinner">
              <svg>
                <use href="${ICONS}#icon-loader"></use>
              </svg>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${ICONS}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${ICONS}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div> 
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
