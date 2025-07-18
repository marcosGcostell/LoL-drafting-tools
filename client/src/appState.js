import appData from './model/appData.js';
import user from './model/userModel.js';
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

    // Load values from session
    const localData = sessionStorage.getItem(LS_STATE);
    if (localData) {
      try {
        // Need a reviver to restore class instances
        const parsed = JSON.parse(localData, reviver);
        Object.assign(this, parsed);
      } catch (err) {
        throw err;
      }
    }

    // Events redirected from user events
    user.addEventListener('login', this.#loginUser.bind(this));
    user.addEventListener('logout', this.resetAll.bind(this));
  }

  #defaultValues() {
    this.appMode = 'counters';
    this.currentPage = 'starter';
    this.silentMode = false;
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
    this.user = user;
    this.popUpOn = '';
  }

  async #setUserDefaults() {
    this.lane = user.data.primaryRole || this.lane;
    this.vslane = this.lane;
    this.rank = user.data.rank;
    this.patch.mode = user.data.patch;
    this.maxListItems = user.config.maxListItems;
    this.pickRateThreshold = user.config.pickRateThreshold;
    await this.setOption('lane', this.lane);
  }

  async #getPoolFromUser() {
    const pool = user.data.championPool[this.lane];
    if (pool?.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const champion of pool) {
        // eslint-disable-next-line no-await-in-loop
        await this.addToPool(appData.getChampionByName(champion));
      }
    }
  }

  async #loginUser() {
    if (this.currentPage !== 'counters') {
      this.silentMode = true;
    }
    await this.#setUserDefaults();
    this.silentMode = false;
    this.#save();
    this.dispatchEvent(new Event('user:login'));
  }

  #save() {
    const data = { ...this };
    sessionStorage.setItem(LS_STATE, JSON.stringify(data));
  }

  #fixTierlist() {
    this.fixedTierlist = this.tierlist.slice(0, this.maxListItems);
    const matchingItemsCount = this.fixedTierlist.findIndex(
      el => el.pickRate < this.pickRateThreshold,
    );
    this.fixedTierlist.splice(matchingItemsCount);
  }

  #fixStatsList(index) {
    this.fixedStatsLists[index] = this.statsLists[index].slice(
      0,
      this.fixedTierlist.length,
    );
  }

  #fixAllStatsLists() {
    this.pool.forEach((_, index) => this.#fixStatsList(index));
  }

  //////////////////////////////////////////
  // Publics setters to react from controllers
  initFromStarter(lane) {
    if (!lane) return -1;

    this.lane = lane;
    this.vslane = lane;
    this.#save();
  }

  async initFromCounters() {
    try {
      if (!this.vslane) this.initFromStarter('top');
      if (this.vslane !== this.tierlistLane) {
        await dataModel.getNewTierlist(this);
      }
      this.dispatchEvent(new Event('app:reload'));
    } catch (err) {
      this.dispatchEvent(
        new CustomEvent('error:initCounters', {
          detail: {
            target: 'tierlist',
            message:
              'Somethig went wrong with the server. Try to reload the app',
          },
        }),
      );
    }
  }

  setAppMode(appMode) {
    this.appMode = appMode;
    this.#save();
  }

  setCurrentPage(currentPage) {
    this.currentPage = currentPage;
    this.#save();
  }

  userUpdated() {
    this.dispatchEvent(new CustomEvent('user:login'));
  }

  triggerPopUp(target) {
    this.dispatchEvent(new CustomEvent(`popup:${target}`));
  }

  hideAllPopUps(exclude = null) {
    this.dispatchEvent(
      new CustomEvent('popup:hideAll', {
        detail: { exclude },
      }),
    );
  }

  // Change and update events: 'lane', 'bothLanes', 'rank', 'vslane', 'patch'
  async setOption(target, value) {
    let eventTarget = target;

    if (target === 'patch') {
      this.patch.mode = value;
    } else {
      this[target] = value;
    }

    if (target === 'lane') {
      if (!this.tierlist.length || this.tierlistLane !== value) {
        this.vslane = value;
        eventTarget = 'bothLanes';
      }
      this.resetPool();
    }

    this.#save();
    if (!this.silentMode) {
      // Event to display waiters
      this.dispatchEvent(
        new CustomEvent(`change:${eventTarget}`, {
          detail: { target: eventTarget, value },
        }),
      );
    }

    try {
      await dataModel.updateData(eventTarget, this);

      // Event to update views
      if (!this.silentMode) {
        this.dispatchEvent(
          new CustomEvent(`updated:${eventTarget}`, {
            detail: { target: eventTarget, value },
          }),
        );
      }

      if (this.user.isLoggedIn() && target === 'lane') {
        await this.#getPoolFromUser();
      }
    } catch (err) {
      const errorMessage = err.isOperational ? `${err.message} ` : '';
      const message =
        err.isOperational && err.origin === 'api'
          ? errorMessage
          : `Somethig went wrong with the server. ${errorMessage}Try to reload the app`;
      this.dispatchEvent(
        new CustomEvent('error:option', {
          detail: {
            target: eventTarget,
            message,
          },
        }),
      );
    }
  }

  setSetting(target, value) {
    this[target] = value;
    this.#fixTierlist();
    this.#fixAllStatsLists();
    this.#save();
    if (!this.silentMode) {
      this.dispatchEvent(
        new CustomEvent('updated:settings', { detail: { target, value } }),
      );
    }
  }

  async addToPool(champion) {
    if (this.pool.find(el => el.id === champion.id)) return;

    if (!this.silentMode) {
      this.dispatchEvent(
        new CustomEvent('pool:add', {
          detail: { index: this.pool.length, champion },
        }),
      );
    }

    try {
      await dataModel.getNewData(champion, this);

      const index = this.pool.length - 1;
      if (!this.silentMode) {
        this.dispatchEvent(
          new CustomEvent('pool:added', {
            detail: {
              index,
              champion: this.pool[index],
              stats: this.fixedStatsLists[index],
            },
          }),
        );
      }
    } catch (err) {
      const message = err.isOperational ? `${err.message} ` : '';
      this.dispatchEvent(
        new CustomEvent('error:pool', {
          detail: {
            target: 'pool',
            message: `Somethig went wrong with the server. ${message}Try to reload the app`,
          },
        }),
      );
    }
  }

  removeFromPool(index) {
    if (index < this.pool.length) {
      this.pool.splice(index, 1);
      this.statsLists.splice(index, 1);
      this.fixedStatsLists.splice(index, 1);
      this.statsListsOwner.splice(index, 1);
      this.#save();
      if (!this.silentMode) {
        this.dispatchEvent(
          new CustomEvent('pool:remove', { detail: { index } }),
        );
      }
    }
  }

  resetPool() {
    this.pool = [];
    this.statsLists = [];
    this.fixedStatsLists = [];
    this.statsListsOwner = [];
    this.#save();
    if (!this.silentMode) {
      this.dispatchEvent(new CustomEvent('pool:reset'));
    }
  }

  resetAll() {
    this.#defaultValues();
    sessionStorage.removeItem(LS_STATE);
    if (this.user.isLoggedIn()) {
      this.user.logout({ fireEvent: false });
    }
    this.dispatchEvent(new CustomEvent('user:logout'));
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
    this.pool.forEach((el, index) => {
      this.statsListsOwner[index] = el.id;
    });
    this.#fixAllStatsLists();
    this.#save();
  }
}

// Singleton instance
export default new AppState();
