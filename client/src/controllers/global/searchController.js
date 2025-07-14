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

  const { primarySearch, secondarySearch } = searchModel.searchChampions(
    query,
    appData.champions,
  );
  // Combine list if it's any secondarySearch
  if (secondarySearch.length) {
    // Inserts an empty object to render an <hr> element
    primarySearch.push({}, ...secondarySearch);
  }
  searchView.render(primarySearch, {
    length: primarySearch.length,
  });
};

const handleSubmittedQuery = e => {
  const query = e.target.value.toLowerCase();
  if (!query) return;
  const { primarySearch, secondarySearch } = searchModel.searchChampions(
    query,
    appData.champions,
  );

  if (
    primarySearch.length === 1 ||
    (!primarySearch.length && secondarySearch.length === 1)
  ) {
    searchView.toggleSearchPanel();
    appState.popUpOn = searchView.isPanelShowed ? 'search' : '';
    primarySearch.length
      ? appState.addToPool(...primarySearch)
      : appState.addToPool(...secondarySearch);
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
