import {
  LOCAL_API,
  APP_DATA_ROUTE,
  VERSION_ROUTE,
  LS_APP_DATA,
} from '../utils/config.js';
import { expirationDate } from '../utils/helpers.js';

///////////////////////////////////////

/**
 * @class AppData -
 * Manage Riot data stored in the local server
 * This class has an async task involved with its constructor
 * Should be instanciated with 'getFrom' static methods and not with new
 */
class AppData {
  constructor(data) {
    // Object.assign(this, data);
    // Better to write here all properties to know its content
    this.version = data.version;
    this.createdAt = data.version;
    this.champions = data.champions;
    this.idList = data.idList;
    this.nameList = data.nameList;
    this.roles = data.roles;
    this.ranks = data.ranks;
  }

  // STATIC METHODS

  static async checkVersion() {
    try {
      const response = await fetch(`${LOCAL_API}${VERSION_ROUTE}`);
      const { data } = await response.json();
      return data.version;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * @static @async @method getFromAPI
   * Performs the async tasks before calling the constructor
   * @return {Promise<AppData>} Return the instance of the class.
   */
  static async getFromAPI() {
    try {
      const response = await fetch(`${LOCAL_API}${APP_DATA_ROUTE}`);
      const { data } = await response.json();
      return new AppData(data);
    } catch (err) {
      // FIXME !! the error should be handled here. There is no re-throw
      console.error(err);
      throw err;
    }
  }

  static getFromJSON(localData) {
    if (!localData) return null;

    return new AppData(localData);
  }

  static async initAppData() {
    try {
      console.log('Initializing App...');
      let isCacheValid = false;
      const data = localStorage.getItem(LS_APP_DATA);
      if (data) {
        const cache = JSON.parse(data);
        const lastUpdated = new Date(cache.createdAt);
        if (lastUpdated < expirationDate()) {
          const newVersion = await AppData.checkVersion();
          if (newVersion === cache.version) {
            // Version expired but has not changed
            isCacheValid = true;
          }
        } else {
          // Version has not expired yet
          isCacheValid = true;
        }
      }

      if (isCacheValid) {
        console.log('Reading appData from browser...');
        // return instance set from JSON
        return AppData.getFromJSON(JSON.parse(data));
      }

      console.log('Reading appData from API...');
      const appData = await AppData.getFromAPI();
      localStorage.setItem(LS_APP_DATA, JSON.stringify(appData.SaveToJSON()));
      // return instance set form API
      return appData;
    } catch (error) {
      throw error;
    }
  }

  // PRIVATE METHODS

  // PUBLIC METHODS
  SaveToJSON() {
    return { ...this };
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
export default await AppData.initAppData();
