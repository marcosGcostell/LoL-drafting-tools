import appState from '../appState.js';
import * as loginController from './global/loginController.js';
import * as inputsController from './counters/inputsController.js';
import * as poolController from './counters/poolController.js';
import * as userDataController from './profile/userDataController.js';
import * as userPoolController from './profile/userPoolController.js';

export const hideAllPopUps = (exclude = null) => {
  // FIXME When popup components will be modular
  // Only need to call a hidePopUps function of the current page views
  if (appState.popUpOn === '') return;
  console.log('Main hide popups');
  if (appState.currentPage === 'counters') {
    inputsController.hidePopUps(exclude);
    poolController.hidePopUps(exclude);
  }
  if (appState.currentPage === 'profile') {
    userDataController.hidePopUps(exclude);
    userPoolController.hidePopUps(exclude);
  } else if (appState.popUpOn === 'login') {
    loginController.toggleModal();
  }

  appState.popUpOn = '';
};

export async function init() {
  // Hide popups if clicking outside them or press ESC
  document.addEventListener('click', hideAllPopUps);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hideAllPopUps(e);
  });
}
