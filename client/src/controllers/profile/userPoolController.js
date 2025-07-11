import appData from '../../model/appData.js';
import appState from '../../appState.js';
import UserPoolView from '../../view/profile/userPoolView.js';

let userPoolView;

export const toggleSelector = (e, component) => {
  if (!appState.popUpOn || appState.popUpOn === component.id) {
    appState.popUpOn = component.toggle().isVisible ? component.id : '';

    e.stopPropagation();
  }
};

export const hidePopUps = () => {
  const popUpsIds = ['rank'];
  popUpsIds.forEach(id => {
    if (userPoolView.components[id].isVisible)
      userPoolView.components[id].toggle();
  });
};

const setLaneHandler = (e, component) => {
  if (appState.popUpOn) return;

  e.stopPropagation();
  const id = e.target.closest('div').dataset.value;
  component.setActiveItem(id);
  // TODO State is the components. Don't save to user until save / discard
  // appState.user.setPoolOptions(`${component.id}Role`, id);
};

const setRankHandler = (e, component) => {
  if (appState.popUpOn !== 'rank' && userPoolView.popUpDisplayed !== 'rank')
    return;

  e.stopPropagation();
  const id = e.target.closest('div').dataset.value;
  component.changeParentButton(id);
  toggleSelector(e, component);
};

const togglePatch = (e, component) => {
  if (appState.popUpOn) return;

  e.stopPropagation();
  userPoolView.components.patch.toggle();
};

export const init = async () => {
  // Init view
  userPoolView = new UserPoolView();
  await userPoolView.initView(appData.toSortedArray('roles'));

  // Load config and champion pool
  userPoolView.setFromUserData(
    appState.user.data,
    appState.patch.strToProfile(appState.user.patch),
  );

  // Set handlers for the profile pool view
  userPoolView.components.primary.addHandlers(setLaneHandler);
  userPoolView.components.secondary.addHandlers(setLaneHandler);
  userPoolView.components.rank.addHandlers(setRankHandler, toggleSelector);
  userPoolView.components.patch.addHandlers(togglePatch);
};
