import appData from './app-data.js';

export const searchChampions = query => {
  if (!query) return { starterQuery, containsQuery };
  const starterQuery = Object.values(appData.champions).filter(
    el => el.name.toLowerCase().startsWith(query) || el.id.startsWith(query)
  );
  const containsQuery =
    query.length > 2
      ? Object.values(appData.champions).filter(
          el =>
            !starterQuery.includes(el) &&
            (el.name.toLowerCase().includes(query) || el.id.includes(query))
        )
      : '';
  return { starterQuery, containsQuery };
};
