import * as dataModel from '../model/data-model.js';
import countersView from '../view/counters-view.js';
import tierlistView from '../view/tierlist-view.js';

const countersHandler = async function () {
  try {
    console.log('Handling a counter list');
    // Get the input data
    const { champion, rank, role, vslane } = countersView.getInputs();

    // Load the counters
    await dataModel.getCounterList(champion, role, rank, vslane);

    // Render the list
    countersView.render(dataModel.state.counterList);
  } catch (error) {
    countersView.renderError();
  }
};
