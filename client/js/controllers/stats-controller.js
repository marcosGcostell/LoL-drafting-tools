import appState from '../model/app-state.js';
import appData from '../model/app-data.js';
import * as dataModel from '../model/data-model.js';
import statsView from '../view/stats-view.js';

const _getStatsList = async championId => {
  return await dataModel.getStatsList({
    state: {
      champion: championId,
      lane: appState.vslaneSelected,
      rank: appState.rankSelected,
      vslane: appState.vslaneSelected,
      patch: appState.patchSelected ? '' : '7',
      sortedBy: 'pickRate',
    },
    data: appData,
    tierlist: appState.tierlist,
  });
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

    const statsList = await _getStatsList(championId);
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
    const statsList = await _getStatsList(championId);

    // Save state
    if (!appState.updateStatsList(statsList, index))
      throw new Error('The stats list does not exists...');
  } catch (error) {
    statsView.renderError();
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
