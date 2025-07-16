import appData from '../../model/appData.js';
import Component from './component.js';
import {
  LANE_ICONS,
  RANK_ICONS,
  SELECTOR_ITEM_TEMPLATE,
} from '../../utils/config.js';

export default class SelectorComponent extends Component {
  constructor({ style, id, data }) {
    if (!style || !id || !data) {
      throw new Error('Can not create a selector without all argumnents');
    }

    super({ style, id, type: 'selector', template: SELECTOR_ITEM_TEMPLATE });
    this._data = data;
    this._parentBtn = document.querySelector(`#${id}__btn`);
    this._popUpElement = this._componentElement;
    this._path = data === 'rank' ? RANK_ICONS : LANE_ICONS;
    this._selectorData =
      data === 'rank'
        ? appData.toSortedArray('ranks')
        : appData.toSortedArray('roles');
    this._parentData = data === 'rank' ? appData.ranks : appData.roles;
    this.isVisible = false;
    this.value = null;
  }

  bindHandlers(selectorHandler = null, parentHandler = null) {
    // Callback for choosing an option from the selector
    this._componentElement.addEventListener('click', e => {
      e.preventDefault();

      this.value = e.target.closest('div').dataset.value;
      this.setActiveItem(this.value);
      if (parentHandler) {
        // Stop propagation for selectors inside its own poput that it's closed here
        // The rest, let the event pass to the backgroud to close other popups
        e.stopPropagation();
        this.changeParentButton(this.value);
        this.toggle();
      }
      if (selectorHandler) selectorHandler(this);
    });

    if (parentHandler) {
      this._parentBtn.addEventListener('click', e => {
        e.preventDefault();

        this.toggle();
        if (this.isVisible) e.stopPropagation();
        parentHandler(this);
      });
    }
  }

  async load() {
    if (!this._template) await this._templatePromise;

    this._render();
    return this;
  }

  _generateMarkup() {
    return this._selectorData
      .map(item => this._generateItemMarkup(item))
      .join('');
  }

  _generateItemMarkup(item) {
    let output = this._template.replace(/{%ID%}/g, item.id);
    output = output.replace(/{%NAME%}/g, item.name);
    output = output.replace(/{%IMG%}/g, item.img);
    output = output.replace(/{%STYLE%}/g, this._style);
    output = output.replace(/{%DATA%}/g, this._data);
    output = output.replace(/{%URL%}/g, this._path);
    return output;
  }
}
