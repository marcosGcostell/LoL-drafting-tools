import View from '../global/view.js';
import SelectorComponent from '../components/selectorComponent.js';
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

    const components = [
      { parentView: 'profile', target: 'primary', type: 'lane' },
      { parentView: 'profile', target: 'secondary', type: 'lane' },
      { parentView: 'profile', target: 'rank', type: 'rank' },
    ];
    components.forEach(
      comp => (this.components[comp.target] = new SelectorComponent(comp)),
    );

    await Promise.all(Object.values(this.components).map(comp => comp.load()));

    this.components.primary.isVisible = true;
    this.components.secondary.isVisible = true;
  }

  setFromUserData(userData, patchStr) {
    this.components.primary.setOptionActive(userData.primaryRole || 'top');
    this.components.secondary.setOptionActive(
      userData.secondaryRole || 'middle',
    );
    this.components.rank.changeParentButton(userData.rank || 'all');
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

  setPatch(patchStr) {
    document.querySelector('#patch__btn span').textContent = patchStr;
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
