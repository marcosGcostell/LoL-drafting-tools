import appState from '../../appState.js';
import appData from '../../model/appData.js';
import TierlistView from '../../view/counters/tierlistView.js';

let tierlistView;

const showTierlistFromState = () => {
  if (!appState.fixedTierlist.length) return;
  tierlistView.render(appState.fixedTierlist, {
    lane: appData.roles[appState.vslane],
  });
};

const tierlistOnHold = () => {
  tierlistView.renderSpinner();
};

// Init funcion for the view
export default async () => {
  tierlistView = new TierlistView();
  await tierlistView.initView();

  // Add appState events handlers
  ['change:bothLanes', 'change:vslane', 'change:rank', 'change:patch'].forEach(
    target => {
      appState.addEventListener(target, tierlistOnHold);
    },
  );
  [
    'updated:bothLanes',
    'updated:vslane',
    'updated:rank',
    'updated:patch',
    'updated:settings',
    'app:reload',
  ].forEach(target => {
    appState.addEventListener(target, showTierlistFromState);
  });
};
