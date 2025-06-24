import appState from '../model/app-state.js';
import * as inputsController from './inputs-controller.js';
import * as searchController from './search-controller.js';
import * as tierlistController from './tierlist-controller.js';
import * as poolController from './pool-controller.js';
import * as statsController from './stats-controller.js';

const optionsChangedHandler = async e => {
  const { target, value } = e.detail;
  if (appState.popUpOn === 'starter') {
    searchController.toggleSearchButton();
    appState.popUpOn = '';
  }
  switch (target) {
    case 'laneSelected':
      if (appState.pool.length) {
        appState.resetPool();
        poolController.clearPool();
        statsController.clearStatsSection();
      }
      if (appState.tierlistLane !== appState.vslaneSelected) {
        tierlistController.getTierlist();
      }
      break;
    case 'rankSelected':
      await tierlistController.getTierlist();
      if (appState.pool.length) {
        await poolController.poolOnHold();
        await statsController.statsOnHold();
        let index = 0;
        for (const champion of appState.pool) {
          await poolController.updateChampion(champion, index);
          await statsController.updateStatsColumn(champion.id, index++);
        }
        poolController.showAllPool(appState.pool);
        statsController.showAllStats(appState.statsLists);
      }
      break;
    case 'vslaneSelected':
      await tierlistController.getTierlist();
      if (appState.pool.length) {
        await statsController.statsOnHold();
        let index = 0;
        for (const champion of appState.pool) {
          await statsController.updateStatsColumn(champion.id, index++);
        }
        statsController.showAllStats(appState.statsLists);
      }
      break;
    case 'patchSelected':
      // TODO Load new data when changing the patch
      break;
  }
};

const settingsChangedHandler = async e => {
  // TODO Display list and stats when settings change
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
      break;

    default:
      break;
  }
};

const resetEventHandler = () => {
  poolController.clearPool();
  statsController.clearStatsSection();
  tierlistController.clearTierlist();
  if (appState.popUpOn !== 'starter') {
    searchController.toggleSearchButton();
    inputsController.changeInputs();
    appState.popUpOn = 'starter';
  }
};

const refreshOnReload = () => {
  // Refresh and update form saved state
  if (appState.laneSelected) {
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
    statsController.showAllStats(appState.statsLists);
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
    default:
      inputsController.toggleSelectors(e, appState.popUpOn);
      break;
  }
};

export async function init() {
  // Set the options inputs handlers
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
