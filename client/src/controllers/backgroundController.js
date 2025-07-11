import appState from '../appState.js';
import * as loginController from './global/loginController.js';
import * as inputsController from './counters/inputsController.js';
import * as searchController from './global/searchController.js';
import * as userDataController from './profile/userDataController.js';
import * as userPoolController from './profile/userPoolController.js';

const hidePopUps = e => {
  // FIXME When popup components will be modular
  // Only need to call a hidePopUps function on the current page views
  console.log('Main hide popups');
  e.preventDefault();
  if (appState.popUpOn === '') return;
  if (appState.popUpOn === 'search') {
    searchController.toggleSearchPanel(e);
  } else if (appState.popUpOn === 'login') {
    loginController.toggleModal(e);
  } else if (appState.popUpOn === 'password') {
    userDataController.togglePanel(e);
  } else if (appState.popUpOn === 'lane' || appState.popUpOn === 'vslane') {
    inputsController.toggleSelectors(e, appState.popUpOn);
  } else if (appState.popUpOn === 'rank') {
    appState.currentPage === 'profile'
      ? userPoolController.hidePopUps()
      : inputsController.toggleSelectors(e, 'rank');
  }
  appState.popUpOn = '';
};

export async function init() {
  // Hide popups if clicking outside them or press ESC
  document.addEventListener('click', hidePopUps);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hidePopUps(e);
  });
}
