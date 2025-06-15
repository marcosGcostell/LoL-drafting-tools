import appData from './app-data.js';
import { LOCAL_API, TIERLIST_ROUTE, COUNTERS_ROUTE } from '../common/config.js';

// FIXME replace this global variable for the State class
export const state = {
  tierlist: [],
  counterList: [],
};

export async function getCounterList(
  champion,
  role,
  rank,
  vslane,
  sortedBy = ''
) {
  // API works for lolalytics folders for champion names
  const folder = appData.champions[champion].id;
  const query = `?lane=${role}&rank=${rank}${
    vslane ? `&vslane=${vslane}` : ''
  }`;
  const response = await fetch(
    `${LOCAL_API}${COUNTERS_ROUTE}/${folder}${query}`
  );
  const { data } = await response.json();
  state.counterList = data.counterList;
  completeListData(state.counterList);

  if (sortedBy) sortList(state.counterList, sortedBy);
}

export async function getTierList(role, rank, sortedBy = '') {
  try {
    const query = `?lane=${role}&rank=${rank}${
      sortedBy ? `&sort=${sortedBy}` : ''
    }`;
    console.log(`${LOCAL_API}${TIERLIST_ROUTE}${query}`);
    const response = await fetch(`${LOCAL_API}${TIERLIST_ROUTE}${query}`);

    const { data } = await response.json();
    console.log(data.tierlist);
    state.tierlist = data.tierlist;
    completeListData(state.tierlist);

    if (sortedBy) sortList(state.tierlist, sortedBy);
  } catch (error) {
    throw error;
  }
}

/////////////
// TODO: All these formatting tasks should be in a state class ??

function addChampionIds(championList) {
  return championList.forEach(champion => {
    appData.champions[champion.name]
      ? (champion.id = appData.champions[champion.name].riotId)
      : (champion.id = appData.getChampionByName(champion.name).riotId);
  });
}
function addChampionImages(championList) {
  return championList.forEach(champion => {
    if (appData.champions[champion.id])
      champion.img = appData.champions[champion.id].img;
  });
}

function completeListData(list) {
  addChampionIds(list);
  addChampionImages(list);
}

function sortList(list, property) {
  list.sort((a, b) => b[property] - a[property]);
  console.log(state[list]);
}
