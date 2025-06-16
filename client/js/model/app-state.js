import { LS_STATE } from '../common/config.js';

///////////////////////////////////////
// App State class

class AppState extends EventTarget {
  constructor() {
    super();

    // Default values
    this.laneSelected = null;
    this.rankSelected = null;
    this.vslaneSelected = null;
    this.patchSelected = null;
    this.tierList = [];
    this.championsShowed = [];
    this.counterLists = [];
    this.popUpOn = '';

    // Load values from session
    const localData = sessionStorage.getItem(LS_STATE);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        Object.assign(this, parsed);
      } catch (err) {
        throw err;
      }
    }
  }

  // private setters to set property, save to session and notify
  // except adding or removing champions
  #update(target, value) {
    this[target] = value;
    this.#save();
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { target, value },
      })
    );
  }

  #updateChampions(action, champion) {
    this.#save();
    this.dispatchEvent(
      new CustomEvent('champion', {
        detail: { action, champion },
      })
    );
  }

  #save() {
    const data = { ...this };
    sessionStorage.setItem(LS_STATE, JSON.stringify(data));
  }

  // Publics setters
  setLane(lane, vslane = undefined) {
    this.vslaneSelected = vslane ? vslane : lane;
    this.#update('laneSelected', lane);
  }

  setRank(rank) {
    this.#update('rankSelected', rank);
  }

  setVslane(vslane) {
    this.#update('vslaneSelected', vslane);
  }

  setPatch(patch) {
    this.#update('patchSelected', patch);
  }

  addChampion(champion, counterList) {
    this.championsShowed.push(champion);
    this.counterLists.push(counterList);
    this.#updateChampions('add', champion);
  }

  removeChampion(champion, counterList) {
    const index = this.championsShowed.indexOf(champion);
    if (index > -1) {
      this.championsShowed.splice(index, 1);
      this.counterLists.splice(index, 1);
      this.#updateChampions('remove', index);
    }
  }

  clear() {
    this.laneSelected = null;
    this.rankSelected = null;
    this.vslaneSelected = null;
    this.patchSelected = null;
    this.tierList = [];
    this.championsShowed = [];
    this.counterLists = [];
    this.#save();
    this.dispatchEvent(new CustomEvent('reset'));
  }
}

// Singleton instance
export default new AppState();
