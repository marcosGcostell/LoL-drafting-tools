import appState from '../model/app-state.js';
import * as inputsController from './inputs-controller.js';
import * as searchController from './search-controller.js';
import { tierlistHandler } from './tierlist-controller.js';

const optionsChangedHandler = e => {
  const { target, value } = e.detail;
  if (target === 'rankSelected') {
    tierlistHandler();
  }
  if (target === 'vslaneSelected') {
    tierlistHandler();
  }
  console.log(e);
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
  appState.addEventListener('change', optionsChangedHandler);

  // Hide popups if clicking outside them or press ESC
  document.addEventListener('click', hidePopUps);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hidePopUps(e);
  });
}
