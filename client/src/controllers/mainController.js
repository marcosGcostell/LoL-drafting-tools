import appState from '../appState.js';
import { navigate } from '../router.js';
import * as loginController from './global/loginController.js';
import * as inputsController from './counters/inputsController.js';
import * as searchController from './global/searchController.js';
import * as tierlistController from './counters/tierlistController.js';
import * as poolController from './counters/poolController.js';
import * as statsController from './counters/statsController.js';

// const updateListsOnChange = async ({ tierlist, pool, stats }) => {
//   if (tierlist) await tierlistController.getTierlist();
//   if (appState.pool.length) {
//     if (pool) await poolController.poolOnHold();
//     if (stats) await statsController.statsOnHold();
//     let index = 0;
//     for (const champion of appState.pool) {
//       if (pool) await poolController.getChampion(champion, index);
//       if (stats) await statsController.updateStatsColumn(champion.id, index++);
//     }
//     if (pool) poolController.showAllPoolFromState();
//     if (stats) statsController.showAllStatsFromState();
//   }
// };

// const optionsChangedHandler = async e => {
//   const { target, value } = e.detail;

//   switch (target) {
//     case 'lane':
//       if (appState.pool.length) {
//         appState.resetPool();
//         poolController.clearPool();
//         statsController.clearStatsSection();
//       }
//       if (appState.tierlistLane !== appState.vslane) {
//         tierlistController.getTierlist();
//       }
//       break;
//     case 'rank':
//       await updateListsOnChange({ tierlist: true, pool: true, stats: true });
//       break;
//     case 'vslane':
//       await updateListsOnChange({ tierlist: true, stats: true });
//       break;
//     case 'patch':
//       await updateListsOnChange({ tierlist: true, pool: true, stats: true });
//       break;
//   }
// };

// const settingsChangedHandler = async e => {
//   appState.fixTierlist();
//   tierlistController.showTierlistFromState();
//   appState.fixedStatsLists.forEach((_, index) => appState.fixStatsList(index));
//   statsController.showAllStatsFromState();
// };

// const poolChangedHandler = async e => {
//   const { action, element } = e.detail;
//   switch (action) {
//     case 'add':
//       console.log('Adding new champion...');
//       await poolController.getChampion(element);
//       break;
//     case 'stats':
//       console.log('Adding the stats...');
//       await statsController.addStatsColumn(
//         element.id,
//         appState.statsLists.length
//       );
//       break;
//     case 'remove':
//       statsController.deleteStatsColumn(element);
//       break;
//     default:
//       break;
//   }
// };

// const resetEventHandler = () => {
//   poolController.clearPool();
//   statsController.clearStatsSection();
//   tierlistController.clearTierlist();
//   loginController.resetView();
//   searchController.resetView();
//   inputsController.resetView();
//   appState.freshInit();
// };

const resetApp = () => {
  appState.resetAll();
  navigate('/');
};

const hidePopUps = e => {
  console.log('Main hide popups');
  e.preventDefault();
  switch (appState.popUpOn) {
    case '':
      break;
    case 'search':
      searchController.toggleSearchPanel(e);
      break;
    case 'login':
      loginController.handleUserBtn(e);
    case ('lane', 'rank', 'vslane'):
      inputsController.toggleSelectors(e, appState.popUpOn);
      break;
  }
};

export async function init() {
  // Set the login button handler
  loginController.setHandlers();
  // FIXME This is a reset button for development on the logo
  document.querySelector('.header__logo').addEventListener('click', resetApp);

  // Handlers for appState changes
  // FIXME These should go on each controller
  // appState.addEventListener('options', optionsChangedHandler);
  // appState.addEventListener('settings', settingsChangedHandler);
  // appState.addEventListener('pool', poolChangedHandler);
  // appState.addEventListener('reset', resetEventHandler);

  // Hide popups if clicking outside them or press ESC
  document.addEventListener('click', hidePopUps);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hidePopUps(e);
  });
}
