///////////////////////////////////////
// Riot Class
/**
 *
 * @class Riot -
 * API to get data from Riot Servers
 * @property {String} dataDragon (#) base url of the website.
 * @property {Boolean} locale (#) locale language settings.
 * @property {Map} championFolders Map key='Champion name' value='folder'.
 * @property {Boolean} listIntegrity true if all Champion names in the map are ok.
 *
 * PUBLIC METHODS
 * @method #getChampionData Get champions complete data from Riot servers
 * @method getLastVersion Get last verion from Riot servers
 * @method updateDataFromServer Returns an array of objects with selected champion data
 */

export default class Riot {
  static #dataDragon = 'https://ddragon.leagueoflegends.com/';
  static #locale = 'en_US';

  constructor() {}

  // PRIVATE METHODS

  /**
   * @async @method #getChampionData
   * Gets the League of Legends' champion data from Riot API
   * @param {String} version Version patch of the data.
   * @return {Promise<Object>} Object where every champion is a property.
   */
  static async #getChampionData(version) {
    const url = `${this.#dataDragon}cdn/${version}/data/${
      this.#locale
    }/champion.json`;

    try {
      const response = await fetch(url);
      const lolChampions = await response.json();

      return lolChampions.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // PUBLIC METHODS

  /**
   * @async @method getLastVersion
   * Gets the League of Legends' last version from Riot API
   * @return {Promise<String>} The last version.
   */
  static async getLastVersion() {
    const url = `${this.#dataDragon}api/versions.json`;

    try {
      const response = await fetch(url);
      const [data] = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * @async @method updateDataFromServer
   * Read updated version of champions' data from Riot API
   * and create an object with a reduced info version of all the champions
   * Calls to save data
   * @param {String} version Version patch of the data. No arg, get the last version
   * @return {Promise<Object>} Object where every champion is a property.
   */
  static async updateDataFromServer(version = null) {
    // No version passed, gets the last version
    try {
      if (!version) version = await this.getLastVersion();

      const lolChampions = await this.#getChampionData(version);
      const championsData = {};

      // In championsData create an object for each champion with some data
      Object.keys(lolChampions).forEach(
        championName =>
          (championsData[championName] = {
            version: lolChampions[championName].version,
            id: lolChampions[championName].id,
            key: lolChampions[championName].key,
            name: lolChampions[championName].name,
            img: lolChampions[championName].image.full,
          })
      );

      return championsData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
