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
  async render(data, options = {}) {
    console.log('Rendering the list');
    console.log(data);
    // TODO Need to change the _parentElement relation
    // Should be a root element for messages and a parentelement to render data
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = await this._generateMarkup(options);

    console.log(this._parentElement);
    if (options?.onlyMarkup === true) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('beforeend', markup);
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
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <li class="row error">
          <svg>
            <use href="${ICONS}#icon-alert-triangle"></use>
          </svg>
        </li>
        <li class="row error">
          <span>${message}</span>
        </li>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <li class="row error">
          <svg>
            <use href="${ICONS}#icon-smile"></use>
          </svg>
        </li>
        <li class="row error">
          <span>${message}</span>
        </li> 
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }
}
