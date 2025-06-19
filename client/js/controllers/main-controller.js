import appState from '../model/app-state.js';
import * as inputsController from './inputs-controller.js';
import * as searchController from './search-controller.js';
import * as tierlistController from './tierlist-controller.js';
import * as poolController from './pool-controller.js';
import * as statsController from './stats-controller.js';

const optionsChangedHandler = async e => {
  const { target, value } = e.detail;
  if (target === 'laneSelected') {
    if (appState.pool.length) {
      appState.resetPool();
      poolController.clearPool();
      statsController.clearStatsSection();
    }
    if (appState.tierlistLane !== appState.vslaneSelected) {
      tierlistController.getTierlist();
    }
  }
  if (target === 'rankSelected') {
    await tierlistController.getTierlist();
    if (appState.pool.length) {
      let index = 0;
      for (const champion of appState.pool) {
        await poolController.updateChampion(champion, index);
        await statsController.updateStatsColumn(champion.id, index++);
      }
      poolController.showAllPool(appState.pool);
      statsController.showAllStats(appState.statsLists);
    }
  }
  if (target === 'vslaneSelected') {
    await tierlistController.getTierlist();
    if (appState.pool.length) {
      let index = 0;
      for (const champion of appState.pool) {
        await statsController.updateStatsColumn(champion.id, index++);
      }
      statsController.showAllStats(appState.statsLists);
    }
  }
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

const hidePopUps = e => {
  console.log('Main hide popups');
  e.preventDefault();
  switch (appState.popUpOn) {
    case '':
      break;
    case 'search':
      searchController.toggleSearchPanel(e);
    default:
      inputsController.toggleSelectors(e, appState.popUpOn);
      break;
  }
  appState.popUpOn = '';
};

export async function init() {
  // Set the options inputs handlers
  await inputsController.setHandlers();
  // Set add champion and searching handlers
  searchController.setHandlers();
  // Handlers for appState changes
  appState.addEventListener('options', optionsChangedHandler);
  appState.addEventListener('pool', poolChangedHandler);

  // Hide popups if clicking outside them or press ESC
  document.addEventListener('click', hidePopUps);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hidePopUps(e);
  });

  // Refresh and update form saved state
  if (appState.laneSelected) {
    inputsController.setOptionsFromState();
  }
  if (appState.tierlist.length) {
    tierlistController.showTierlistFromState();
  }
  if (appState.pool.length) {
    poolController.showAllPool(appState.pool);
    statsController.showAllStats(appState.statsLists);
  }
}
