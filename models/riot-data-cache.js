import Version from './riot-version-model.js';
import Champion from './riot-champion-model.js';
import { RiotRole, RiotRank } from './riot-static-model.js';
import { riotLolRolesArray, riotLolRanksArray } from './utils/config.js';

class RiotDataCache {
  constructor() {
    this.roleIdsArray = riotLolRolesArray;
    this.rankIdsArray = riotLolRanksArray;
    this._integrity = true;
  }

  get version() {
    return { id: this._version, createdAt: this._createdAt };
  }

  set version(version) {
    this._version = version?.id;
    this._createdAt = version?.createdAt;
  }

  get integrity() {
    return this._integrity;
  }

  set integrity(integrity) {
    this._integrity = integrity;
  }

  getLists(champions) {
    const idList = Object.keys(champions);
    const nameList = idList.map(el => champions[el].name);
    return { idList, nameList };
  }

  getData() {
    const data = {
      version: this._version,
      createdAt: this._createdAt,
      champions: this.champions,
      idList: this.idList,
      nameList: this.nameList,
      roles: this.roles,
      ranks: this.ranks,
    };

    return { data, integrity: this.integrity };
  }

  async loadAllFromDB() {
    const [version] = await Version.find();
    this.version = version;
    this.roles = await RiotRole.findAsObject();
    this.ranks = await RiotRank.findAsObject();
    this.champions = await Champion.findAsObject();
    Object.assign(this, this.getLists(this.champions));
  }
}

export default new RiotDataCache();
