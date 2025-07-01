import appState from '../model/app-state.js';
import * as loginController from './login-controller.js';
import * as inputsController from './inputs-controller.js';
import * as searchController from './search-controller.js';
import * as tierlistController from './tierlist-controller.js';
import * as poolController from './pool-controller.js';
import * as statsController from './stats-controller.js';

const updateListsOnChange = async ({ tierlist, pool, stats }) => {
  if (tierlist) await tierlistController.getTierlist();
  if (appState.pool.length) {
    if (pool) await poolController.poolOnHold();
    if (stats) await statsController.statsOnHold();
    let index = 0;
    for (const champion of appState.pool) {
      if (pool) await poolController.getChampion(champion, index);
      if (stats) await statsController.updateStatsColumn(champion.id, index++);
    }
    if (pool) poolController.showAllPool(appState.pool);
    if (stats) statsController.showAllStats(appState.fixedStatsLists);
  }
};

const optionsChangedHandler = async e => {
  const { target, value } = e.detail;
  if (appState.popUpOn === 'starter') {
    searchController.toggleSearchButton();
    appState.popUpOn = '';
  }
  switch (target) {
    case 'lane':
      if (appState.pool.length) {
        appState.resetPool();
        poolController.clearPool();
        statsController.clearStatsSection();
      }
      if (appState.tierlistLane !== appState.vslane) {
        tierlistController.getTierlist();
      }
      break;
    case 'rank':
      await updateListsOnChange({ tierlist: true, pool: true, stats: true });
      break;
    case 'vslane':
      await updateListsOnChange({ tierlist: true, stats: true });
      break;
    case 'patch':
      await updateListsOnChange({ tierlist: true, pool: true, stats: true });
      break;
  }
};

const settingsChangedHandler = async e => {
  appState.fixTierlist();
  tierlistController.showTierlistFromState();
  appState.fixedStatsLists.forEach((_, index) => appState.fixStatsList(index));
  statsController.showAllStats(appState.fixedStatsLists);
};

const poolChangedHandler = async e => {
  const { action, element } = e.detail;
  switch (action) {
    case 'add':
      console.log('Adding new champion...');
      await poolController.getChampion(element);
      break;
    case 'stats':
      console.log('Adding the stats...');
      await statsController.addStatsColumn(
        element.id,
        appState.statsLists.length
      );
      break;
    case 'remove':
      statsController.deleteStatsColumn(element);
      break;
    default:
      break;
  }
};

const resetEventHandler = () => {
  poolController.clearPool();
  statsController.clearStatsSection();
  tierlistController.clearTierlist();
  loginController.resetView();
  searchController.resetView();
  inputsController.resetView();
  appState.freshInit();
};

const refreshOnReload = () => {
  // Refresh and update form saved state
  loginController.resetView();
  if (appState.lane) {
    inputsController.setOptionsFromState();
  }
  if (appState.popUpOn !== 'starter') {
    inputsController.changeInputs();
    searchController.toggleSearchButton();
    appState.popUpOn = '';
  }
  if (appState.tierlist.length) {
    tierlistController.showTierlistFromState();
  }
  if (appState.pool.length) {
    poolController.showAllPool(appState.pool);
    statsController.showAllStats(appState.fixedStatsLists);
  }
};

const resetApp = () => {
  appState.resetAll();
};

const hidePopUps = e => {
  console.log('Main hide popups');
  e.preventDefault();
  switch (appState.popUpOn) {
    case ('', 'starter'):
      break;
    case 'search':
      searchController.toggleSearchPanel(e);
      break;
    case 'login':
      loginController.handleUserBtn(e);
    default:
      inputsController.toggleSelectors(e, appState.popUpOn);
      break;
  }
};

export async function init() {
  // Set the options inputs handlers
  loginController.setHandlers();
  await inputsController.setHandlers();
  // Set add champion and searching handlers
  searchController.setHandlers();
  // Handlers for appState changes
  appState.addEventListener('options', optionsChangedHandler);
  appState.addEventListener('settings', settingsChangedHandler);
  appState.addEventListener('pool', poolChangedHandler);
  appState.addEventListener('reset', resetEventHandler);

  // FIXME This is a reset button for development on the logo
  document.querySelector('.header__logo').addEventListener('click', resetApp);

  // Hide popups if clicking outside them or press ESC
  document.addEventListener('click', hidePopUps);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hidePopUps(e);
  });

  refreshOnReload();
}
