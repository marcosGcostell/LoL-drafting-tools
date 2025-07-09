import View from '../global/view.js';
import {
  LANE_PROFILE_TEMPLATE,
  RANK_ITEM_TEMPLATE,
} from '../../utils/config.js';

export default class UserPoolView extends View {
  _parentElement;

  constructor() {
    super();
    this._laneTemplate = null;
    this._rankTemplate = null;
    this._currentTemplate = '';
    this._laneTempPromise = fetch(LANE_PROFILE_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._laneTemplate = data;
        return data;
      });
    this._rankTempPromise = fetch(RANK_ITEM_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._rankTemplate = data;
        return data;
      });

    this._primaryRoleElement = document.querySelector('#primary__role');
    this._secondaryRoleElement = document.querySelector('#secondary__role');
    this._rankElement = document.querySelector('.rank__selector');

    this.selectorDisplayed = null;
  }

  async insertSelectors(roles, ranks) {
    if (!this._laneTemplate || !this._rankTemplate) {
      await Promise.all([this._laneTempPromise, this._rankTempPromise]);
    }

    this._currentTemplate = this._laneTemplate;
    this._parentElement = this._primaryRoleElement;
    await this.render(roles, { target: 'selector' });
    this._parentElement = this._secondaryRoleElement;
    await this.render(roles, { target: 'selector' });
    // this._currentTemplate = this._rankTemplate;
    // this._parentElement = this._rankElement;
    // await this.render(ranks);
  }

  init({ data }) {
    this.setOptionActive('primary', data.primaryRole || 'top');
    this.setOptionActive('secondary', data.secondaryRole || 'middle');
  }

  addHandlerLaneSelector(target, handler) {
    this[`_${target}RoleElement`].addEventListener('click', function (e) {
      e.preventDefault();
      const id = e.target.closest('div').dataset.value;
      handler(target, id);
    });
  }

  toggleSelector(target = this.selectorDisplayed) {
    if (!target) return;
    document.querySelector(`.${target}__selector`).classList.toggle('hidden');
    this.selectorDisplayed = this.selectorDisplayed ? null : target;
  }

  changeRank(option) {
    const image = this._rankElement.querySelector('img');
    const text = this._rankElement.querySelector('span');

    image.setAttribute('src', `assets/img/ranks/${option.img}`);
    text.textContent = option.name;
  }

  setOptionActive(target, option) {
    const element = this[`_${target}RoleElement`];
    Array.from(element.children).forEach(el =>
      el.dataset.value === option
        ? el.classList.add('item__active')
        : el.classList.remove('item__active')
    );
    element.dataset.value = option;
  }

  async _generateMarkup(options) {
    if (options?.target === 'selector') {
      return this._data.map(item => this._generateItemMarkup(item)).join('');
    }
    if (options?.target === 'champion') {
      return this._data
        .map(champion => this._generateChampionMarkup(champion))
        .join('');
    }
  }

  _generateItemMarkup(item) {
    let output = this._currentTemplate.replace(/{%ID%}/g, item.id);
    output = output.replace(/{%NAME%}/g, item.name);
    output = output.replace(/{%IMG%}/g, item.img);
    return output;
  }

  _generateChampionMarkup(champion) {
    let output;
    return output;
  }
}
