import { LANE_ITEM_TEMPLATE, RANK_ITEM_TEMPLATE } from '../common/config.js';

class InputsView {
  _data;

  async buildSelectors(roles, ranks, version) {
    this._setSortedDataArray(roles, true);
    await this.render(LANE_ITEM_TEMPLATE, '.lane__selector');
    await this.render(LANE_ITEM_TEMPLATE, '.vslane__selector');
    this._setSortedDataArray(ranks);
    await this.render(RANK_ITEM_TEMPLATE, '.rank__selector');
  }

  _setSortedDataArray(object, shift = false) {
    this._data = [];
    this._data = Object.values(object);
    this._data.sort((a, b) => a.index - b.index);
    if (shift) this._data.shift();
  }

  async render(template, target) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();
    const targetElement = document.querySelector(`${target}`);

    const markup = await this._generateMarkup(template);

    targetElement.innerHTML = '';
    targetElement.insertAdjacentHTML('afterbegin', markup);
  }

  async _generateMarkup(template) {
    const response = await fetch(`${template}`);
    const itemTemplate = await response.text();
    return this._data
      .map(item => this._generateItemMarkup(item, itemTemplate))
      .join('');
  }

  _generateItemMarkup(item, itemTemplate) {
    let output = itemTemplate.replace(/{%ID%}/g, item.id);
    output = output.replace(/{%NAME%}/g, item.name);
    output = output.replace(/{%IMG%}/g, item.img);
    return output;
  }

  addHandlerBtn(handler, target) {
    document
      .querySelector(`.${target}__btn`)
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler(target);
      });
  }

  toggleSelector(target) {
    document.querySelector(`.${target}__selector`).classList.toggle('hidden');
  }

  changeOption(target, option) {
    const image = document.querySelector(`.${target}__selector img`);
    const text = document.querySelector(`.${target}__selector span`);
    image.setAttribute('src', option.img);
    text.textContent = option.name;
  }
}

export default new InputsView();
