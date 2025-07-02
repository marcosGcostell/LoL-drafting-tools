import appState from '../appState.js';
import * as inputsController from './counters/inputsController.js';
import * as searchController from './global/searchController.js';
import * as tierlistController from './counters/tierlistController.js';
import * as poolController from './counters/poolController.js';
import * as statsController from './counters/statsController.js';
import * as loginController from './global/loginController.js';
import { COUNTER_PAGE_TEMPLATE } from '../utils/config.js';

export const init = async () => {
  try {
    // Insert the HTML page
    const response = await fetch(`${COUNTER_PAGE_TEMPLATE}`);
    const template = await response.text();
    if (!template) throw new Error('HTML template is not found');

    document.querySelector('main').innerHTML = template;

    // Set the options inputs and search handlers
    await inputsController.setHandlers();
    searchController.setHandlers();
    tierlistController.initView();
    poolController.initView();
    statsController.initView();

    // Refresh on init or reload
    loginController.resetView();
    inputsController.setOptionsFromState();
    if (appState.tierlist.length) {
      tierlistController.showTierlistFromState();
    }
    if (appState.pool.length) {
      poolController.showAllPool(appState.pool);
      statsController.showAllStats(appState.fixedStatsLists);
    }
  } catch (err) {
    // TODO should handle error here
    throw err;
  }
};
