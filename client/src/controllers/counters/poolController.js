import * as dataModel from '../../model/dataModel.js';
import PoolView from '../../view/counters/poolView.js';
import appState from '../../appState.js';

let poolView;

const _getChampionStats = async champion => {
  return await dataModel.getChampionStats({
    state: {
      lane: appState.lane,
      rank: appState.rank,
      vslane: appState.vslane,
      patch: appState.patch.toApi(),
      champion: champion.id,
    },
  });
};

const _hasChanged = (champion, index) => {
  return (
    appState.pool[index].rank !== appState.rank ||
    appState.pool[index].lane !== appState.lane ||
    appState.pool[index].patch !== appState.patch.toApi() ||
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

const _showNewChampion = async (champions, index) => {
  await poolView.render(champions, {
    length: champions.length,
    index,
    noClear: true,
  });
  poolView.addHandler(_deleteChampion, index, 'close');
  poolView.addHandler(_bookmarkChampion, index, 'bookmark');
};

// Get champion stats if champion is new or it has changed
// For adding champions (updateIndex = null) renders it and fire event
// For updating a champion, only save state and don't fire event
export async function getChampion(champion, updateIndex = -1) {
  try {
    if (updateIndex >= 0 && !_hasChanged(champion, updateIndex)) return;

    const { lane, rank, patch, stats } = await _getChampionStats(champion);

    const completeChampion = {
      ...champion,
      lane,
      rank,
      patch,
      ...stats,
    };
    const index = updateIndex < 0 ? appState.pool.length - 1 : updateIndex;

    if (updateIndex < 0) {
      // Render the list (needs an array) (only for adding champions)
      await _showNewChampion([completeChampion], index);
    }

    appState.completeChampion(completeChampion, index, updateIndex < 0);
  } catch (error) {
    poolView.renderError();
  }
}

export const initView = () => {
  poolView = new PoolView();
  poolView.init();
};

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
};

export const clearPool = () => {
  poolView._clear();
};
