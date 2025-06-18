import appState from '../model/app-state.js';
import appData from '../model/app-data.js';
import * as dataModel from '../model/data-model.js';
import statsView from '../view/stats-view.js';

// export async function addChampionsHandler(champions, index) {
//   try {
//     console.log('Adding champions...');
//     // TODO include endpoint in API to get basic champion data (build)

//     const arrayChampions = Array.isArray(champions) ? champions : [champions];

//     // Render the list
//     await statsView.render(arrayChampions, {
//       length: arrayChampions.length,
//       index,
//       noClear: true,
//     });
//   } catch (error) {
//     statsView.renderError();
//   }
// }

// export const updatePool = async champions => {
//   await statsView.render(champions, {
//     length: champions.length,
//     index: 0,
//   });
// };

export const renderStatsList = async (statsList, options) => {
  await statsView.render(statsList, options);
};

export const statsHandler = async function (championId, index, addColumn) {
  try {
    console.log('Handling stats');
    const statsList = await dataModel.getStatsList({
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
    console.log(statsList);

    // Save state and render the list
    if (addColumn) {
      appState.addStatsList(statsList, championId);
      const newIndex = await statsView.addNewColumn();
      if (newIndex !== index)
        throw new Error('Pool items does not match the stats columns...');
    } else {
      if (!appState.updateStatsList(statsList, index))
        throw new Error('The stats list does not exists...');
    }
    await renderStatsList(statsList, { length: statsList.length, index });
  } catch (error) {
    statsView.renderError();
  }
};

export const updateStats = async statsLists => {
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
