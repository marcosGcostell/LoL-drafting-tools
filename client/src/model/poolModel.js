import AppError from './appError.js';
import { fetchListFromAPI } from '../services/apiCalls.js';
import { STATS_ROUTE } from '../utils/config.js';

// getChampion function to fetch data from API
export default async (champion, { lane, rank, vslane, patch }) => {
  if (!champion.id)
    throw new AppError("Can't get data without a champion id", {
      origin: 'model',
      type: 'pool',
    });

  // API works for lolalytics folders for champion names
  const route = `${STATS_ROUTE}/${champion.id}`;
  const query = { lane, rank, vslane, patch };

  const { stats } = await fetchListFromAPI(route, query);

  return {
    ...champion,
    lane,
    rank,
    patch,
    ...stats,
  };
};
