import PoolView from '../../view/counters/poolView.js';
import appState from '../../appState.js';
import { hideAllPopUps } from '../backgroundController.js';

let poolView;

export const hidePopUps = (exclude = null) => {
  const popUpsIds = ['search'];
  popUpsIds.forEach(id => {
    const comp = poolView.components[id];
    if (comp.isVisible && comp.id !== exclude) comp.toggle();
  });
};

const togglePopUp = component => {
  if (appState.popUpOn) hideAllPopUps(component.id);

  appState.popUpOn = component.isVisible ? component.id : '';
};

const getPickedChampion = component => {
  appState.popUpOn = '';

  if (component.value) appState.addToPool(component.value);
  // TODO Handle a possible error with no champion return
};

const deleteHandler = component => {
  const index = component.index;
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
  for (const champion of appState.pool) {
    poolView.pool.renderPoolItem(deleteHandler, bookmarkHandler, champion);
  }
};

const poolOnHold = () => {
  if (!appState.pool.length) return;

  poolView.pool.clearPool();
  appState.pool.forEach(champion => poolView.pool.addPoolItem(champion));
};

const clearPool = () => poolView.pool.clearPool();

export const init = async () => {
  poolView = new PoolView();
  await poolView.initView('counters', 'counters');

  poolView.components.search.bind(getPickedChampion, togglePopUp);

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
};
