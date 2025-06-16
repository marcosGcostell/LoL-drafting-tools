import appData from '../model/app-data.js';
import appState from '../model/app-state.js';
import * as inputsController from './inputs-controller.js';
import * as searchController from './search-controller.js';

export async function init() {
  await inputsController.setHandlers();
  searchController.setHandlers();
}
