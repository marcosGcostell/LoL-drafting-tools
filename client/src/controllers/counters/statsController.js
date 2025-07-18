import appState from '../../appState.js';
import StatsView from '../../view/counters/statsView.js';

let statsView;

const renderStatsList = e => {
  const { index, stats } = e.detail;
  statsView.render(stats, { length: stats.length, index });
};

const addStatsColumn = e => {
  const { index } = e.detail;

  // Add the new column
  const newIndex = statsView.addNewColumn();
  if (newIndex !== index) {
    throw new Error('Pool items does not match the stats columns...');
  }
  statsView.renderSpinner();
};

const deleteStatsColumn = e => {
  const { index } = e.detail;
  statsView.removeColumn(index);
  // the stat list has been removed from appState when removing the pool
  for (let i = index + 1; i <= appState.fixedStatsLists.length; i++) {
    statsView.changeIndex(i, i - 1);
  }
};

const clearStatsSection = () => {
  statsView.clearSection();
};

const showAllStatsFromState = async () => {
  clearStatsSection();
  if (!appState.fixedStatsLists.length) return;
  appState.fixedStatsLists.forEach(list => {
    const index = statsView.addNewColumn();
    statsView.render(list, { length: list.length, index });
  });
};

const statsOnHold = async () => {
  clearStatsSection();
  if (!appState.fixedStatsLists.length) return;
  appState.fixedStatsLists.forEach(_ => {
    statsView.addNewColumn();
    statsView.renderSpinner();
  });
};

// Init funcion for the view
export default async () => {
  statsView = new StatsView();
  await statsView.initView();

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
    'updated:settings',
    'app:reload',
  ].forEach(target => {
    appState.addEventListener(target, showAllStatsFromState);
  });
};
