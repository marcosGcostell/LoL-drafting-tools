import { RIOT_DATA_DRAGON } from '../utils/config.js';

///////////////////////////////////////
// Riot Class
/**
 *
 * @class Riot -
 * API to get data from Riot Servers
 * @property {String} dataDragon (#) base url of the website.
 * @property {Boolean} locale (#) locale language settings.
 *
 * PUBLIC METHODS
 * @method #getChampionData Get champions complete data from Riot servers
 * @method getLastGameVersion Get last verion from Riot servers
 * @method getNewData Returns an array of objects with selected champion data
 */

class Riot {
  #dataDragon = RIOT_DATA_DRAGON;
  #locale = 'en_US';

  // PRIVATE METHODS

  /**
   * @async @method #getChampionData
   * Gets the League of Legends' champion data from Riot API
   * @param {String} version Version patch of the data.
   * @return {Promise<Object>} Object where every champion is a property.
   */
  async #getChampionData(version) {
    const url = `${this.#dataDragon}cdn/${version}/data/${
      this.#locale
    }/champion.json`;

    const response = await fetch(url);
    const lolChampions = await response.json();

    return lolChampions.data;
  }

  // PUBLIC METHODS

  /**
   * @async @method getLastGameVersion
   * Gets the League of Legends' last version from Riot API
   * @return {Promise<String>} The last version.
   */
  async getLastGameVersion() {
    const url = `${this.#dataDragon}api/versions.json`;

    const response = await fetch(url);
    const [data] = await response.json();
    return data;
  }

  /**
   * @async @method getNewData
   * Read updated version of champions' data from Riot API
   * and create an object with a reduced info version of all the champions
   * Calls to save data
   * @param {String} version Version patch of the data. No arg, get the last version
   * @return {Promise<Object>} Object where every champion is a property.
   */
  async getNewData(version = null) {
    // No version passed, gets the last version
    if (!version) version = await this.getLastGameVersion();

    const lolChampions = await this.#getChampionData(version);

    // Return an object where each champion is an object stored in a property
    // with some of the data selected from lolChampions
    return Object.values(lolChampions).reduce((acc, champion) => {
      acc[champion.id] = {
        version: champion.version,
        riotId: champion.id,
        key: champion.key,
        name: champion.name,
        img: champion.image.full,
        sprite: {
          file: champion.image.sprite,
          x: champion.image.x,
          y: champion.image.y,
          w: champion.image.w,
          h: champion.image.h,
        },
      };
      return acc;
    }, {});
  }
}

export default new Riot();
