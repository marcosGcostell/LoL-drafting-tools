import ChampionList from './championListModel.js';
import { fetchListFromAPI } from '../services/apiCalls.js';
import { TIERLIST_ROUTE } from '../utils/config.js';

// getTierlist function to fetch data from API
export default async ({ vslane, rank, patch }) => {
  console.log(`Getting tier list: ${vslane} ${rank} ${patch.toView()}`);

  const route = TIERLIST_ROUTE;
  const query = { lane: vslane, rank, patch, sortedBy: 'pickRate' };

  const { tierlist } = await fetchListFromAPI(route, query);

  const newList = new ChampionList(tierlist);
  newList.completeListData();
  newList.addIndexes();
  return newList.data;
};
