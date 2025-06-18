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
    await renderStatsList(statsList, { length: statsList.length, index });
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

    // Render the list
    await renderStatsList(statsList, { length: statsList.length, index });
  } catch (error) {
    statsView.renderError();
  }
};

export const loadAllStats = async statsLists => {
  resetStats();
  let index = 0;
  for (const list of statsLists) {
    await statsView.addNewColumn();
    await renderStatsList(list, { length: list.length, index: index++ });
  }
};

export const resetStats = () => {
  statsView.clearSection();
};
