import PoolView from '../../view/counters/poolView.js';
import appState from '../../appState.js';

let poolView;

const hidePopUps = e => {
  const exclude = e.detail?.exclude || null;
  const popUpsIds = ['search'];
  popUpsIds.forEach(id => {
    const comp = poolView.components[id];
    if (comp.isVisible && comp.id !== exclude) comp.toggle();
  });
  appState.popUpOn = exclude || '';
};

const togglePopUp = component => {
  if (appState.popUpOn) appState.hideAllPopUps(component.id);

  appState.popUpOn = component.isVisible ? component.id : '';
};

const getPickedChampion = component => {
  appState.popUpOn = '';

  if (component.value) appState.addToPool(component.value);
  // TODO Handle a possible error with no champion return
};

const deleteHandler = component => {
  const { index } = component;
  poolView.pool.removePoolItem(index);
  appState.removeFromPool(index);
};

const bookmarkHandler = component => {
  console.log('bookmar pressed for: ', component.index);
};

const addPoolItem = e => {
  const { champion } = e.detail;
  poolView.pool.addPoolItem(champion);
};

const showChampion = e => {
  const { index, champion } = e.detail;
  if (index !== poolView.pool.items.length - 1) return;
  // FIXME Need to handle this error
  poolView.pool.renderPoolItem(deleteHandler, bookmarkHandler, champion);
};

const showAllPoolFromState = () => {
  if (!appState.pool.length) return;

  poolView.pool.clearPool();
  appState.pool.forEach(champion =>
    poolView.pool.renderPoolItem(deleteHandler, bookmarkHandler, champion),
  );
};

const poolOnHold = () => {
  if (!appState.pool.length) return;

  poolView.pool.clearPool();
  appState.pool.forEach(champion => poolView.pool.addPoolItem(champion));
};

const clearPool = () => poolView.pool.clearPool();

// Init funcion for the view
export default async () => {
  poolView = new PoolView();
  await poolView.initView('counters', 'counters');

  poolView.components.search.bindHandlers(getPickedChampion, togglePopUp);

  appState.addEventListener('pool:add', addPoolItem);
  appState.addEventListener('pool:added', showChampion);
  appState.addEventListener('pool:reset', clearPool);
  ['change:lane', 'change:bothLanes', 'change:rank', 'change:patch'].forEach(
    target => {
      appState.addEventListener(target, poolOnHold);
    },
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
  appState.addEventListener('popup:hideAll', hidePopUps);
};
