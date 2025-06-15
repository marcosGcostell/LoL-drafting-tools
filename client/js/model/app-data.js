import { LOCAL_API, APP_DATA, VERSION } from '../common/config.js';

///////////////////////////////////////

/**
 * @class AppData -
 * Manage Riot data stored in the local server
 * This class has an async task involved with its constructor
 * Should be instanciated with 'getFrom' static methods and not 'new AppData()'
 */
export default class AppData {
  constructor(data) {
    Object.assign(this, data);
  }

  // STATIC METHODS

  static async checkVersion() {
    try {
      const response = await fetch(`${LOCAL_API}${VERSION}`);
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
      const response = await fetch(`${LOCAL_API}${APP_DATA}`);
      const { data } = await response.json();
      return new AppData(data);
    } catch (err) {
      // TODO!! the error should be handled here. There is no re-throw
      console.error(err);
      throw err;
    }
  }

  static getFromJSON(localData) {
    if (!localData) return null;

    return new AppData(localData);
  }

  // PRIVATE METHODS

  // PUBLIC METHODS
  SaveToJSON() {
    return { ...this };
  }

  toSortedArray(property, shift = false) {
    const output = Object.values(this[property]);
    output.sort((a, b) => a.index - b.index);
    if (shift) output.shift();
    return output;
  }

  getChampionByName(championName) {
    const idResult = this.idList.find(
      id => this.champions[id].name === championName
    );
    return this.champions[idResult];
  }
}
