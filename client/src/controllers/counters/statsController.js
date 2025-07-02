import appState from '../../appState.js';
import appData from '../../model/appData.js';
import * as dataModel from '../../model/dataModel.js';
import StatsView from '../../view/counters/statsView.js';

let statsView;

const _getStatsList = async (championId, index) => {
  return await dataModel.getStatsList({
    state: {
      champion: championId,
      winRatio: appState.pool[index].winRatio,
      lane: appState.lane,
      rank: appState.rank,
      vslane: appState.vslane,
      patch: appState.patch.toApi(),
      sortedBy: 'pickRate',
    },
    data: appData,
    tierlist: appState.tierlist,
  });
};

export const initView = () => {
  statsView = new StatsView();
  statsView.init();
};

export const renderStatsList = async (statsList, options) => {
  await statsView.render(statsList, options);
};

export const addStatsColumn = async function (championId, index) {
  try {
    // Add the new column
    const newIndex = await statsView.addNewColumn();
    if (newIndex !== index) {
      throw new Error('Pool items does not match the stats columns...');
    }
    statsView.renderSpinner();

    const statsList = await _getStatsList(championId, index);
    // Save state
    appState.addStatsList(statsList, championId);

    // Render the list
    await renderStatsList(appState.fixedStatsLists[index], {
      length: appState.fixedStatsLists[index].length,
      index,
    });
  } catch (error) {
    statsView.renderError();
  }
};

export const updateStatsColumn = async function (championId, index) {
  try {
    const statsList = await _getStatsList(championId, index);

    // Save state
    if (!appState.updateStatsList(statsList, index))
      throw new Error('The stats list does not exists...');
  } catch (error) {
    statsView.renderError();
  }
};

export const deleteStatsColumn = index => {
  statsView.removeColumn(index);
  // the stat list has been removed from appState when removing the pool
  for (let i = index + 1; i <= appState.statsLists.length; i++) {
    statsView.changeIndex(i, i - 1);
  }
};

export const showAllStats = async statsLists => {
  clearStatsSection();
  for (const list of statsLists) {
    const index = await statsView.addNewColumn();
    await renderStatsList(list, { length: list.length, index });
  }
};

export const statsOnHold = async () => {
  clearStatsSection();
  for (const col of appState.pool) {
    await statsView.addNewColumn();
    statsView.renderSpinner();
  }
};

export const clearStatsSection = () => {
  statsView.clearSection();
};
