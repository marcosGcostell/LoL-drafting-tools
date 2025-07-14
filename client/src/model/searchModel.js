import appData from './appData.js';
import { MIN_LETTERS_TO_SECOND_SEARCH } from '../utils/config.js';

export const searchChampions = query => {
  if (!query) return { search: [], secondarySearch: [] };
  const search = Object.values(appData.champions).filter(
    el => el.name.toLowerCase().startsWith(query) || el.id.startsWith(query),
  );
  const secondarySearch =
    query.length >= MIN_LETTERS_TO_SECOND_SEARCH
      ? Object.values(appData.champions).filter(
          el =>
            !search.includes(el) &&
            (el.name.toLowerCase().includes(query) || el.id.includes(query)),
        )
      : [];
  return { search, secondarySearch };
};

export const handleQuery = query => {
  if (!query) return [];

  const { search, secondarySearch } = searchChampions(query);
  const splitIndex = secondarySearch.length ? search.length : -1;
  // Combine list if it's any secondarySearch
  if (secondarySearch.length) {
    // Inserts an empty object to render an <hr> element
    search.push({}, ...secondarySearch);
  }
  return { search, splitIndex };
};

export const checkSubmitQuery = (searchResults, splitIndex) => {
  let champion = null;
  if (searchResults.length === 1) {
    [champion] = searchResults;
  } else if (splitIndex === 1) {
    [champion] = searchResults.slice(0, 1);
  } else if (splitIndex === 0 && searchResults.length === 2) {
    [champion] = searchResults.slice(1);
  }
  return champion;
};
