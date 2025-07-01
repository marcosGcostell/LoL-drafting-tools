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

export const togglePatch = (_, target) => {
  if (!appState.popUpOn) {
    inputsView.setPatch(appState.patch.toggle().toView());
    appState.setOption('patch', appState.patch.toState());
  }
};

const setOptionHandler = id => {
  if (!id) return;

  const target = inputsView.selectorDisplayed;
  if (appState[target] === id) return;

  const option = target === 'rank' ? appData.ranks[id] : appData.roles[id];
  inputsView.changeOption(target, option);
  if (target === 'lane') {
    inputsView.changeOption('vslane', option);
  }
  inputsView.toggleSelector();
  appState.popUpOn = '';

  appState.setOption(target, id);
};

const starterOptionHandler = id => {
  inputsView.changeOption('lane', appData.roles[id]);
  inputsView.changeOption('rank', appData.ranks[appState.rank]);
  inputsView.changeOption('vslane', appData.roles[id]);
  changeMode();
  appState.setOption('lane', id);
};

const listItemsHandler = value => {
  if (Number.isInteger(+value)) {
    appState.setSetting('maxListItems', +value);
  }
  // Need to set again the value to display correct format
  inputsView.setMaxItems(appState.maxListItems);
};

const pickRateHandler = value => {
  if (Number.isFinite(+value)) {
    appState.setSetting('pickRateThreshold', +value);
  }
  // Need to set again the value to display correct format
  inputsView.setPickRateThreshold(appState.pickRateThreshold);
};

export function setOptionsFromState() {
  inputsView.changeOption('lane', appData.roles[appState.lane]);
  inputsView.changeOption('rank', appData.ranks[appState.rank]);
  inputsView.changeOption('vslane', appData.roles[appState.vslane]);
  inputsView.setPatch(appState.patch.toView());
  inputsView.setMaxItems(appState.maxListItems);
  inputsView.setPickRateThreshold(appState.pickRateThreshold);
}

export function changeMode(isStarter = null) {
  inputsView.changeMode(isStarter);
}

export async function setHandlers() {
  // Handler for clicked starter options
  inputsView.addHandlerSelector(starterOptionHandler, 'starter');

  // Handlers to show and hide selectors
  ['lane', 'vslane', 'rank'].forEach(el =>
    inputsView.addHandlerBtn(toggleSelectors, el)
  );
  inputsView.addHandlerBtn(togglePatch, 'patch');

  // Insert pop-ups in HTML
  await inputsView.insertSelectors(
    appData.toSortedArray('roles'),
    appData.toSortedArray('ranks'),
    appState.patch.toView()
  );

  // Handlers to manage options selection
  ['lane', 'vslane', 'rank'].forEach(el =>
    inputsView.addHandlerSelector(setOptionHandler, el)
  );

  // Handlers to manage inputs values
  inputsView.addHandlerInput(listItemsHandler, 'max-items');
  inputsView.addHandlerInput(pickRateHandler, 'min-pr');
}

export const resetView = () => {
  inputsView.changeMode(true);
};
