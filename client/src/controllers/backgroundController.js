import appState from '../appState.js';
import { navigate } from '../router.js';
import * as loginController from './global/loginController.js';
import * as inputsController from './counters/inputsController.js';
import * as searchController from './global/searchController.js';

const resetApp = () => {
  appState.resetAll();
  navigate('/');
};

const hidePopUps = e => {
  console.log('Main hide popups');
  e.preventDefault();
  if (appState.popUpOn === '') return;
  if (appState.popUpOn === 'search') {
    searchController.toggleSearchPanel(e);
  } else if (appState.popUpOn === 'login') {
    loginController.handleUserBtn(e);
  } else if (
    appState.popUpOn === 'lane' ||
    appState.popUpOn === 'rank' ||
    appState.popUpOn === 'vslane'
  ) {
    inputsController.toggleSelectors(e, appState.popUpOn);
  }
};

export async function init() {
  // Set the login button handler
  loginController.setHandlers();
  // FIXME This is a reset button for development on the logo
  document.querySelector('.header__logo').addEventListener('click', resetApp);

  // Hide popups if clicking outside them or press ESC
  document.addEventListener('click', hidePopUps);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hidePopUps(e);
  });
}
