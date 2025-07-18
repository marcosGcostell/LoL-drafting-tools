import Tierlist from './tierlist-model.js';
import { riotLolRolesArray } from './utils/config.js';

class TierlistCache {
  constructor() {
    // key: lane_rank_patch, value: tierlist document
    this.cache = new Map();
  }

  _getKey({ lane, rank, patch }) {
    return `${lane}_${rank}_${patch}`;
  }

  // Returns an object { tierlist, createdAt }
  load(query) {
    return this.cache.get(this._getKey(query));
  }

  loadAllLanes(query) {
    return riotLolRolesArray.map(lane =>
      this.cache.load(
        this._getKey({ lane, rank: query.rank, patch: query.patch }),
      ),
    );
  }

  // doc schema as db { lane, rank, patch, createdAt, list }
  save(doc) {
    this.cache.set(this._getKey(doc), {
      tierlist: doc.list,
      createdAt: doc.createdAt,
    });
  }

  saveMany(docs) {
    if (!Array.isArray(docs)) return;

    docs.forEach(doc => this.save(doc));
  }

  remove(query) {
    this.cache.delete(this._getKey(query));
  }

  async loadAllFromDB() {
    const allTierlists = await Tierlist.find();
    allTierlists.forEach(doc => this.save(doc));
  }
}

export default new TierlistCache();
