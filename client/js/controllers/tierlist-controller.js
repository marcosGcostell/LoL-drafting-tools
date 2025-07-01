import appState from '../model/app-state.js';
import appData from '../model/app-data.js';
import tierlistView from '../view/tierlist-view.js';
import * as dataModel from '../model/data-model.js';

export const showTierlistFromState = () => {
  tierlistView.render(appState.fixedTierlist, {
    lane: appData.roles[appState.vslane],
  });
};

export const getTierlist = async function () {
  try {
    tierlistView.renderSpinner();
    console.log(`Getting tier list: ${appState.vslane} ${appState.rank}`);

    const tierlist = await dataModel.getTierlist({
      state: {
        lane: appState.vslane,
        rank: appState.rank,
        patch: appState.patch.toApi(),
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

export const clearTierlist = () => {
  tierlistView._clear();
  appState.fixedTierlist = [];
};
