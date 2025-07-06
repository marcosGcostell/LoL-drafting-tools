import appData from '../model/appData.js';
import appState from '../appState.js';
import starterView from '../view/starter/starterView.js';
import { navigate } from '../router.js';
import { STARTER_PAGE_TEMPLATE } from '../utils/config.js';

const chooseOptionHandler = id => {
  appState.initFromStarter(id);
  navigate(`/${appState.appMode}`);
};

export const init = async () => {
  if (appState.lane) {
    navigate(`/${appState.appMode}`);
    // Need to skip the rest of router calls if it goes to other page
    return false;
  }

  try {
    // Insert the HTML page
    const response = await fetch(`${STARTER_PAGE_TEMPLATE}`);
    const template = await response.text();
    if (!template) throw new Error('HTML template is not found');

    document.querySelector('main').innerHTML = template;
    appState.setCurrentPage('starter');

    // Render selector and set handler for starter lane selection
    await starterView.insertSelector(appData.toSortedArray('roles'));
    starterView.addHandlerSelector(chooseOptionHandler);

    appState.addEventListener('user:login', e => {
      e.stopImmediatePropagation();
      navigate(`/${appState.appMode}`);
    });
    return true;
  } catch (err) {
    // TODO should handle error here
    throw err;
  }
};
