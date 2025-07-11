import View from '../global/view.js';
import SelectorComponent from '../components/selectorComponent.js';
import PatchComponent from '../components/patchBtnComponent.js';
import {
  ICONS,
  LANE_ICONS,
  RANK_ICONS,
  PROFILE_SECTION_TEMPLATE,
} from '../../utils/config.js';

export default class UserPoolView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('#lane__container');
    this._template = null;
    this._templatePromise = fetch(PROFILE_SECTION_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._template = data;
        return data;
      });
    this.components = {};
  }

  async initView(roles) {
    if (!this._template) await this._templatePromise;
    await this.render(roles, { noClear: true });

    const selectors = [
      { style: 'profile', id: 'primary', data: 'lane' },
      { style: 'profile', id: 'secondary', data: 'lane' },
      { style: 'profile', id: 'rank', data: 'rank' },
    ];
    selectors.forEach(
      comp => (this.components[comp.id] = new SelectorComponent(comp)),
    );
    this.components.patch = new PatchComponent({
      style: 'profile',
      id: 'patch',
    });

    await Promise.all(Object.values(this.components).map(comp => comp.load()));

    this.components.primary.isVisible = true;
    this.components.secondary.isVisible = true;
  }

  setFromUserData(userData, patchStr) {
    this.components.primary.setActiveItem(userData.primaryRole || 'top');
    this.components.secondary.setActiveItem(userData.secondaryRole || 'middle');
    this.components.rank
      .setActiveItem(userData.rank || 'all')
      .changeParentButton(userData.rank || 'all');
    this.components.patch.mode = userData.patch;
  }

  addHandler(id, type, handler) {
    document
      .querySelector(`#${id}__${type}`)
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler(e, id);
      });
  }

  async _generateMarkup(_) {
    return this._data.map(item => this._generateItemMarkup(item)).join('');
  }

  _generateItemMarkup(item) {
    let output = this._template.replace(/{%ID%}/g, item.id);
    output = output.replace(/{%NAME%}/g, item.name);
    output = output.replace(/{%LONG_NAME%}/g, item.longName);
    output = output.replace(/{%IMG%}/g, item.img);
    output = output.replace(/{%ICONS%}/g, ICONS);
    output = output.replace(/{%LANE_ICONS%}/g, LANE_ICONS);
    output = output.replace(/{%RANK_ICONS%}/g, RANK_ICONS);
    return output;
  }
}
