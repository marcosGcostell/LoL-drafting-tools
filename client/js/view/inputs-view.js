import View from './view.js';
import { LANE_ITEM_TEMPLATE, RANK_ITEM_TEMPLATE } from '../common/config.js';

class InputsView extends View {
  _parentElement;

  constructor() {
    super();
    this._laneTemplate = '';
    this._rankTemplate = '';
    this._currentTemplate = '';
    this._laneElement = document.querySelector('.lane__selector');
    this._rankElement = document.querySelector('.rank__selector');
    this._vslaneElement = document.querySelector('.vslane__selector');
    this._errorMessage = 'Can not read champions';
    this._message = '';
    this._laneTemplate = null;
    this._rankTemplate = null;
    this._laneTempPromise = fetch(`${LANE_ITEM_TEMPLATE}`)
      .then(response => response.text())
      .then(data => {
        this._laneTemplate = data;
        return data;
      });
    this._rankTempPromise = fetch(`${RANK_ITEM_TEMPLATE}`)
      .then(response => response.text())
      .then(data => {
        this._rankTemplate = data;
        return data;
      });

    this.selectorDisplayed = null;
  }

  async insertSelectors(roles, ranks, version) {
    if (!this._laneTemplate || !this._rankTemplate) {
      await Promise.all([this._laneTempPromise, this._rankTempPromise]);
    }

    this._currentTemplate = this._laneTemplate;
    this._parentElement = this._laneElement;
    await this.render(roles);
    this._parentElement = this._vslaneElement;
    await this.render(roles);
    this._currentTemplate = this._rankTemplate;
    this._parentElement = this._rankElement;
    await this.render(ranks);
  }

  async _generateMarkup(options) {
    return this._data.map(item => this._generateItemMarkup(item)).join('');
  }

  _generateItemMarkup(item) {
    let output = this._currentTemplate.replace(/{%ID%}/g, item.id);
    output = output.replace(/{%NAME%}/g, item.name);
    output = output.replace(/{%IMG%}/g, item.img);
    return output;
  }

  addHandlerBtn(handler, target) {
    document
      .querySelector(`.${target}__btn`)
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler(e, target);
      });
  }

  addHandlerSelector(handler, target) {
    document
      .querySelector(`.${target}__selector`)
      .addEventListener('click', function (e) {
        e.preventDefault();
        const id = e.target.dataset.value;
        handler(id);
      });
  }

  toggleSelector(target = this.selectorDisplayed) {
    if (!target) return;
    document.querySelector(`.${target}__selector`).classList.toggle('hidden');
    this.selectorDisplayed = this.selectorDisplayed ? null : target;
  }

  changeOption(target, option) {
    const image = document.querySelector(`.${target}__input img`);
    const text = document.querySelector(`.${target}__input span`);

    const folder = target === 'rank' ? 'ranks' : 'lanes';
    image.setAttribute('src', `img/${folder}/${option.img}`);
    text.textContent = option.name;
  }
}

export default new InputsView();
