import SelectorComponent from '../components/selectorComponent.js';
import PatchComponent from '../components/patchBtnComponent.js';

export default class InputsView {
  _parentElement;

  constructor() {
    this.components = {};
  }

  async initView() {
    const selectors = [
      { style: 'counters', id: 'lane', data: 'lane' },
      { style: 'counters', id: 'vslane', data: 'lane' },
      { style: 'counters', id: 'rank', data: 'rank' },
    ];
    const patch = { style: 'counters', id: 'patch' };

    selectors.forEach(selector => {
      this.components[selector.id] = new SelectorComponent(selector);
    });
    this.components.patch = new PatchComponent(patch);

    await Promise.all(Object.values(this.components).map(comp => comp.load()));
  }

  hidePopUps(exclude = null) {
    this.components.forEach(comp => {
      if (comp.isVisible && comp.id !== exclude) comp.toggle();
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

  _generateMarkup(_) {
    return this._data.map(item => this._generateItemMarkup(item)).join('');
  }

  _generateItemMarkup(item) {
    let output = this._currentTemplate.replace(/{%ID%}/g, item.id);
    output = output.replace(/{%NAME%}/g, item.name);
    output = output.replace(/{%IMG%}/g, item.img);
    return output;
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
