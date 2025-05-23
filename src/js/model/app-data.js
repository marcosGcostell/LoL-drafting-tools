// import { writeFile } from 'fs/promises';
// import { resolve } from 'path';

import { RIOT_DATA_JSON } from '../common/config.js';

///////////////////////////////////////

/**
 * @class AppData -
 * Manage Riot data stored in the local server
 * This class has an async task involved with its constructor
 * Should be call 'AppData.build()' and not 'new AppData()'
 */
class AppData {
  constructor(version, champions, roles, ranks) {
    this.ranks = ranks;
    this.roles = roles;
    this.version = version;
    this.riotChampionData = champions;
    this.riotChampionIds = Object.keys(champions);
    this.riotChampionNames = this.#getChampionNames();
  }

  // STATIC METHODS

  /**
   * @static @async @method #getRiotDataFromLocalServer
   * Gets the stored Riot data from a JSON file
   * @return {Promise<Object>} Object with all used Riot data.
   */
  static async #getRiotDataFromLocalServer() {
    try {
      const response = await fetch(RIOT_DATA_JSON);
      return await response.json();
    } catch (err) {
      throw err;
    }

    // With Node.js
    // await fs.readFile(url, 'utf8', (err, data) => {
    //   if (err) throw err;
    //   return JSON.parse(data);
    // });
  }

  /**
   * @static @async @method build
   * Performs the async tasks before calling the constructor
   * @return {Promise<AppData>} Return the instance of the class.
   */
  static async build() {
    try {
      const { version, champions, roles, ranks } =
        await AppData.#getRiotDataFromLocalServer();
      return new AppData(version, champions, roles, ranks);
    } catch (err) {
      // TODO!! the error should be handled here. There is no re-throw
      console.error(err);
      throw err;
    }
  }

  // PRIVATE METHODS

  /**
   * @method #getChampionNames
   * Gets the names of the champions object
   * @return {Array<Sting>} the champion names.
   */
  #getChampionNames() {
    const championNames = [];
    this.riotChampionIds.forEach(champion =>
      championNames.push(this.riotChampionData[champion].name)
    );
    return championNames;
  }

  // PUBLIC METHODS

  /**
   * @method saveAppData
   * Store the Riot data into a JSON file (node.js)
   */
  async saveAppData() {
    // This method works only in node.js

    try {
      const riotDataPath = resolve(RIOT_DATA_JSON);

      const riotData = {
        version: this.version,
        champions: this.riotChampionData,
        roles: this.roles,
        ranks: this.ranks,
      };
      console.log(`Saving data file: ${RIOT_DATA_JSON}`);
      await writeFile(riotDataPath, JSON.stringify(riotData, null, 2));
      console.log('[Saved]');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default await AppData.build();
