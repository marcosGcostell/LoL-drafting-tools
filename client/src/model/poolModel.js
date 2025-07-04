import fetchListFromAPI from '../services/apiCalls.js';
import { STATS_ROUTE } from '../utils/config.js';

// const _hasChanged = (champion, index) => {
//   return (
//     appState.pool[index].rank !== appState.rank ||
//     appState.pool[index].lane !== appState.lane ||
//     appState.pool[index].patch !== appState.patch.toApi() ||
//     appState.pool[index].id !== champion.id
//   );
// };

export async function getChampion(champion, { lane, rank, vslane, patch }) {
  try {
    if (!champion.id) throw new Error("Can't get data without a champion id");

    // API works for lolalytics folders for champion names
    const route = `${STATS_ROUTE}/${champion.id}`;
    const query = {
      lane,
      rank,
      vslane,
      patch,
    };

    const { stats } = await fetchListFromAPI(route, query);

    return {
      ...champion,
      lane,
      rank,
      patch,
      ...stats,
    };
  } catch (err) {
    throw err;
  }
}
