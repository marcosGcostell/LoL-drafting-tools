import View from '../global/view.js';
import SearchComponent from '../components/searchComponent.js';
import PoolComponent from '../components/poolComponent.js';

export default class PoolView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.pool-section');
    this._errorMessage = 'No champion match that name...';
    this._message = 'Please, enter a champion name...';

    this.components = {};
    this.pool = {};
  }

  async initView(style, poolId) {
    this.components.search = new SearchComponent({
      style,
      id: 'search',
    });

    this.pool = new PoolComponent({ style, id: poolId });

    await Promise.all([this.components.search.load(), this.pool.load()]);
  }
}
