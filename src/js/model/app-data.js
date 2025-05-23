import { RIOT_DATA_JSON } from '../common/config.js';

///////////////////////////////////////
// App data class

class AppData {
  async init() {
    try {
      const { version, champions, roles, ranks } =
        await this._getRiotDataFromStorage();
      this.ranks = ranks;
      this.roles = roles;
      this.version = version;
      this.riotChampionData = champions;
      this.riotChampionIds = Object.keys(champions);
      this.riotChampionNames = this._getChampionNames();
    } catch (err) {
      // TODO!! the error should be handled here. There is no re-throw
      throw err;
    }
  }

  async _getRiotDataFromStorage() {
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

  _getChampionNames() {
    const championNames = [];
    this.riotChampionIds.forEach(champion =>
      championNames.push(this.riotChampionData[champion].name)
    );
    return championNames;
  }

  async saveAppData() {
    // This method works only in node.js

    try {
      const riotData = {
        version: this.version,
        champions: this.riotChampionData,
        roles: this.roles,
        ranks: this.ranks,
      };
      console.log(`Saving data file: ${RIOT_DATA_JSON}`);
      await writeFile(riotDataPath, JSON.stringify(riotData, null, 2));
      console.log('[Saved]');
      // console.log(`Saving champions file: ${JSON_CHAMPIONS}`);
      // await writeFile(championsPath, JSON.stringify(champions, null, 2));
      // console.log('[Saved]');
    } catch (error) {
      console.error('❌ Error al guardar el archivo:', error);
    }
  }
}

export default new AppData();
