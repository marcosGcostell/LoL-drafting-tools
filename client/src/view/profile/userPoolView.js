import View from '../global/view.js';
import SelectorComponent from '../components/selectorComponent.js';
import PatchComponent from '../components/patchBtnComponent.js';
import SearchComponent from '../components/searchComponent.js';
import PoolComponent from '../components/poolComponent.js';
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
    this.pools = {};
  }

  async initView(roles) {
    if (!this._template) await this._templatePromise;
    await this.render(roles, { noClear: true });

    const selectors = [
      { style: 'profile', id: 'primary', data: 'lane' },
      { style: 'profile', id: 'secondary', data: 'lane' },
      { style: 'profile', id: 'rank', data: 'rank' },
    ];
    const patch = { style: 'profile', id: 'patch' };
    const lanePanels = [
      { style: 'profile', id: 'top' },
      { style: 'profile', id: 'jungle' },
      { style: 'profile', id: 'middle' },
      { style: 'profile', id: 'bottom' },
      { style: 'profile', id: 'support' },
    ];

    selectors.forEach(
      selector =>
        (this.components[selector.id] = new SelectorComponent(selector)),
    );
    this.components.patch = new PatchComponent(patch);

    lanePanels.forEach(item => {
      this.components[item.id] = new SearchComponent(item);
      this.pools[item.id] = new PoolComponent(item);
    });

    await Promise.all([
      ...Object.values(this.components).map(comp => comp.load()),
      ...Object.values(this.pools).map(comp => comp.load()),
    ]);

    this.components.primary.isVisible = true;
    this.components.secondary.isVisible = true;
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
