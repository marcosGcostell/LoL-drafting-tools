import View from '../global/view.js';
import {
  ICONS,
  LANE_ICONS,
  RANK_ICONS,
  LANE_PROFILE_TEMPLATE,
  RANK_PROFILE_TEMPLATE,
  PROFILE_SECTION_TEMPLATE,
} from '../../utils/config.js';

export default class UserPoolView extends View {
  _parentElement;

  constructor() {
    super();
    this._laneSectionTemplate = null;
    this._laneTemplate = null;
    this._rankTemplate = null;
    this._currentTemplate = '';
    this._laneSecTempPromise = fetch(PROFILE_SECTION_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._laneSectionTemplate = data;
        return data;
      });
    this._laneTempPromise = fetch(LANE_PROFILE_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._laneTemplate = data;
        return data;
      });
    this._rankTempPromise = fetch(RANK_PROFILE_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._rankTemplate = data;
        return data;
      });

    this.popUpDisplayed = null;
  }

  async insertSelectors(roles, ranks) {
    if (
      !this._laneSectionTemplate ||
      !this._laneTemplate ||
      !this._rankTemplate
    ) {
      await Promise.all([
        this._laneSecTempPromise,
        this._laneTempPromise,
        this._rankTempPromise,
      ]);
    }

    this._currentTemplate = this._laneTemplate;
    this._parentElement = document.querySelector('#primary__selector');
    await this.render(roles, { target: 'selector' });
    this._parentElement = document.querySelector('#secondary__selector');
    await this.render(roles, { target: 'selector' });
    this._currentTemplate = this._rankTemplate;
    this._parentElement = document.querySelector('#rank__selector');
    await this.render(ranks, { target: 'selector' });
    this._currentTemplate = this._laneSectionTemplate;
    this._parentElement = document.querySelector('#lane__container');
    await this.render(roles, { target: 'section', noClear: true });
  }

  init(userData, ranks, patchStr) {
    this.setOptionActive('primary', userData.primaryRole || 'top');
    this.setOptionActive('secondary', userData.secondaryRole || 'middle');
    this.changeRank(ranks[userData.rank] || 'all');
    this.setPatch(patchStr);
  }

  addHandler(target, type, handler) {
    document
      .querySelector(`#${target}__${type}`)
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler(e, target);
      });
  }

  toggleSelector(target = this.popUpDisplayed) {
    if (!target) return;
    document.querySelector(`#${target}__selector`).classList.toggle('hidden');
    this.popUpDisplayed = this.popUpDisplayed ? null : target;
  }

  setOptionActive(target, option) {
    const element = document.querySelector(`#${target}__selector`);
    Array.from(element.children).forEach(el =>
      el.dataset.value === option
        ? el.classList.add('item__active')
        : el.classList.remove('item__active')
    );
    element.dataset.value = option;
  }

  changeRank(rank) {
    const image = document.querySelector('#rank__btn img');
    const text = document.querySelector('#rank__btn span');

    image.setAttribute('src', `assets/img/ranks/${rank.img}`);
    text.textContent = rank.name;
    document.querySelector('#rank__btn span').dataset.value = rank.id;
  }

  setPatch(patchStr) {
    document.querySelector('#patch__btn span').textContent = patchStr;
  }

  async _generateMarkup(options) {
    if (options?.target === 'selector' || options?.target === 'section') {
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
    output = output.replace(/{%LONG_NAME%}/g, item.longName);
    output = output.replace(/{%IMG%}/g, item.img);
    output = output.replace(/{%ICONS%}/g, ICONS);
    output = output.replace(/{%LANE_ICONS%}/g, LANE_ICONS);
    output = output.replace(/{%RANK_ICONS%}/g, RANK_ICONS);
    return output;
  }

  _generateChampionMarkup(champion) {
    let output;
    return output;
  }
}
