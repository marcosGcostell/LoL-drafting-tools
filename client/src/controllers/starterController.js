import appState from '../appState.js';
import starterView from '../view/starter/starterView.js';
import { navigate } from '../utils/helpers.js';

const setLaneHandler = component => {
  appState.initFromStarter(component.value);
  appState.setCurrentPage(`${appState.appMode}`);
  navigate(`/${appState.appMode}`);
};

// Init funcion for loading the page
export default async () => {
  // Return false if it's going to navigate to other page
  if (appState.currentPage === 'profile' && appState.user.isLoggedIn) {
    navigate('/profile');
    return false;
  }
  if (appState.currentPage === 'login' && !appState.user.isLoggedIn) {
    navigate('/login');
    return false;
  }
  if (appState.currentPage === 'signup' && !appState.user.isLoggedIn) {
    navigate('/signup');
    return false;
  }
  if (appState.lane) {
    appState.setCurrentPage(`${appState.appMode}`);
    navigate(`/${appState.appMode}`);
    return false;
  }

  try {
    // Insert the HTML page
    await starterView.initView();
    appState.setCurrentPage('starter');

    // Set the selector handler
    starterView.components.starter.bindHandlers(setLaneHandler);

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
