import getTierlist from './tierlistModel.js';
import getChampion from './poolModel.js';
import getStatsList from './statsModel.js';

export const getNewTierlist = async appState => {
  try {
    const tierlist = await getTierlist(appState);
    appState.addTierlist(tierlist);
  } catch (err) {
    throw err;
  }
};

export const getNewData = async (champion, appState) => {
  try {
    const pool = await getChampion(champion, appState);
    appState.saveNewChampion(pool);

    const stats = await getStatsList(pool, appState);
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
        getChampion(champion, appState),
      );
      const pool = await Promise.all(poolPromises);
      appState.updateAllChampions(pool);
    }

    const statsPromises = appState.pool.map(champion =>
      getStatsList(champion, appState),
    );

    const stats = await Promise.all(statsPromises);
    appState.updateAllStatsLists(stats);
  } catch (err) {
    throw err;
  }
};
