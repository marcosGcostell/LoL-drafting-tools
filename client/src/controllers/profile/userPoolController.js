import appData from '../../model/appData.js';
import appState from '../../appState.js';
import { hideAllPopUps } from '../backgroundController.js';
import UserPoolView from '../../view/profile/userPoolView.js';

let userPoolView;

//TODO Need a state manager for the view to store de components settings
// for reloads but don't save data to user until save / discard

export const hidePopUps = (exclude = null) => {
  const popUpsIds = ['rank', 'top', 'jungle', 'middle', 'bottom', 'support'];
  popUpsIds.forEach(id => {
    const comp = userPoolView.components[id];
    if (comp.isVisible && comp.id !== exclude) comp.toggle();
  });
};

const togglePopUp = component => {
  if (appState.popUpOn) hideAllPopUps(component.id);

  appState.popUpOn = component.isVisible ? component.id : '';
};

const pickedChampionHandler = component => {
  appState.popUpOn = '';
  console.log(component.value);
};

export const init = async () => {
  // Init view
  userPoolView = new UserPoolView();
  await userPoolView.initView(appData.toSortedArray('roles'));

  // Load config and champion pool
  userPoolView.setFromUserData(appState.user.data);

  // Set handlers for the profile pool view
  userPoolView.components.primary.bind();
  userPoolView.components.secondary.bind();
  userPoolView.components.rank.bind(null, togglePopUp);
  userPoolView.components.patch.bind();
  const searchPanels = ['top', 'jungle', 'middle', 'bottom', 'support'];
  searchPanels.forEach(id =>
    userPoolView.components[id].bind(pickedChampionHandler, togglePopUp),
  );
};
