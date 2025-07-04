import appData from './model/appData.js';
import User from './model/userModel.js';
import Patch from './model/patchModel.js';
import * as dataModel from './model/dataModel.js';
import { reviver } from './services/session.js';
import {
  LS_STATE,
  MAX_LIST_ITEMS,
  PICK_RATE_THRESHOLD,
} from './utils/config.js';

///////////////////////////////////////
// App State class

class AppState extends EventTarget {
  constructor() {
    super();

    // Default values
    this.#defaultValues();
    // this.popUpOn = 'starter';

    // Load values from session
    const localData = sessionStorage.getItem(LS_STATE);
    if (localData) {
      try {
        // Need a reviver to restore class instances
        const parsed = JSON.parse(localData, reviver);
        Object.assign(this, parsed);

        // On reload hide any pop-ups
        // if (this.popUpOn !== 'starter') {
        //   this.popUpOn = '';
        // }
      } catch (err) {
        throw err;
      }
    }

    // Events redirected from User events
    this.user.addEventListener('login', () =>
      this.dispatchEvent(new Event('user:login'))
    );
    this.user.addEventListener('logout', () =>
      this.dispatchEvent(new Event('user:logout'))
    );
  }

  #defaultValues() {
    this.appMode = 'counters';
    this.lane = null;
    this.rank = 'all';
    this.vslane = null;
    this.patch = new Patch(appData.version);
    this.maxListItems = MAX_LIST_ITEMS;
    this.pickRateThreshold = PICK_RATE_THRESHOLD;
    this.tierlist = [];
    this.fixedTierlist = [];
    this.tierlistLane = null;
    this.pool = [];
    this.statsLists = [];
    this.fixedStatsLists = [];
    this.statsListsOwner = [];
    this.user = User;
    this.popUpOn = '';
  }

  // save after adding/removing champions to session and notify
  #updateChampions(action, element, fireEvent) {
    this.#save();
    if (fireEvent) {
      this.dispatchEvent(
        new CustomEvent('pool', {
          detail: { action, element },
        })
      );
    }
  }

  #save() {
    const data = { ...this };
    sessionStorage.setItem(LS_STATE, JSON.stringify(data));
  }

  #fixTierlist() {
    this.fixedTierlist = this.tierlist.slice(0, this.maxListItems);
    const matchingItemsCount = this.fixedTierlist.findIndex(
      el => el.pickRate < this.pickRateThreshold
    );
    this.fixedTierlist.splice(matchingItemsCount);
  }

  #fixStatsList(index) {
    this.fixedStatsLists[index] = this.statsLists[index].slice(
      0,
      this.fixedTierlist.length
    );
  }

  #fixAllStatsLists() {
    this.pool.forEach((_, index) => this.#fixStatsList(index));
  }

  //////////////////////////////////////////
  // Publics setters to react from controllers
  freshStart(lane) {
    if (!lane) return -1;

    this.lane = lane;
    this.vslane = lane;
    this.#save();
  }

  // Change and update events: 'lane', 'bothLanes', 'rank', 'vslane', 'patch'
  async setOption(target, value) {
    let eventTarget = target;
    this[target] = value;
    if (target === 'lane' && (this.vslane !== value || !this.tierlist.length)) {
      this.vslane = value;
      eventTarget = 'bothLanes';
    }
    this.#save();
    // Event to display waiters
    this.dispatchEvent(
      new CustomEvent(`change:${eventTarget}`, {
        detail: { target, value },
      })
    );

    const { tierlist, pool, stats } = await dataModel.updateData(target);

    if (pool) {
      this.pool = pool;
    }
    if (stats) {
      stats.forEach((list, index) => this.updateStatsList(list, index));
    }
    this.#save();

    // Event to update views
    this.dispatchEvent(
      new CustomEvent(`updated:${eventTarget}`, {
        detail: { target, value },
      })
    );
  }

  setSetting(target, value) {
    this[target] = value;
    this.#fixTierlist();
    this.#fixAllStatsLists();
    this.#save();
    this.dispatchEvent(
      new CustomEvent('settings', {
        detail: { target, value },
      })
    );
  }

  async addToPool(champion) {
    if (this.pool.find(el => el.id === champion.id)) return;

    this.dispatchEvent(
      new CustomEvent('pool:add', {
        detail: { index: this.pool.length, element: champion },
      })
    );

    await dataModel.getNewData(champion);

    const index = this.pool.length - 1;
    this.dispatchEvent(
      new CustomEvent('pool:updated', {
        detail: {
          index,
          pool: this.pool[index],
          stats: this.fixedStatsLists[index],
        },
      })
    );
  }

  removeFromPool(index) {
    if (index < this.pool.length) {
      this.pool.splice(index, 1);
      this.statsLists.splice(index, 1);
      this.fixedStatsLists.splice(index, 1);
      this.statsListsOwner.splice(index, 1);
      this.#save();
      this.dispatchEvent(
        new CustomEvent('pool:remove', {
          detail: {
            index,
          },
        })
      );
    }
  }

  resetAll() {
    this.#defaultValues();
    sessionStorage.removeItem(LS_STATE);
    this.dispatchEvent(new CustomEvent('reset'));
  }

  //////////////////////////////////////////
  // Publics setters for saving data from models
  addTierlist(tierlist) {
    this.tierlist = tierlist;
    this.tierlistLane = this.vslane;
    this.#fixTierlist();
    this.#save();
  }

  saveNewChampion(champion) {
    this.pool.push(champion);
    this.#save();
  }

  updateChampion(champion, index) {
    if (index >= this.pool.length) return false;
    this.pool[index] = champion;
    this.#save();
    return true;
  }

  updateAllChampions(pool) {
    this.pool = pool;
    this.#save();
  }

  addStatsList(statsList, owner) {
    this.statsLists.push(statsList);
    this.statsListsOwner.push(owner);
    this.#fixStatsList(this.statsLists.length - 1);
    this.#save();
  }

  updateStatsList(statsList, index) {
    if (index >= this.statsLists.length) return false;
    this.statsLists[index] = statsList;
    this.statsListsOwner[index] = this.pool[index].id;
    this.#fixStatsList(index);
    this.#save();
    return true;
  }

  updateAllStatsLists(statsLists) {
    this.statsLists = statsLists;
    this.pool.forEach((el, index) => (this.statsListsOwner[index] = el.id));
    this.#fixAllStatsLists();
    this.#save();
  }

  resetPool() {
    this.pool = [];
    this.statsLists = [];
    this.fixedStatsLists = [];
    this.statsListsOwner = [];
    this.#save();
  }

  // freshInit() {
  //   this.popUpOn = 'starter';
  //   this.#save();
  // }
}

// Singleton instance
export default new AppState();
