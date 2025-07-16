import { LS_USER_CACHE } from '../utils/config.js';

export default class UserCache {
  constructor(user) {
    // structuredClone doesn't work with objects extending EventTarget
    Object.assign(this, JSON.parse(JSON.stringify(user)));
    delete this.token;
    delete this.__type;
    delete this.response;

    this.#load();
    this.#save();
  }

  #load() {
    const localData = sessionStorage.getItem(LS_USER_CACHE);
    if (!localData) return;
    try {
      const parsed = JSON.parse(localData);
      if (Object.keys(parsed).length) {
        Object.assign(this, parsed);
      }
    } catch (err) {
      throw err;
    }
  }

  #save() {
    const data = { ...this };
    sessionStorage.setItem(LS_USER_CACHE, JSON.stringify(data));
  }

  setProfile(obj) {
    Object.assign(this, obj);
    this.#save();
  }

  setConfig(obj) {
    Object.assign(this.config, obj);
    this.#save();
  }

  setData(obj) {
    Object.assign(this.data, obj);
    this.#save();
  }

  setChampionPool(obj) {
    Object.assign(this.data.championPool, obj);
    this.#save();
  }

  deleteCache() {
    sessionStorage.removeItem(LS_USER_CACHE);
  }
}
