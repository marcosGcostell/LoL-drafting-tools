import appState from '../appState.js';
import starterView from '../view/starter/starterView.js';
import * as loginController from './global/loginController.js';
import { navigate } from '../utils/helpers.js';

const setLaneHandler = component => {
  appState.initFromStarter(component.value);
  appState.setCurrentPage(`${appState.appMode}`);
  navigate(`/${appState.appMode}`);
};

// Init funcion for loading the page
export default async () => {
  if (appState.currentPage === 'profile' && appState.user.isLoggedIn()) {
    navigate('/profile');
    return false;
  }
  if (appState.currentPage === 'signup' && !appState.user.isLoggedIn()) {
    navigate('/signup');
    return false;
  }
  if (appState.lane) {
    appState.setCurrentPage(`${appState.appMode}`);
    navigate(`/${appState.appMode}`);
    // Need to skip the rest of router calls if it goes to other page
    return false;
  }

  try {
    // Insert the HTML page
    await starterView.initView();
    appState.setCurrentPage('starter');

    // Init login modal handlers and set the selector handler
    loginController.init();
    starterView.components.starter.bind(setLaneHandler);

    appState.addEventListener('user:login', e => {
      e.stopImmediatePropagation();
      appState.setCurrentPage(`${appState.appMode}`);
      navigate(`/${appState.appMode}`);
    });
    return true;
  } catch (err) {
    // TODO should handle error here
    throw err;
  }
};
