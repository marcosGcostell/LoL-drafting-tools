import PoolView from '../../view/counters/poolView.js';
import appState from '../../appState.js';

let poolView;

const _deletePoolItem = async (index, fireEvent = true) => {
  poolView.removeColumn(index);
  for (let i = index + 1; i < appState.pool.length; i++) {
    poolView.changeIndex(i, i - 1);
  }
  if (fireEvent) appState.removeFromPool(index);
};

const _clearPool = () => {
  poolView._clear();
};

const _bookmarkChampion = index => {
  console.log('bookmar pressed for: ', index);
};

const _resetPoolHandlers = () => {
  appState.pool.forEach((_, index) => {
    poolView.addHandler(_deletePoolItem, index, 'close');
    poolView.addHandler(_bookmarkChampion, index, 'bookmark');
  });
};

const addPoolItem = async e => {
  const { index, champion } = e.detail;
  await poolView.render([champion], {
    length: 1,
    index,
    onHold: true,
    noClear: true,
  });
};

const showChampion = async e => {
  const { index, champion } = e.detail;
  _deletePoolItem(index, false);
  await poolView.render([champion], {
    length: 1,
    index,
    noClear: true,
  });
  poolView.addHandler(_deletePoolItem, index, 'close');
  poolView.addHandler(_bookmarkChampion, index, 'bookmark');
};

const showAllPoolFromState = async () => {
  _clearPool();
  if (!appState.pool.length) return;

  await poolView.render(appState.pool, {
    length: appState.pool.length,
    index: 0,
  });
  _resetPoolHandlers();
};

const poolOnHold = async () => {
  _clearPool();
  if (!appState.pool.length) return;

  await poolView.render(appState.pool, {
    length: appState.pool.length,
    index: 0,
    onHold: true,
  });
};

export const initView = () => {
  poolView = new PoolView();
  poolView.init();

  appState.addEventListener('pool:add', addPoolItem);
  appState.addEventListener('pool:added', showChampion);
  appState.addEventListener('pool:reset', _clearPool);
  ['change:lane', 'change:bothLanes', 'change:rank', 'change:patch'].forEach(
    target => {
      appState.addEventListener(target, poolOnHold);
    }
  );
  [
    'updated:lane',
    'updated:bothLanes',
    'updated:rank',
    'updated:patch',
    'app:reload',
  ].forEach(target => {
    appState.addEventListener(target, showAllPoolFromState);
  });
};
