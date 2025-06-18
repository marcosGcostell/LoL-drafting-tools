import appState from '../model/app-state.js';
import * as dataModel from '../model/data-model.js';
import statsView from '../view/stats-view.js';

export async function addChampionsHandler(champions, index) {
  try {
    console.log('Adding champions...');
    // TODO include endpoint in API to get basic champion data (build)

    const arrayChampions = Array.isArray(champions) ? champions : [champions];

    // Render the list
    await statsView.render(arrayChampions, {
      length: arrayChampions.length,
      index,
      noClear: true,
    });
  } catch (error) {
    statsView.renderError();
  }
}

export const updatePool = async champions => {
  await statsView.render(champions, {
    length: champions.length,
    index: 0,
  });
};

export const clearPool = () => {
  statsView._clear();
};

export const renderStatsList = (statsList, options) => {
  statsView.render(statsList, options);
};

export const statsHandler = async function (champion, index, addColumn) {
  try {
    console.log('Handling stats');

    const statsList = await dataModel.getStatsList({
      state: {
        champion: champion,
        lane: appState.vslaneSelected,
        rank: appState.rankSelected,
        vslane: appState.vslaneSelected,
        sortedBy: 'pickRate',
      },
      data: appData,
      tierlist: appState.tierList,
    });
    appState.statsLists.push(statsList);

    // Render the list
    renderStatsList(statsList, { addColumn, length: statsList.length, index });
  } catch (error) {
    statsView.renderError();
  }
};
