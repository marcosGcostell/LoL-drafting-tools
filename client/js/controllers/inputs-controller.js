import appData from '../model/app-data.js';
import appState from '../model/app-state.js';
import inputsView from '../view/inputs-view.js';

const displayOptionsHandler = target => {
  inputsView.toggleSelector(target);
};

const setOptionHandler = id => {
  if (!id) return;

  const target = inputsView.selectorDisplayed;
  if (appState[`${target}Selected`] === id) return;

  const option = target === 'rank' ? appData.ranks[id] : appData.roles[id];
  inputsView.changeOption(target, option);
  if (target === 'lane') {
    inputsView.changeOption('vslane', option);
  }
  inputsView.toggleSelector();
  target[0] = target[0].toUpperCase();
  // call the proper method: 'set' + Capitalized target. 'setLane'
  appState[`set${target.charAt(0).toUpperCase() + target.slice(1)}`](id);
};

// const setLaneHandler = id => {
//   if (!id) return;
//   if (appState.laneSelected === id) return;

//   const option = appData.roles[id];
//   inputsView.changeOption('lane', option);
//   inputsView.changeOption('vslane', option);
//   inputsView.toggleSelector();
//   appState.setLane(id, id);
// };

// const setRankHandler = id => {
//   if (!id) return;
//   if (appState.rankSelected === id) return;

//   const option = appData.ranks[id];
//   inputsView.changeOption('rank', option);
//   inputsView.toggleSelector();
//   appState.setRank(id);
// };

// const setVsLaneHandler = id => {
//   if (!id) return;
//   if (appState.vslaneSelected === id) return;

//   const option = appData.roles[id];
//   inputsView.changeOption('vslane', option);
//   inputsView.toggleSelector();
//   appState.setVslane(id);
// };

const optionsChangedHandler = e => {
  const { target, value } = e.detail;
  console.log(e);
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
  // inputsView.addHandlerSelector(setLaneHandler, 'lane');
  // inputsView.addHandlerSelector(setVsLaneHandler, 'vslane');
  // inputsView.addHandlerSelector(setRankHandler, 'rank');
  ['lane', 'vslane', 'rank'].forEach(el =>
    inputsView.addHandlerSelector(setOptionHandler, el)
  );

  // Handlers for appState changes
  appState.addEventListener('change', optionsChangedHandler);
}
