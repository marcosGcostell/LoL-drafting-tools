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
    console.log(this._data);
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
    console.log(item);
    let output = itemTemplate.replace(/{%ID%}/g, item.id);
    output = output.replace(/{%NAME%}/g, item.name);
    output = output.replace(/{%IMG%}/g, item.img);
    return output;
  }

  addHandlerLaneBtn(handler) {
    document
      .querySelector('.lane__btn')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
  }

  addHandlerVsLaneBtn(handler) {
    document
      .querySelector('.vslane__btn')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
  }
  addHandlerRankBtn(handler) {
    document
      .querySelector('.rank__btn')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
  }
  addHandlerPatchBtn(handler) {
    document
      .querySelector('.patch__btn')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
  }

  toggleSelector(id) {
    document.querySelector(`.${id}__selector`).classList.toggle('hidden');
  }
}

export default new InputsView();
