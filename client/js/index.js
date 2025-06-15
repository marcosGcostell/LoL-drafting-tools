///////////////////////////////////////
// LOL Drafting tool

//Importing from modules
import appData from './model/app-data.js';
import appState from './model/app-state.js';
import * as inputsController from './controllers/inputs-controller.js';

async function init() {
  // countersView.addHandlerCounters(countersHandler);
  // tierlistView.addHandlerTierlist(tierlistHandler);
  // await model.initApp();
  await inputsController.initInputs();
}

await init();
