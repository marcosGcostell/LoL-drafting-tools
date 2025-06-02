import { PERCENT_LIMIT, MAX_LIST_ITEMS } from '../common/config';

///////////////////////////////////////
// App state class

class State {
  _percentThreshold = PERCENT_LIMIT;
  _maxItemList = MAX_LIST_ITEMS;

  constructor() {
    this.tierList = [];
    this.counterList = [];
  }
}
