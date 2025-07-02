import View from '../global/view.js';
import {
  LANE_ITEM_TEMPLATE,
  RANK_ITEM_TEMPLATE,
  LANE_STARTER_TEMPLATE,
} from '../../utils/config.js';

export default class InputsView extends View {
  _parentElement;

  constructor() {
    super();
    this._errorMessage = 'Can not read champions';
    this._message = '';
    this._laneTemplate = null;
    this._rankTemplate = null;
    this._currentTemplate = '';
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

  init() {
    this._laneElement = document.querySelector('.lane__selector');
    this._rankElement = document.querySelector('.rank__selector');
    this._vslaneElement = document.querySelector('.vslane__selector');
    this._patchBtn = document.querySelector('.patch__btn');
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

  addHandlerInput(handler, target) {
    document
      .querySelector(`#${target}`)
      .addEventListener('change', function (e) {
        e.preventDefault();
        handler(this.value);
      });
  }

  async insertSelectors(roles, ranks, patch) {
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
    this._patchBtn.textContent = patch;
  }

  async _generateMarkup(_) {
    return this._data.map(item => this._generateItemMarkup(item)).join('');
  }

  _generateItemMarkup(item) {
    let output = this._currentTemplate.replace(/{%ID%}/g, item.id);
    output = output.replace(/{%NAME%}/g, item.name);
    output = output.replace(/{%IMG%}/g, item.img);
    return output;
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
    image.setAttribute('src', `assets/img/${folder}/${option.img}`);
    text.textContent = option.name;
  }

  setPatch(patchStr) {
    this._patchBtn.textContent = patchStr;
  }

  setMaxItems(value) {
    const maxItemsElement = document.querySelector('#max-items');
    maxItemsElement.value = value;
    maxItemsElement.blur();
  }

  setPickRateThreshold(value) {
    const pickRateElement = document.querySelector('#min-pr');
    pickRateElement.value = value.toFixed(1);
    pickRateElement.blur();
  }
}
