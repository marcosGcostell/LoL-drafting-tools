import appState from '../appState.js';
import * as tierlistModel from './tierlistModel.js';
import * as poolModel from './poolModel.js';
import * as statsModel from './statsModel.js';

export async function getNewTierlist() {
  try {
    const tierlist = await tierlistModel.getTierlist(appState);
    appState.addTierlist(tierlist);
  } catch (err) {
    throw err;
  }
}

export async function getNewData(champion) {
  try {
    const pool = await poolModel.getChampion(champion, appState);
    appState.saveNewChampion(pool);

    const stats = await statsModel.getStatsList(pool, appState);
    appState.addStatsList(stats, champion.id);
  } catch (err) {
    throw err;
  }
}

export async function updateData(target) {
  try {
    if (['bothLanes', 'vslane', 'rank', 'patch'].includes(target)) {
      await getNewTierlist();
    }

    if (appState.pool.length) {
      const pool = [];
      const stats = [];
      for (const champion of appState.pool) {
        if (['lane', 'bothLanes', 'rank', 'patch'].includes(target)) {
          const poolItem = await poolModel.getChampion(champion, appState);
          pool.push(poolItem);
        }
        // TODO get all stats list too
        const owner = pool.length ? pool[pool.length - 1] : champion;
        const statsList = await statsModel.getStatsList(owner, appState);
        stats.push(statsList);
      }

      if (pool.length) appState.updateAllChampions(pool);
      appState.updateAllStatsLists(stats);
    }
  } catch (err) {
    throw err;
  }
}
