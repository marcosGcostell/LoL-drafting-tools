import appData from '../../model/appData.js';
import appState from '../../appState.js';
import UserPoolView from '../../view/profile/userPoolView.js';

let userPoolView;

const setLaneHandler = (target, id) => {
  userPoolView.setOptionActive(target, id);
};

export const init = async () => {
  // Init view and insert selectors
  userPoolView = new UserPoolView();
  await userPoolView.insertSelectors(
    appData.toSortedArray('roles'),
    appData.toSortedArray('ranks')
  );

  // Load config and champion pool
  userPoolView.init(appState.user);

  // Set handlers for the profile pool view
  // Lane selectors
  ['primary', 'secondary'].forEach(el =>
    userPoolView.addHandlerLaneSelector(el, setLaneHandler)
  );
};
