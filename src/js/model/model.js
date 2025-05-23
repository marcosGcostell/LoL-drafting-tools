import Lolalytics from './lolalytics-api.js';
import Riot from './riot-api.js';
import appData from './app-data.js';

///////////////////////////////////////
// App state

export const state = {
  tierList: [],
  counterList: [],
};

///////////////////////////////////////
// Script

export async function initApp() {
  try {
    // Checks if updating the champion info is necesary
    // and gets the champion info
    const version = await Riot.getLastGameVersion();

    if (version !== appData.version) {
      const newChampions = await Riot.updateDataFromServer();
      appData.updateAppData(version, newChampions);
      // await appData.saveAppData();
    }
    console.log(appData.riotChampionData);
    console.log(appData.riotChampionData[appData.riotChampionIds[15]]);
    console.log(appData.riotChampionNames);

    // Get the url for every champion in Lolalytics website
    if (await Lolalytics.init(appData.riotChampionNames)) {
      console.log(
        Lolalytics?.listIntegrity
          ? 'Path list is OK'
          : 'There is an error on the champion list'
      );
      console.log(Lolalytics?.championFolders);
    }
  } catch (error) {
    throw error;
  }
}

export async function getCounterList(champion, rank, role, sortedBy = '') {
  state.counterList = await Lolalytics.getCounters(champion, rank, role);
  completeListData(state.counterList);

  if (sortedBy) sortList(state.counterList, sortedBy);
}

export async function getTierList(rank, role, sortedBy = '') {
  state.tierList = await Lolalytics.getTierlist(rank, role);
  completeListData(state.tierList);

  if (sortedBy) sortList(state.tierList, sortedBy);
}

/////////////
// TODO: All these formatting tasks should be in a state class ??

function addChampionIds(championList) {
  return championList.forEach(champion => {
    appData.riotChampionData[champion.name]
      ? (champion.id = appData.riotChampionData[champion.name].id)
      : (champion.id = appData.getChampionByName(champion.name).id);
  });
}
function addChampionImages(championList) {
  return championList.forEach(champion => {
    if (appData.riotChampionData[champion.id])
      champion.img = appData.riotChampionData[champion.id].img;
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
