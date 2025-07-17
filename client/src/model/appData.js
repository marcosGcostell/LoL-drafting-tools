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
  }

  async checkVersion() {
    try {
      const response = await fetch(`${LOCAL_API}${VERSION_ROUTE}`);
      const { data } = await response.json();
      return data.version;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getFromAPI() {
    try {
      const response = await fetch(`${LOCAL_API}${APP_DATA_ROUTE}`);
      const { data } = await response.json();
      return data;
    } catch (err) {
      // FIXME !! the error should be handled here. There is no re-throw
      console.error(err);
      throw err;
    }
  }

  async init() {
    try {
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
    } catch (error) {
      throw error;
    }
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
