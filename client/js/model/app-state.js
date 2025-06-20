import { LS_STATE } from '../common/config.js';

///////////////////////////////////////
// App State class

class AppState extends EventTarget {
  constructor() {
    super();

    // Default values
    this.laneSelected = null;
    this.rankSelected = 'all';
    this.vslaneSelected = null;
    this.patchSelected = null;
    this.tierlist = [];
    this.tierlistLane = null;
    this.pool = [];
    this.statsLists = [];
    this.statsListsOwner = [];
    this.popUpOn = 'starter';

    // Load values from session
    const localData = sessionStorage.getItem(LS_STATE);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        Object.assign(this, parsed);
        // On reload hide any pop-ups
        if (this.popUpOn !== 'starter') {
          this.popUpOn = '';
        }
      } catch (err) {
        throw err;
      }
    }
  }

  // private setter to set property, save to session and notify
  // except adding or removing champions
  #updateOptions(target, value) {
    this[target] = value;
    this.#save();
    this.dispatchEvent(
      new CustomEvent('options', {
        detail: { target, value },
      })
    );
  }

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
  setLane(lane, vslane = undefined) {
    this.vslaneSelected = vslane ? vslane : lane;
    this.#updateOptions('laneSelected', lane);
  }

  setRank(rank) {
    this.#updateOptions('rankSelected', rank);
  }

  setVslane(vslane) {
    this.#updateOptions('vslaneSelected', vslane);
  }

  setPatch(patch) {
    this.#updateOptions('patchSelected', patch);
  }

  addTierlist(tierlist) {
    this.tierlist = tierlist;
    this.tierlistLane = this.vslaneSelected;
    this.#save();
  }

  addChampion(champion) {
    this.pool.push(champion);
    this.#updateChampions('add', champion, true);
  }

  completeChampion(champion, index, fireEvent) {
    this.pool[index] = champion;
    this.#updateChampions('stats', champion, fireEvent);
  }

  removeChampion(champion) {
    const index = this.pool.indexOf(champion);
    if (index > -1) {
      this.pool.splice(index, 1);
      this.statsLists.splice(index, 1);
      this.statsListsOwner.splice(index, 1);
      this.#updateChampions('remove', index);
    }
  }

  addStatsList(statsList, owner, index) {
    if (index < this.statsLists.length) {
      this.statsLists[index] = statsList;
    } else {
      this.statsLists.push(statsList);
      this.statsListsOwner.push(owner);
    }
    this.#save();
  }

  updateStatsList(statsList, index) {
    if (index >= this.statsLists.length) return false;
    this.statsLists[index] = statsList;
    this.#save();
    return true;
  }

  resetPool() {
    this.pool = [];
    this.statsLists = [];
    this.statsListsOwner = [];
    this.#save();
  }

  resetAll() {
    this.laneSelected = null;
    this.rankSelected = 'all';
    this.vslaneSelected = null;
    this.patchSelected = null;
    this.tierlist = [];
    this.tierlistLane = null;
    this.pool = [];
    this.statsLists = [];
    this.statsListsOwner = [];
    this.#save();
    this.dispatchEvent(new CustomEvent('reset'));
  }
}

// Singleton instance
export default new AppState();
