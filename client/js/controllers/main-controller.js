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
      statsController.resetStats();
    }
    if (appState.tierlistLane !== appState.vslaneSelected) {
      tierlistController.loadTierlist();
    }
  }
  if (target === 'rankSelected') {
    await tierlistController.loadTierlist();
    if (appState.pool.length) {
      appState.pool.forEach((champion, index) =>
        statsController.updateStatsColumn(champion.id, index)
      );
    }
  }
  if (target === 'vslaneSelected') {
    await tierlistController.loadTierlist();
    if (appState.pool.length) {
      appState.pool.forEach((champion, index) =>
        statsController.updateStatsColumn(champion.id, index)
      );
    }
  }
};

const poolChangedHandler = async e => {
  const { action, element } = e.detail;
  if (action === 'add') {
    console.log('Adding new champion...');
    await poolController.addChampions(element, appState.pool.length);
    await statsController.addStatsColumn(
      element.id,
      appState.statsLists.length
    );
  }
  if (action === 'remove') {
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
    tierlistController.renderStateTierlist();
  }
  if (appState.pool.length) {
    poolController.updatePool(appState.pool);
    statsController.loadAllStats(appState.statsLists);
  }
}
