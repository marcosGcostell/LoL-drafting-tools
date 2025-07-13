import appState from '../../appState.js';
import * as componentsController from '../global/componentsController.js';
import InputsView from '../../view/counters/inputsView.js';

let inputsView;

const togglePatch = (e, component) => {
  const mode = componentsController.togglePatch(e, component);
  if (mode !== -1) {
    appState.setOption('patch', mode);
  }
};

const setOptionHandler = (e, component) => {
  const selection = componentsController.getSelectorPopUpValue(e, component);
  if (!selection) return;

  if (component.id === 'lane') {
    inputsView.components.vslane
      .setActiveItem(selection)
      .changeParentButton(selection);
  }

  if (appState[component.id] !== selection) {
    appState.setOption(component.id, selection);
  }
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

const setOptionsFromState = () => {
  ['lane', 'vslane', 'rank'].forEach(id => {
    inputsView.components[id]
      .setActiveItem(appState[id])
      .changeParentButton(appState[id]);
  });
  inputsView.components.patch.mode = appState.patch.mode;
  inputsView.setMaxItems(appState.maxListItems);
  inputsView.setPickRateThreshold(appState.pickRateThreshold);
};

export const hidePopUps = () => {
  const popUpsIds = ['lane', 'vslane', 'rank'];
  popUpsIds.forEach(id => {
    if (inputsView.components[id].isVisible) {
      inputsView.components[id].toggle();
    }
  });
};

export const initView = async () => {
  inputsView = new InputsView();
  await inputsView.init();

  // add handlers for option buttons and selectors
  ['lane', 'vslane', 'rank'].forEach(id =>
    inputsView.components[id].bind(
      setOptionHandler,
      componentsController.toggleSelector,
    ),
  );
  inputsView.components.patch.bind(togglePatch);

  // Handlers to manage inputs values
  inputsView.addHandlerInput(listItemsHandler, 'max-items');
  inputsView.addHandlerInput(pickRateHandler, 'min-pr');

  appState.addEventListener('app:reload', setOptionsFromState);
};
