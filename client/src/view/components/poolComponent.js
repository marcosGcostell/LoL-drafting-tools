import Component from './component.js';
import ChampionComponent from './championComponent.js';
import {
  PROFILE_CHAMPION_ITEM,
  CHAMPION_ON_HOLD_TEMPLATE,
  CHAMPION_TEMPLATE,
} from '../../utils/config';

export default class PoolComponent extends Component {
  constructor({ style, id }) {
    if (!style || !id) return undefined;
    const template =
      style === 'profile' ? PROFILE_CHAMPION_ITEM : CHAMPION_TEMPLATE;
    super({ style, id, type: 'pool', template });
    this._templateOnHold = null;
    this._templateOnHoldPromise = fetch(CHAMPION_ON_HOLD_TEMPLATE)
      .then(response => response.text())
      .then(data => {
        this._templateOnHold = data;
        return data;
      });
  }

  _getLastItem() {
    this._lastItemComponent = this.items.length
      ? this.items[this.items.length - 1]
      : null;
  }

  async load() {
    if (!this._template || !this._templateOnHold) {
      await Promise.all([this._templatePromise, this._templateOnHoldPromise]);
    }
    this.items = [];
    this._lastItemComponent = null;
    return this;
  }

  addPoolItem(champion) {
    const component = {
      style: this._style,
      id: this.id,
      champion,
      index: this.items.length,
    };
    const newItem = new ChampionComponent(component);
    this.items.push(newItem);
    this._getLastItem();
    newItem.preLoad(this._templateOnHold);
  }

  renderPoolItem(deleteHandler, bookmarkHandler = null, champion = null) {
    if (!champion) return;
    // FIXME need to handle this error
    if (!this.items.length || this._lastItemComponent?.fullyLoaded) {
      this.addPoolItem(champion);
    }
    this._lastItemComponent
      .fullLoad(this._template, champion)
      .bind(deleteHandler, bookmarkHandler);
  }

  removePoolItem(index) {
    this.items = this.items.filter((_, i) => i !== index);
    this.items.forEach((champion, i) => {
      if (i >= index) champion.changeIndex(i);
    });
    this._getLastItem();
  }

  clearPool() {
    this.items.forEach(champion => champion.remove());
    this.items = [];
    this._lastItemComponent = null;
  }
}
