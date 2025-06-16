import { LANE_ITEM_TEMPLATE, RANK_ITEM_TEMPLATE } from '../common/config.js';

class InputsView {
  _data;
  selectorDisplayed = null;

  async insertSelectors(roles, ranks, version) {
    this._data = roles;
    await this.render(LANE_ITEM_TEMPLATE, '.lane__selector');
    await this.render(LANE_ITEM_TEMPLATE, '.vslane__selector');
    this._data = ranks;
    await this.render(RANK_ITEM_TEMPLATE, '.rank__selector');
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
