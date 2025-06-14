import { LOCAL_API, APP_DATA, VERSION } from '../common/config.js';

///////////////////////////////////////

/**
 * @class AppData -
 * Manage Riot data stored in the local server
 * This class has an async task involved with its constructor
 * Should be call 'AppData.build()' and not 'new AppData()'
 */
export default class AppData {
  constructor(version, createdAt, roles, ranks, champions, idList, nameList) {
    this.version = version;
    this.createdAt = createdAt;
    this.roles = roles;
    this.ranks = ranks;
    this.champions = champions;
    this.idList = idList;
    this.nameList = nameList;
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
      return new AppData(
        data.version,
        data.createdAt,
        data.roles,
        data.ranks,
        data.champions,
        data.idList,
        data.nameList
      );
    } catch (err) {
      // TODO!! the error should be handled here. There is no re-throw
      console.error(err);
      throw err;
    }
  }

  static getFromJSON(obj) {
    if (!obj) return null;

    return new AppData(
      obj?.version,
      obj?.createdAt,
      obj?.roles,
      obj?.ranks,
      obj?.champions,
      obj?.idList,
      obj?.nameList
    );
  }

  // PRIVATE METHODS

  // PUBLIC METHODS
  SaveToJSON() {
    return {
      version: this.version,
      createdAt: this.createdAt,
      roles: this.roles,
      ranks: this.ranks,
      champions: this.champions,
      idList: this.idList,
      nameList: this.nameList,
    };
  }

  getChampionByName(championName) {
    const idResult = this.idList.find(
      id => this.champions[id].name === championName
    );
    return this.champions[idResult];
  }
}
