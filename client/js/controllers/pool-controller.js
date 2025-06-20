import * as dataModel from '../model/data-model.js';
import poolView from '../view/pool-view.js';
import appState from '../model/app-state.js';

const _getChampionStats = async champion => {
  return await dataModel.getChampionStats({
    state: {
      lane: appState.laneSelected,
      rank: appState.rankSelected,
      vslane: appState.vslaneSelected,
      champion: champion.id,
    },
  });
};

const _hasChanged = (champion, index) => {
  return (
    appState.pool[index].rank !== appState.rankSelected ||
    appState.pool[index].lane !== appState.laneSelected ||
    appState.pool[index].id !== champion.id
  );
};

// Get champion stats if champion is new or it has changed
// For adding champions it renders it on the pull and fire event
// For updating a champion, only save state and don't fire event
export async function getChampion(champion) {
  try {
    const { lane, rank, stats } = await _getChampionStats(champion);

    const completeChampion = { ...champion, lane, rank, ...stats };
    const index = appState.pool.length - 1;

    // Render the list (needs an array) (only for adding champions)
    await poolView.render([completeChampion], {
      length: [completeChampion].length,
      index,
      noClear: true,
    });

    appState.completeChampion(completeChampion, index, true);
  } catch (error) {
    poolView.renderError();
  }
}

export async function updateChampion(champion, index) {
  if (!_hasChanged(champion, index)) return;

  const { lane, rank, stats } = await _getChampionStats(champion);
  const completeChampion = { ...champion, lane, rank, ...stats };
  appState.completeChampion(completeChampion, index, false);
}

export const showAllPool = async champions => {
  clearPool();
  poolView.render(champions, {
    length: champions.length,
    index: 0,
  });
};

export const poolOnHold = async () => {
  clearPool();
  poolView.render(appState.pool, {
    length: appState.pool.length,
    index: 0,
    onHold: true,
  });
};

export const clearPool = () => {
  poolView._clear();
};
