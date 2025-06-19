import * as dataModel from '../model/data-model.js';
import poolView from '../view/pool-view.js';

export async function addChampions(champions, index) {
  try {
    // TODO call new endpoint to fetch data

    const arrayChampions = Array.isArray(champions) ? champions : [champions];

    // Render the list (needs an array)
    poolView.render(arrayChampions, {
      length: arrayChampions.length,
      index,
      noClear: true,
    });
  } catch (error) {
    poolView.renderError();
  }
}

export const updatePool = async champions => {
  poolView.render(champions, {
    length: champions.length,
    index: 0,
  });
};

export const clearPool = () => {
  poolView._clear();
};
