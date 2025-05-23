///////////////////////////////////////
// LOL Drafting tool

//Importing from modules
import * as model from './model/model.js';
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
    const data = countersView.getInputs();

    // Load the counters
    await model.getCounterList(data.champion, data.rank, data.role);

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
    const data = tierlistView.getInputs();

    // Load the tierlist (optional sorting parameter)
    await model.getTierList(data.rank, data.role, 'pickRate');

    // Render the list
    tierlistView.render(model.state.tierList);
  } catch (error) {
    tierlistView.renderError();
  }
};

async function init() {
  countersView.addHandlerCounters(countersHandler);
  tierlistView.addHandlerTierlist(tierlistHandler);
  await model.initApp();
}

await init();
