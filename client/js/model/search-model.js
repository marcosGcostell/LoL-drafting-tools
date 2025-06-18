export const searchChampions = (query, champions) => {
  if (!query) return { starterQuery, containsQuery };
  const starterQuery = Object.values(champions).filter(
    el => el.name.toLowerCase().startsWith(query) || el.id.startsWith(query)
  );
  const containsQuery =
    query.length > 2
      ? Object.values(champions).filter(
          el =>
            !starterQuery.includes(el) &&
            (el.name.toLowerCase().includes(query) || el.id.includes(query))
        )
      : '';
  return { starterQuery, containsQuery };
};
