import appData from '../model/app-data.js';
import appState from '../model/app-state.js';
import inputsView from '../view/inputs-view.js';

export const toggleSelectors = (e, target) => {
  if (!appState.popUpOn || appState.popUpOn === target) {
    inputsView.toggleSelector(target);
    appState.popUpOn = inputsView.selectorDisplayed
      ? inputsView.selectorDisplayed
      : '';
    e.stopPropagation();
  }
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
  appState.popUpOn = '';
  // call the proper method: 'set' + Capitalized target. (e.g. = 'setLane')
  appState[`set${target.charAt(0).toUpperCase() + target.slice(1)}`](id);
};

export function setOptionsFromState() {
  inputsView.changeOption('lane', appData.roles[appState.laneSelected]);
  inputsView.changeOption('rank', appData.ranks[appState.rankSelected]);
  inputsView.changeOption('vslane', appData.roles[appState.vslaneSelected]);
  // TODO Patch selection
}

export async function setHandlers() {
  // Handlers to show and hide selectors
  ['lane', 'vslane', 'rank', 'patch'].forEach(el =>
    inputsView.addHandlerBtn(toggleSelectors, el)
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
}
