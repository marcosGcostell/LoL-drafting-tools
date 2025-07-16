import appState from '../appState.js';
import * as loginController from './global/loginController.js';
import initInputs from './counters/inputsController.js';
import initTierlist from './counters/tierlistController.js';
import initPool from './counters/poolController.js';
import initStatsList from './counters/statsController.js';
import { COUNTER_PAGE_TEMPLATE } from '../utils/config.js';

// Init funcion for loading the page
export default async () => {
  try {
    // Insert the HTML page
    const response = await fetch(COUNTER_PAGE_TEMPLATE);
    const template = await response.text();
    if (!template) throw new Error('HTML template is not found');

    document.querySelector('main').innerHTML = template;

    appState.setCurrentPage('counters');

    // Set the login modal handlers
    loginController.init();
    // Set the options inputs and search handlers
    await initInputs();
    await initPool();

    // Init the data views
    await initTierlist();
    await initStatsList();

    await appState.initFromCounters();
  } catch (err) {
    // TODO should handle error here
    throw err;
  }
};
