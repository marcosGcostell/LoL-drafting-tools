import * as dataModel from '../model/data-model.js';
import poolView from '../view/pool-view.js';
import appState from '../model/app-state.js';

export async function addChampion(champion, index) {
  try {
    // TODO call new endpoint to fetch data

    const { lane, stats } = await dataModel.getChampionStats({
      state: {
        lane: appState.laneSelected,
        rank: appState.rankSelected,
        vslane: appState.vslaneSelected,
        champion: champion.id,
      },
    });

    const completeChampion = { ...champion, lane, ...stats };

    // Render the list (needs an array)
    await poolView.render([completeChampion], {
      length: [completeChampion].length,
      index,
      noClear: true,
    });

    appState.updateChampion(completeChampion, index);
  } catch (error) {
    poolView.renderError();
  }
}

export const updatePool = async champion => {
  poolView.render(champion, {
    length: champion.length,
    index: 0,
  });
};

export const clearPool = () => {
  poolView._clear();
};
