import * as dataModel from '../model/data-model.js';
import tierlistView from '../view/tierlist-view.js';
import poolView from '../view/pool-view.js';

export async function addChampionsHandler(champions, index) {
  try {
    console.log('Adding champions...');
    // TODO include endpoint in API to get basic champion data (build)

    const arrayChampions = Array.isArray(champions) ? champions : [champions];

    // Render the list
    await poolView.render(arrayChampions, {
      length: arrayChampions.length,
      index,
      noClear: true,
    });
  } catch (error) {
    poolView.renderError();
  }
}

export const updatePool = async champions => {
  await poolView.render(champions, {
    length: champions.length,
    index: 0,
  });
};

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
