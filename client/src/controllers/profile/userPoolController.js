import appData from '../../model/appData.js';
import appState from '../../appState.js';
import UserPoolView from '../../view/profile/userPoolView.js';

let userPoolView;
let userCache;

const hidePopUps = e => {
  const exclude = e.detail?.exclude || null;
  const popUpsIds = ['rank', 'top', 'jungle', 'middle', 'bottom', 'support'];
  popUpsIds.forEach(id => {
    const comp = userPoolView.components[id];
    if (comp.isVisible && comp.id !== exclude) comp.toggle();
  });
  appState.popUpOn = exclude || '';
};

const togglePopUp = component => {
  if (appState.popUpOn) appState.hideAllPopUps(component.id);

  appState.popUpOn = component.isVisible ? component.id : '';
};

const deleteHandler = component => {
  userPoolView.pools[component.id].removePoolItem(component.index);

  const pool = {};
  pool[component.id] = userCache.data.championPool[component.id].filter(
    (_, index) => index !== component.index,
  );
  userCache.setChampionPool(pool);
};

const addPickedChampion = component => {
  appState.popUpOn = '';
  if (!component.value) return;

  userPoolView.pools[component.id].renderPoolItem(
    deleteHandler,
    undefined,
    component.value,
  );

  const pool = {};
  pool[component.id] = userPoolView.pools[component.id].items.map(
    champion => champion.value,
  );
  userCache.setChampionPool(pool);
};

const setSelector = component => {
  const data = {};
  data[component.id] = component.value;
  userCache.setData(data);
};

const setPatch = component => userCache.setData({ patch: component.mode });

const setFromUserData = () => {
  const userData = userCache.data;
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

// Init funcion for the view
export default async data => {
  // Init view
  userCache = data;
  userPoolView = new UserPoolView();
  await userPoolView.initView(appData.toSortedArray('roles'));

  // Load config and champion pool
  setFromUserData();

  // Set handlers for the profile pool view
  userPoolView.components.primary.bindHandlers(setSelector);
  userPoolView.components.secondary.bindHandlers(setSelector);
  userPoolView.components.rank.bindHandlers(setSelector, togglePopUp);
  userPoolView.components.patch.bindHandlers(setPatch);
  const searchPanels = ['top', 'jungle', 'middle', 'bottom', 'support'];
  searchPanels.forEach(id =>
    userPoolView.components[id].bindHandlers(addPickedChampion, togglePopUp),
  );

  appState.addEventListener('popup:hideAll', hidePopUps);
};
