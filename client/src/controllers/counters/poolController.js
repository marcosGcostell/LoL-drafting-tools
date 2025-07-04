import PoolView from '../../view/counters/poolView.js';
import appState from '../../appState.js';

let poolView;

const _deletePoolItem = async index => {
  poolView.removeColumn(index);
  for (let i = index + 1; i < appState.pool.length; i++) {
    poolView.changeIndex(i, i - 1);
  }
  appState.removeFromPool(index);
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
  const { index, element } = e.detail;
  await poolView.render([element], {
    length: 1,
    index,
    onHold: true,
    noClear: true,
  });
};

export const showChampion = async (champion, index) => {
  _deletePoolItem(index);
  await poolView.render([champion], {
    length: 1,
    index,
    noClear: true,
  });
  poolView.addHandler(_deletePoolItem, index, 'close');
  poolView.addHandler(_bookmarkChampion, index, 'bookmark');
};

export const initView = () => {
  poolView = new PoolView();
  poolView.init();

  appState.addEventListener('pool:add', addPoolItem);
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
