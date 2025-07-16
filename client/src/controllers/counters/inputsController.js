import appState from '../../appState.js';
import InputsView from '../../view/counters/inputsView.js';

let inputsView;

const hidePopUps = e => {
  const exclude = e.detail?.exclude || null;
  const popUpsIds = ['lane', 'vslane', 'rank'];
  popUpsIds.forEach(id => {
    const comp = inputsView.components[id];
    if (comp.isVisible && comp.id !== exclude) comp.toggle();
  });
  appState.popUpOn = exclude || '';
};

const togglePatch = component => {
  if (component.mode !== -1) {
    appState.setOption('patch', component.mode);
  }
};

const togglePopUp = component => {
  if (appState.popUpOn) appState.hideAllPopUps(component.id);

  appState.popUpOn = component.isVisible ? component.id : '';
};

const setOptionHandler = component => {
  if (!component.value) return;

  if (component.id === 'lane') {
    inputsView.components.vslane
      .setActiveItem(component.value)
      .changeParentButton(component.value);
  }

  if (appState[component.id] !== component.value) {
    appState.setOption(component.id, component.value);
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

export default async () => {
  inputsView = new InputsView();
  await inputsView.initView();

  // add handlers for option buttons and selectors
  ['lane', 'vslane', 'rank'].forEach(id =>
    inputsView.components[id].bind(setOptionHandler, togglePopUp),
  );
  inputsView.components.patch.bind(togglePatch);

  // Handlers to manage inputs values
  inputsView.addHandlerInput(listItemsHandler, 'max-items');
  inputsView.addHandlerInput(pickRateHandler, 'min-pr');

  appState.addEventListener('app:reload', setOptionsFromState);
  appState.addEventListener('popup:hideAll', hidePopUps);
};
