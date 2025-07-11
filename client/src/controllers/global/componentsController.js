import appState from '../../appState';

export const toggleSelector = (e, component) => {
  if (appState.popUpOn && appState.popUpOn !== component.id) return;

  e.stopPropagation();
  appState.popUpOn = component.toggle().isVisible ? component.id : '';
};

export const togglePatch = (e, component) => {
  if (appState.popUpOn) return -1;

  e.stopPropagation();
  component.toggle();
  return component.mode;
};

export const getSelectorValue = (e, component) => {
  if (appState.popUpOn) return null;

  e.stopPropagation();
  const id = e.target.closest('div').dataset.value;
  component.setActiveItem(id);
  return id;
};

export const getSelectorPopUpValue = (e, component) => {
  if (appState.popUpOn && appState.popUpOn !== component.id) return null;

  e.stopPropagation();
  const id = e.target.closest('div').dataset.value;
  component.setActiveItem(id).changeParentButton(id);
  appState.popUpOn = component.toggle().isVisible ? component.id : '';
  return id;
};
