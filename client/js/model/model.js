import appData from './app-data.js';
import { LOCAL_API, TIERLIST, COUNTERS } from '../common/config.js';

///////////////////////////////////////
// App state

export const state = {
  tierlist: [],
  counterList: [],
};

///////////////////////////////////////
// Script

export async function initApp() {
  try {
    // TODO This function may do the AppData.build() task
    // Now an instance is imported as a Singleton
    // but maybe it should be a global variable that can be reset here
    console.log('Initializing App...');
  } catch (error) {
    throw error;
  }
}

export async function getCounterList(champion, rank, role, sortedBy = '') {
  // API works for lolalytics folders for champion names
  const folder = appData.champions[champion].id;
  const query = `?champion=${folder}&lane=${role}&rank=${rank}`;
  const response = await fetch(`${LOCAL_API}${COUNTERS}${query}`);
  const { data } = await response.json();
  state.counterList = data.counterList;
  completeListData(state.counterList);

  if (sortedBy) sortList(state.counterList, sortedBy);
}

export async function getTierList(rank, role, sortedBy = '') {
  try {
    const query = `?lane=${role}&rank=${rank}${
      sortedBy ? `&sort=${sortedBy}` : ''
    }`;
    console.log(`${LOCAL_API}${TIERLIST}${query}`);
    const response = await fetch(`${LOCAL_API}${TIERLIST}${query}`);

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
