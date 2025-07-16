import * as tierlistModel from './tierlistModel.js';
import * as poolModel from './poolModel.js';
import * as statsModel from './statsModel.js';

export const getNewTierlist = async appState => {
  try {
    const tierlist = await tierlistModel.getTierlist(appState);
    appState.addTierlist(tierlist);
  } catch (err) {
    throw err;
  }
};

export const getNewData = async (champion, appState) => {
  try {
    const pool = await poolModel.getChampion(champion, appState);
    appState.saveNewChampion(pool);

    const stats = await statsModel.getStatsList(pool, appState);
    appState.addStatsList(stats, champion.id);
  } catch (err) {
    throw err;
  }
};

export const updateData = async (target, appState) => {
  try {
    if (['bothLanes', 'vslane', 'rank', 'patch'].includes(target)) {
      await getNewTierlist(appState);
    }

    if (!appState.pool.length) return;

    if (['lane', 'bothLanes', 'rank', 'patch'].includes(target)) {
      const poolPromises = appState.pool.map(champion =>
        poolModel.getChampion(champion, appState),
      );
      const pool = await Promise.all(poolPromises);
      appState.updateAllChampions(pool);
    }

    const statsPromises = appState.pool.map(champion =>
      statsModel.getStatsList(champion, appState),
    );

    const stats = await Promise.all(statsPromises);
    appState.updateAllStatsLists(stats);
  } catch (err) {
    throw err;
  }
};
