import appData from '../model/app-data.js';
import appState from '../model/app-state.js';
import inputsView from '../view/inputs-view.js';

const displayOptionsHandler = target => {
  inputsView.toggleSelector(target);
};

const setOptionHandler = id => {
  if (id && inputsView.selectorDisplayed) {
    // TODO Check in appState if actually has changed
    const option =
      inputsView.selectorDisplayed === 'rank'
        ? appData.ranks[id]
        : appData.roles[id];
    inputsView.changeOption(inputsView.selectorDisplayed, option);
    if (inputsView.selectorDisplayed === 'lane') {
      inputsView.changeOption('vslane', option);
    }
    inputsView.toggleSelector();
  }
};

const setRankHandler = id => {
  if (!id) return;
  const option = appData.ranks[id];
  inputsView.changeOption('rank', option);
  inputsView.toggleSelector();
  appState.setRank(id);
};

const setVsLaneHandler = id => {
  if (!id) return;
  const option = appData.roles[id];
  inputsView.changeOption('vslane', option);
  inputsView.toggleSelector();
  appState.setRank(id);
};

export async function initInputs() {
  // Handlers to show and hide selectors
  ['lane', 'vslane', 'rank', 'patch'].forEach(el =>
    inputsView.addHandlerBtn(displayOptionsHandler, el)
  );

  // Insert pop-ups in HTML
  await inputsView.insertSelectors(
    appData.toSortedArray('roles'),
    appData.toSortedArray('ranks'),
    appData.version
  );

  // Handlers to manage options selection
  ['lane', 'vslane', 'rank'].forEach(el =>
    inputsView.addHandlerSelector(setOptionHandler, el)
  );

  // Handlers for appState changes
}
