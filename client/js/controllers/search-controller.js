import appData from '../model/app-data.js';
import appState from '../model/app-state.js';
import searchView from '../view/search-view.js';

const toggleSearchPanel = () => {
  if (!appState.popUpOn || appState.popUpOn === 'search') {
    searchView.toggleSearchPanel();
    appState.popUpOn = searchView.isPanelShowed ? 'search' : '';
  }
};

const searchChampions = e => {
  const query = e.target.value;
  if (!query) searchView._clear();
};

export const setHandlers = () => {
  searchView.addHandlerAddChampion(toggleSearchPanel);
  searchView.addHandlerSearchContent(searchChampions);
};
