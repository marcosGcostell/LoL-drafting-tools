import AppData from './app-data.js';
import { LOCAL_API, TIERLIST, COUNTERS } from '../common/config.js';

///////////////////////////////////////
// App state

let appData;

export const state = {
  tierlist: [],
  counterList: [],
};

///////////////////////////////////////
// Script

export async function initApp() {
  try {
    // TODO to unload the API, maybe appData should be stored in localStorage
    // Then we need to check
    console.log('Initializing App...');
    const cached = sessionStorage.getItem('draftKingAppData');
    if (cached) {
      console.log('Reading appData from browser...');
      appData = AppData.getFromJSON(JSON.parse(cached));
    } else {
      console.log('Reading appData from API...');
      appData = await AppData.getFromAPI();
      sessionStorage.setItem(
        'draftKingAppData',
        JSON.stringify(appData.SaveToJSON())
      );
    }
  } catch (error) {
    throw error;
  }
}

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
  const response = await fetch(`${LOCAL_API}${COUNTERS}/${folder}${query}`);
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

export { appData };

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
