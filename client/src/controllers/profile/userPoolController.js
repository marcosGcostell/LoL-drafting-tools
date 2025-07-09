import appData from '../../model/appData.js';
import appState from '../../appState.js';
import UserPoolView from '../../view/profile/userPoolView.js';

let userPoolView;

export const toggleSelectors = (e, target) => {
  if (!appState.popUpOn || appState.popUpOn === target) {
    userPoolView.toggleSelector(target);
    appState.popUpOn = userPoolView.popUpDisplayed
      ? userPoolView.popUpDisplayed
      : '';

    e.stopPropagation();
  }
};

const setLaneHandler = (e, target) => {
  if (appState.popUpOn) return;

  e.stopPropagation();
  const id = e.target.closest('div').dataset.value;
  userPoolView.setOptionActive(target, id);
  // TODO Set the option to the user and save it
  appState.user.setPoolOptions(`${target}Role`, id);
};

const setRankHandler = (e, _) => {
  if (appState.popUpOn !== 'rank' && userPoolView.popUpDisplayed !== 'rank')
    return;

  e.stopPropagation();
  const id = e.target.closest('div').dataset.value;
  userPoolView.changeRank(appData.ranks[id]);
  toggleSelectors(e, 'rank');
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
  // Lane, rank, patch selectors
  ['primary', 'secondary'].forEach(el =>
    userPoolView.addHandler(el, 'selector', setLaneHandler)
  );
  userPoolView.addHandler('rank', 'btn', toggleSelectors);
  userPoolView.addHandler('rank', 'selector', setRankHandler);
};
