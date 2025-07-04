import appState from '../../appState.js';
import appData from '../../model/appData.js';
import TierlistView from '../../view/counters/tierlistView.js';

let tierlistView;

export const initView = () => {
  tierlistView = new TierlistView();
  tierlistView.init();

  // Add appState events handlers
  ['change:bothLanes', 'change:vslane', 'change:rank', 'change:patch'].forEach(
    target => {
      appState.addEventListener(target, tierlistView.renderSpinner());
    }
  );
  [
    'updated:bothLanes',
    'updated:vslane',
    'updated:rank',
    'updated:patch',
    'settings',
  ].forEach(target => {
    appState.addEventListener(target, showTierlistFromState());
  });
};

export const showTierlistFromState = () => {
  tierlistView.render(appState.fixedTierlist, {
    lane: appData.roles[appState.vslane],
  });
};

export const clearTierlist = () => {
  tierlistView._clear();
  appState.fixedTierlist = [];
};
