import appState from '../model/app-state.js';
import * as model from '../model/model.js';
import tierlistView from '../view/tierlist-view.js';

export const tierlistHandler = async function () {
  try {
    tierlistView.renderSpinner();
    console.log(
      `Handling tier list: ${appState.vslaneSelected} ${appState.rankSelected}`
    );
    // Load the tierlist (optional sorting parameter)
    appState.tierList = await model.getTierList(
      appState.vslaneSelected,
      appState.rankSelected,
      'pickRate'
    );

    // Render the list
    tierlistView.render(appState.tierList, { lane: appState.vslaneSelected });
  } catch (error) {
    tierlistView.renderError();
  }
};
