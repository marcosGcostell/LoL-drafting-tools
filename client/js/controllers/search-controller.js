import appState from '../model/app-state.js';
import appData from '../model/app-data.js';
import searchView from '../view/search-view.js';
import * as searchModel from '../model/search-model.js';

export const toggleSearchButton = e => {
  if (appState.popUpOn === 'search') {
    searchView.toggleSearchPanel();
    appState.popUpOn = searchView.isPanelShowed ? 'search' : '';
  }
  searchView.toggleSearchBtn();
};

export const toggleSearchPanel = e => {
  if (!appState.popUpOn || appState.popUpOn === 'search') {
    searchView.toggleSearchPanel();
    appState.popUpOn = searchView.isPanelShowed ? 'search' : '';
    e.stopPropagation();
  }
};

const handleQuery = e => {
  const query = e.target.value;
  if (!query) return searchView._clear();

  const { starterQuery, containsQuery } = searchModel.searchChampions(
    query,
    appData.champions
  );
  // Combine list if it's any containsQuery
  if (containsQuery.length) {
    starterQuery.push({}, ...containsQuery);
  }
  searchView.render(starterQuery, {
    length: starterQuery.length,
  });
};

const getPickedChampion = e => {
  const id = e.target.closest('li').getAttribute('value');
  searchView.toggleSearchPanel();
  appState.popUpOn = searchView.isPanelShowed ? 'search' : '';
  if (id) {
    appState.addChampion(appData.champions[id]);
  }
};

export const setHandlers = () => {
  searchView.addHandlerAddChampion(toggleSearchPanel);
  searchView.addHandlerSearchContent(handleQuery);
  searchView.addHandlerPickChampion(getPickedChampion);
};
