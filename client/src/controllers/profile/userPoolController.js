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

const deleteHandler = component => {
  const index = component.index;
  userPoolView.pools[component.id].removePoolItem(component.index);
};

const addPickedChampion = component => {
  appState.popUpOn = '';

  if (component.value) {
    userPoolView.pools[component.id].renderPoolItem(
      deleteHandler,
      undefined,
      component.value,
    );
  }
};

const setFromUserData = () => {
  const userData = appState.user.data;
  userPoolView.components.primary.setActiveItem(userData.primaryRole || 'top');
  userPoolView.components.secondary.setActiveItem(
    userData.secondaryRole || 'middle',
  );
  userPoolView.components.rank
    .setActiveItem(userData.rank || 'all')
    .changeParentButton(userData.rank || 'all');
  userPoolView.components.patch.mode = userData.patch;

  Object.keys(userData.championPool).forEach(lane => {
    userData.championPool[lane].forEach(id => {
      userPoolView.pools[lane].renderPoolItem(
        deleteHandler,
        undefined,
        appData.champions[id],
      );
    });
  });
};

export const init = async () => {
  // Init view
  userPoolView = new UserPoolView();
  await userPoolView.initView(appData.toSortedArray('roles'));

  // Load config and champion pool
  setFromUserData();

  // Set handlers for the profile pool view
  userPoolView.components.primary.bind();
  userPoolView.components.secondary.bind();
  userPoolView.components.rank.bind(null, togglePopUp);
  userPoolView.components.patch.bind();
  const searchPanels = ['top', 'jungle', 'middle', 'bottom', 'support'];
  searchPanels.forEach(id =>
    userPoolView.components[id].bind(addPickedChampion, togglePopUp),
  );
};
