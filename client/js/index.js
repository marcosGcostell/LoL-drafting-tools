///////////////////////////////////////
// LOL Drafting tool

//Importing from modules
import * as model from './model/model.js';
import * as inputsController from './controllers/inputs-controller.js';

async function init() {
  // countersView.addHandlerCounters(countersHandler);
  // tierlistView.addHandlerTierlist(tierlistHandler);
  await model.initApp();
  await inputsController.initInputs();
}

await init();
