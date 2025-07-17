import AppError from './appError.js';
import {
  LOCAL_API,
  APP_DATA_ROUTE,
  VERSION_ROUTE,
  LS_APP_DATA,
} from '../utils/config.js';

///////////////////////////////////////

class AppData {
  constructor() {
    this._isInitialized = false;
  }

  setData(data) {
    // Don't use Object.assign
    // Better to write here all properties to know its content
    this.version = data.version;
    this.createdAt = data.version;
    this.champions = data.champions;
    this.idList = data.idList;
    this.nameList = data.nameList;
    this.roles = data.roles;
    this.ranks = data.ranks;
    this.integrity = data.integrity;
  }

  async checkVersion() {
    const response = await fetch(`${LOCAL_API}${VERSION_ROUTE}`);
    const { data } = await response.json();
    if (!data.version) {
      throw new AppError(
        'Could not get the game version from Riot servers. App may not work. Try to reload',
        { origin: 'appData', type: 'version' },
      );
    }
    return data.version;
  }

  async getFromAPI() {
    const response = await fetch(`${LOCAL_API}${APP_DATA_ROUTE}`);
    const { data, integrity } = await response.json();
    if (!data.version) {
      throw new AppError(
        'Could not get the champion data from Riot servers. Try to reload',
        { origin: 'appData', type: 'champion' },
      );
    }

    data.integrity = integrity;
    return data;
  }

  async init() {
    if (this._isInitialized) return;

    console.log('Initializing App...');
    const data = localStorage.getItem(LS_APP_DATA);
    if (data) {
      const cache = JSON.parse(data);
      const newVersion = await this.checkVersion();
      if (newVersion === cache.version) {
        // Version has not changed, set from localStorage
        console.log('Reading appData from browser...');
        this.setData(cache);
        this._isInitialized = true;
        return;
      }
    }

    // There is a new version, set form API
    console.log('Reading appData from API...');
    const newData = await this.getFromAPI();
    localStorage.setItem(LS_APP_DATA, JSON.stringify(newData));
    this.setData(newData);
    this._isInitialized = true;
  }

  toSortedArray(property) {
    return Object.values(this[property]).sort((a, b) => a.index - b.index);
  }

  getChampionByName(championName) {
    const idResult = this.idList.find(
      id =>
        this.champions[id].name === championName ||
        this.champions[id].id === championName ||
        this.champions[id].riotId === championName,
    );
    return this.champions[idResult];
  }
}

// export instance as Singleton
export default new AppData();
