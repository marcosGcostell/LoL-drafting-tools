import appData from '../model/app-data.js';
import appState from '../model/app-state.js';
import * as inputsController from './inputs-controller.js';
import * as searchController from './search-controller.js';

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
  await inputsController.setHandlers();
  searchController.setHandlers();

  // Hide popups if clicking outside them or press ESC
  document.addEventListener('click', hidePopUps);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hidePopUps(e);
  });
}
