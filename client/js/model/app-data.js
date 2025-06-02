import { LOCAL_API, APP_DATA } from '../common/config.js';
import { riotLolRanks, riotLolRoles } from '../common/config.js';

///////////////////////////////////////

/**
 * @class AppData -
 * Manage Riot data stored in the local server
 * This class has an async task involved with its constructor
 * Should be call 'AppData.build()' and not 'new AppData()'
 */
class AppData {
  constructor(version, roles, ranks, champions, idList, nameList) {
    this.version = version;
    this.roles = roles;
    this.ranks = ranks;
    this.champions = champions;
    this.idList = idList;
    this.nameList = nameList;
  }

  // STATIC METHODS

  /**
   * @static @async @method build
   * Performs the async tasks before calling the constructor
   * @return {Promise<AppData>} Return the instance of the class.
   */
  static async build() {
    try {
      // TODO vesion, roles and ranks should come from the API
      const response = await fetch(`${LOCAL_API}${APP_DATA}`);
      const { data } = await response.json();
      const version = data.champions.Aatrox.version;
      return new AppData(
        version,
        riotLolRoles,
        riotLolRanks,
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

  // PRIVATE METHODS

  // PUBLIC METHODS

  getChampionByName(championName) {
    const idResult = this.idList.find(
      id => this.champions[id].name === championName
    );
    return this.champions[idResult];
  }
}

export default await AppData.build();
