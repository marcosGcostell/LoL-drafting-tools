import appData from '../../model/appData.js';
import appState from '../../appState.js';
import * as componentsController from '../global/componentsController.js';
import UserPoolView from '../../view/profile/userPoolView.js';

let userPoolView;

//TODO Need a state manager for the view to store de components settings
// for reloads but don't save data to user until save / discard

export const hidePopUps = () => {
  const popUpsIds = ['rank'];
  popUpsIds.forEach(id => {
    if (userPoolView.components[id].isVisible)
      userPoolView.components[id].toggle();
  });
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
  userPoolView.components.primary.addHandlers(
    componentsController.getSelectorValue,
  );
  userPoolView.components.secondary.addHandlers(
    componentsController.getSelectorValue,
  );
  userPoolView.components.rank.addHandlers(
    componentsController.getSelectorPopUpValue,
    componentsController.toggleSelector,
  );
  userPoolView.components.patch.addHandlers(componentsController.togglePatch);
};
