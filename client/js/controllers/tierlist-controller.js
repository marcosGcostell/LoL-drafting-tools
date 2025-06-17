import appState from '../model/app-state.js';
import appData from '../model/app-data.js';
import tierlistView from '../view/tierlist-view.js';
import * as dataModel from '../model/data-model.js';

export const tierlistHandler = async function () {
  try {
    tierlistView.renderSpinner();
    console.log(
      `Handling tier list: ${appState.vslaneSelected} ${appState.rankSelected}`
    );
    // Load the tierlist (optional sorting parameter)
    appState.tierList = await dataModel.getTierList({
      state: {
        lane: appState.vslaneSelected,
        rank: appState.rankSelected,
        sortedBy: 'pickRate',
      },
      data: appData,
    });

    // Render the list
    tierlistView.render(appState.tierList, {
      lane: appData.roles[appState.vslaneSelected],
    });
  } catch (error) {
    tierlistView.renderError();
  }
};
