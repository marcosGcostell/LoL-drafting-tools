import * as dataModel from '../model/data-model.js';
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

export const clearPool = () => {
  poolView._clear();
};
