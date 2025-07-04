import appState from '../../appState.js';
import appData from '../../model/appData.js';
import StatsView from '../../view/counters/statsView.js';

let statsView;

export const initView = () => {
  statsView = new StatsView();
  statsView.init();

  appState.addEventListener('pool:add', addStatsColumn);
  appState.addEventListener('pool:added', renderStatsList);
  appState.addEventListener('pool:remove', deleteStatsColumn);
  appState.addEventListener('pool:reset', clearStatsSection);
  [
    'change:lane',
    'change:bothLanes',
    'change:vslane',
    'change:rank',
    'change:patch',
  ].forEach(target => {
    appState.addEventListener(target, statsOnHold);
  });
  [
    'updated:lane',
    'updated:bothLanes',
    'updated:vslane',
    'updated:rank',
    'updated:patch',
    'settings',
    'reload',
  ].forEach(target => {
    appState.addEventListener(target, showAllStatsFromState);
  });
  appState.addEventListener('reset', clearStatsSection);
};

export const renderStatsList = async e => {
  const { index, stats } = e.detail;
  await statsView.render(statsList, { length: stats.length, index });
};

export const addStatsColumn = async e => {
  const { index } = e.detail;

  // Add the new column
  const newIndex = await statsView.addNewColumn();
  if (newIndex !== index) {
    throw new Error('Pool items does not match the stats columns...');
  }
  statsView.renderSpinner();
};

export const showStatsList = async index => {
  await renderStatsList(appState.fixedStatsLists[index], {
    length: appState.fixedStatsLists[index].length,
    index,
  });
};

export const deleteStatsColumn = index => {
  statsView.removeColumn(index);
  // the stat list has been removed from appState when removing the pool
  for (let i = index + 1; i <= appState.statsLists.length; i++) {
    statsView.changeIndex(i, i - 1);
  }
};

export const showAllStatsFromState = async () => {
  clearStatsSection();
  if (!appData.fixedStatsLists.length) return;
  for (const list of appData.fixedStatsLists) {
    const index = await statsView.addNewColumn();
    await renderStatsList(list, { length: list.length, index });
  }
};

export const statsOnHold = async () => {
  clearStatsSection();
  if (!appData.fixedStatsLists.length) return;
  for (const col of appState.fixedStatsLists) {
    await statsView.addNewColumn();
    statsView.renderSpinner();
  }
};

export const clearStatsSection = () => {
  statsView.clearSection();
};
