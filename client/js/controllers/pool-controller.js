import * as dataModel from '../model/data-model.js';
import poolView from '../view/pool-view.js';
import appState from '../model/app-state.js';

const _getChampionStats = async champion => {
  return await dataModel.getChampionStats({
    state: {
      lane: appState.laneSelected,
      rank: appState.rankSelected,
      vslane: appState.vslaneSelected,
      patch: appState.patchSelected ? '' : '7',
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

const _deleteChampion = async index => {
  poolView.removeColumn(index);
  for (let i = index + 1; i < appState.pool.length; i++) {
    poolView.changeIndex(i, i - 1);
  }
  appState.removeChampion(index);
};

const _bookmarkChampion = index => {
  console.log('bookmar pressed for: ', index);
};

const _resetPoolHandlers = () => {
  appState.pool.forEach((_, index) => {
    poolView.addHandler(_deleteChampion, index, 'close');
    poolView.addHandler(_bookmarkChampion, index, 'bookmark');
  });
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
    poolView.addHandler(_deleteChampion, index, 'close');
    poolView.addHandler(_bookmarkChampion, index, 'bookmark');

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
  await poolView.render(champions, {
    length: champions.length,
    index: 0,
  });
  _resetPoolHandlers();
};

export const poolOnHold = async () => {
  clearPool();
  await poolView.render(appState.pool, {
    length: appState.pool.length,
    index: 0,
    onHold: true,
  });
  _resetPoolHandlers();
};

export const clearPool = () => {
  poolView._clear();
};
