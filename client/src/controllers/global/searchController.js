import appState from '../../appState.js';
import appData from '../../model/appData.js';
import SearchView from '../../view/global/searchView.js';
import * as searchModel from '../../model/searchModel.js';

let searchView;

export const toggleSearchPanel = e => {
  if (!appState.popUpOn || appState.popUpOn === 'search') {
    searchView.toggleSearchPanel();
    appState.popUpOn = searchView.isPanelShowed ? 'search' : '';
    e.stopPropagation();
  }
};

const handleQuery = e => {
  const query = e.target.value.toLowerCase();
  if (!query) return searchView._clear();

  const { starterQuery, containsQuery } = searchModel.searchChampions(
    query,
    appData.champions
  );
  // Combine list if it's any containsQuery
  if (containsQuery.length) {
    // Inserts an empty object to render an <hr> element
    starterQuery.push({}, ...containsQuery);
  }
  searchView.render(starterQuery, {
    length: starterQuery.length,
  });
};

const handleSubmittedQuery = e => {
  const query = e.target.value.toLowerCase();
  if (!query) return;
  const { starterQuery, containsQuery } = searchModel.searchChampions(
    query,
    appData.champions
  );

  if (
    starterQuery.length === 1 ||
    (!starterQuery.length && containsQuery.length === 1)
  ) {
    searchView.toggleSearchPanel();
    appState.popUpOn = searchView.isPanelShowed ? 'search' : '';
    starterQuery.length
      ? appState.addToPool(...starterQuery)
      : appState.addToPool(...containsQuery);
  }
};

const getPickedChampion = e => {
  const id = e.target.closest('li').getAttribute('value');
  searchView.toggleSearchPanel();
  appState.popUpOn = searchView.isPanelShowed ? 'search' : '';
  if (id) {
    appState.addToPool(appData.champions[id]);
  }
};

export const setHandlers = () => {
  searchView = new SearchView();
  searchView.init();

  searchView.addHandlerAddChampion(toggleSearchPanel);
  searchView.addHandlerSearchContent(handleQuery);
  searchView.addHandlerSubmitContent(handleSubmittedQuery);
  searchView.addHandlerPickChampion(getPickedChampion);
};

export const resetView = () => {
  searchView.reset();
};
