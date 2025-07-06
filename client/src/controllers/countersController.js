import appState from '../appState.js';
import * as loginController from './global/loginController.js';
import * as inputsController from './counters/inputsController.js';
import * as searchController from './global/searchController.js';
import * as tierlistController from './counters/tierlistController.js';
import * as poolController from './counters/poolController.js';
import * as statsController from './counters/statsController.js';
import { COUNTER_PAGE_TEMPLATE } from '../utils/config.js';

export const init = async () => {
  try {
    // Insert the HTML page
    const response = await fetch(`${COUNTER_PAGE_TEMPLATE}`);
    const template = await response.text();
    if (!template) throw new Error('HTML template is not found');

    document.querySelector('main').innerHTML = template;

    appState.setCurrentPage('counters');

    // Set the login modal handlers
    loginController.setHandlers();
    // Set the options inputs and search handlers
    await inputsController.setHandlers();
    searchController.setHandlers();
    // Init the data views
    tierlistController.initView();
    poolController.initView();
    statsController.initView();

    await appState.initFromCounters();
  } catch (err) {
    // TODO should handle error here
    throw err;
  }
};
