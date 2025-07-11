import SelectorComponent from '../components/selectorComponent.js';
import PatchComponent from '../components/patchBtnComponent.js';

export default class InputsView {
  _parentElement;

  constructor() {
    this.components = {};
  }

  async init() {
    const selectors = [
      { style: 'counters', id: 'lane', data: 'lane' },
      { style: 'counters', id: 'vslane', data: 'lane' },
      { style: 'counters', id: 'rank', data: 'rank' },
    ];
    const patch = { style: 'counters', id: 'patch' };

    selectors.forEach(
      selector =>
        (this.components[selector.id] = new SelectorComponent(selector)),
    );
    this.components.patch = new PatchComponent(patch);

    await Promise.all(Object.values(this.components).map(comp => comp.load()));
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
