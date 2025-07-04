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
      appState.addEventListener(target, tierlistOnHold);
    }
  );
  [
    'updated:bothLanes',
    'updated:vslane',
    'updated:rank',
    'updated:patch',
    'settings',
    'reload',
  ].forEach(target => {
    appState.addEventListener(target, showTierlistFromState);
  });
  appState.addEventListener('reset', clearTierlist);
};

export const showTierlistFromState = () => {
  if (!appState.fixedTierlist.length) return;
  tierlistView.render(appState.fixedTierlist, {
    lane: appData.roles[appState.vslane],
  });
};

const tierlistOnHold = () => {
  tierlistView.renderSpinner();
};

export const clearTierlist = () => {
  tierlistView._clear();
  appState.fixedTierlist = [];
};
