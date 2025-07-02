import appData from '../model/appData.js';
import appState from '../appState.js';
import starterView from '../view/starter/starterView.js';
import { navigate } from '../router.js';
import { STARTER_PAGE_TEMPLATE } from '../utils/config.js';

const chooseOptionHandler = id => {
  // starterView.changeOption('lane', appData.roles[id]);
  // starterView.changeOption('rank', appData.ranks[appState.rank]);
  // starterView.changeOption('vslane', appData.roles[id]);
  // changeMode();
  // appState.setOption('lane', id);
};

export const init = async () => {
  if (appState.lane) navigate(`/${appState.appMode}`);

  try {
    // Insert the HTML page
    const response = await fetch(`${STARTER_PAGE_TEMPLATE}`);
    const template = await response.text();
    if (!template) throw new Error('HTML template is not found');

    document.querySelector('main').innerHTML = template;

    // Render selector and set handler for starter lane selection
    await starterView.insertSelector(appData.toSortedArray('roles'));
    starterView.addHandlerSelector(chooseOptionHandler);
  } catch (err) {
    // TODO should handle error here
    throw err;
  }
};
