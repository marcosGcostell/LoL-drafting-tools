import appData from './app-data.js';
import Patch from './patch-model.js';
import {
  LS_STATE,
  MAX_LIST_ITEMS,
  PICK_RATE_THRESHOLD,
} from '../common/config.js';

///////////////////////////////////////
// App State class

class AppState extends EventTarget {
  constructor() {
    super();

    // Default values
    this.#defaultValues();
    this.popUpOn = 'starter';

    // Load values from session
    const localData = sessionStorage.getItem(LS_STATE);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        Object.assign(this, parsed);
        // Patch is saved as object literal. Need to rebuild the class
        const patchSelected = parsed.patch._patchState;
        this.patch = new Patch(appData.version);
        this.patch.setState(patchSelected);
        // On reload hide any pop-ups
        if (this.popUpOn !== 'starter') {
          this.popUpOn = '';
        }
      } catch (err) {
        throw err;
      }
    }
  }

  #defaultValues() {
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
    this.user = {
      name: null,
      token: null,
    };
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

  // Publics setters
  setOption(target, value) {
    if (target !== 'patch') {
      this[target] = value;
    }
    if (target === 'lane') {
      this.vslane = value;
    }
    this.#save();
    this.dispatchEvent(
      new CustomEvent('options', {
        detail: { target, value },
      })
    );
  }

  setSetting(target, value) {
    this[target] = value;
    this.#save();
    this.dispatchEvent(
      new CustomEvent('settings', {
        detail: { target, value },
      })
    );
  }

  addChampion(champion) {
    if (this.pool.find(el => el.id === champion.id)) return;
    this.pool.push(champion);
    this.#updateChampions('add', champion, true);
  }

  completeChampion(champion, index, fireEvent) {
    this.pool[index] = champion;
    this.#updateChampions('stats', champion, fireEvent);
  }

  removeChampion(index) {
    if (index < this.pool.length) {
      this.pool.splice(index, 1);
      this.statsLists.splice(index, 1);
      this.fixedStatsLists.splice(index, 1);
      this.statsListsOwner.splice(index, 1);
      this.#updateChampions('remove', index, true);
    }
  }

  addTierlist(tierlist) {
    this.tierlist = tierlist;
    this.tierlistLane = this.vslane;
    this.fixTierlist();
    this.#save();
  }

  fixTierlist() {
    this.fixedTierlist = this.tierlist.slice(0, this.maxListItems);
    const matchingItemsCount = this.fixedTierlist.findIndex(
      el => el.pickRate < this.pickRateThreshold
    );
    this.fixedTierlist.splice(matchingItemsCount);
  }

  addStatsList(statsList, owner, index) {
    if (index < this.statsLists.length) {
      this.statsLists[index] = statsList;
    } else {
      index = this.statsLists.length;
      this.statsLists.push(statsList);
      this.fixedStatsLists.push([]);
      this.statsListsOwner.push(owner);
    }
    this.fixStatsList(index);
    this.#save();
  }

  updateStatsList(statsList, index) {
    if (index >= this.statsLists.length) return false;
    this.statsLists[index] = statsList;
    this.fixStatsList(index);
    this.#save();
    return true;
  }

  fixStatsList(index) {
    this.fixedStatsLists[index] = this.statsLists[index].slice(
      0,
      this.fixedTierlist.length
    );
  }

  resetPool() {
    this.pool = [];
    this.statsLists = [];
    this.fixedStatsLists = [];
    this.statsListsOwner = [];
    this.#save();
  }

  resetAll() {
    this.#defaultValues();
    this.#save();
    this.dispatchEvent(new CustomEvent('reset'));
  }

  freshInit() {
    this.popUpOn = 'starter';
    this.#save();
  }
}

// Singleton instance
export default new AppState();
