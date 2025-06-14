import AppData from './app-data.js';
import { expirationDate } from '../common/helpers.js';
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
    // So all this expired version checking has some meaning
    console.log('Initializing App...');
    let isCacheValid = false;
    const data = sessionStorage.getItem('draftKingAppData');
    if (data) {
      const cached = JSON.parse(data);
      const lastUpdated = new Date(cached.createdAt);
      if (lastUpdated < expirationDate()) {
        const newVersion = await AppData.checkVersion();
        if (newVersion === cached.version) {
          // Version expired but has not changed
          isCacheValid = true;
        }
      } else {
        // Version has not expired yet
        isCacheValid = true;
      }
    }

    if (isCacheValid) {
      console.log('Reading appData from browser...');
      appData = AppData.getFromJSON(JSON.parse(data));
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
