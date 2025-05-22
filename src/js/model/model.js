import Lolalytics from './lolalytics-api.js';
import Riot from './riot-api.js';
import {
  getLocalVersion,
  getLocalChampions,
  getChampionsList,
  saveChampionsData,
} from './server-storage.js';

///////////////////////////////////////
// App state

const lanes = ['main', 'top', 'jungle', 'middle', 'bottom', 'support'];

export const state = {
  champions: {},
  tierList: [],
  counterList: [],
};

///////////////////////////////////////
// Script

export async function initAppData() {
  // Checks if updating the champion info is necesary
  // and gets the champion info
  const storedVersion = await getLocalVersion();
  const version = await Riot.getLastGameVersion();

  if (version === storedVersion) {
    state.champions = await getLocalChampions();
  } else {
    state.champions = await Riot.updateDataFromServer();
    // saveChampionsData(champions, version);
  }
  console.log(state.champions);
  console.log(state.champions['Aatrox']);

  // Get the champion names list
  const championList = getChampionsList(state.champions);
  console.log(championList);

  // Get the url for every champion in Lolalytics website
  // Always wait before a request to lolalytics

  if (await Lolalytics.init(championList)) {
    console.log(
      Lolalytics?.listIntegrity
        ? 'Path list is OK'
        : 'There is an error on the champion list'
    );
    console.log(Lolalytics?.championFolders);
  }
}

export async function getCounterList(champion, rank, role, sortedBy = '') {
  state.counterList = await Lolalytics.getCounters(champion, rank, role);
  completeListData(state.counterList);

  if (sortedBy) sortList(state.counterList, sortedBy);
}

export async function getTierList(rank, role, sortedBy = '') {
  state.tierList = await Lolalytics.getTierlist(rank, role);
  completeListData(state.counterList);

  if (sortedBy) sortList(state.tierList, sortedBy);
}

export const test = async function () {
  const counters = await Lolalytics.getCounters('Lux', 'all', 'middle');
  console.log(counters);

  const tierList = await Lolalytics.getTierlist('all', 'middle');

  const tierListSorted = tierList.toSorted((a, b) => b.pickRate - a.pickRate);
  console.log(tierListSorted);
};

/////////////
// TODO: All these formatting tasks should be in a class champion ??

function getChampionByName(championName) {
  const id = Object.keys(state.champions).find(
    id => state.champions[id].name === championName
  );
  return state.champions[id];
}

function addChampionIds(championList) {
  return championList.forEach(champion => {
    state.champions[champion.name]
      ? (champion.id = state.champions[champion.name].id)
      : (champion.id = getChampionByName(champion.name).id);
  });
}
function addChampionImages(championList) {
  return championList.forEach(champion => {
    if (state.champions[champion.id])
      champion.img = state.champions[champion.id].img;
  });
}

function completeListData(list) {
  addChampionIds(state.tierList);
  addChampionImages(state.tierList);
}

function sortList(list, property) {
  list.sort((a, b) => b[property] - a[property]);
  console.log(state[list]);
}
