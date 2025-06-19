import appState from '../model/app-state.js';
import appData from '../model/app-data.js';
import tierlistView from '../view/tierlist-view.js';
import * as dataModel from '../model/data-model.js';

export const showTierlistFromState = () => {
  tierlistView.render(appState.tierlist, {
    lane: appData.roles[appState.vslaneSelected],
  });
};

export const getTierlist = async function () {
  try {
    tierlistView.renderSpinner();
    console.log(
      `Getting tier list: ${appState.vslaneSelected} ${appState.rankSelected}`
    );
    // Load the tierlist (optional sorting parameter)
    const tierlist = await dataModel.getTierlist({
      state: {
        lane: appState.vslaneSelected,
        rank: appState.rankSelected,
        sortedBy: 'pickRate',
      },
      data: appData,
    });
    appState.addTierlist(tierlist);

    // Render the list
    showTierlistFromState();
  } catch (error) {
    tierlistView.renderError();
  }
};
