///////////////////////////////////////
// LOL Drafting tool

//Importing from modules
import * as model from './model/model.js';
import * as inputsController from './controllers/inputs-controller.js';
import countersView from './view/counters-view.js';
import tierlistView from './view/tierlist-view.js';

///////////////////////////////////////
// App state

///////////////////////////////////////
// Script

const countersHandler = async function () {
  try {
    console.log('Handling a counter list');
    // Get the input data
    const { champion, rank, role, vslane } = countersView.getInputs();

    // Load the counters
    await model.getCounterList(champion, role, rank, vslane);

    // Render the list
    countersView.render(model.state.counterList);
  } catch (error) {
    countersView.renderError();
  }
};

const tierlistHandler = async function () {
  try {
    console.log('Handling a tier list');
    // Get the input data
    const { role, rank } = tierlistView.getInputs();

    // Load the tierlist (optional sorting parameter)
    await model.getTierList(role, rank);

    // Render the list
    tierlistView.render(model.state.tierlist);
  } catch (error) {
    tierlistView.renderError();
  }
};

async function init() {
  // countersView.addHandlerCounters(countersHandler);
  // tierlistView.addHandlerTierlist(tierlistHandler);
  await model.initApp();
  await inputsController.initInputs();
}

await init();
