import appState from '../../appState.js';
import appData from '../../model/appData.js';
import TierlistView from '../../view/counters/tierlistView.js';
import * as dataModel from '../../model/dataModel.js';

let tierlistView;

export const initView = () => {
  tierlistView = new TierlistView();
  tierlistView.init();
};

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
