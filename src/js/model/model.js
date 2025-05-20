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
let champions = {};
export const state = {
  champions: {},
  tierList: [],
  counterList: [],
};

///////////////////////////////////////
// Script

export async function init() {
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

export const test = async function () {
  const counters = await Lolalytics.getCounters('Lux', 'all', 'middle');
  console.log(counters);

  const tierList = await Lolalytics.getTierlist('all', 'middle');

  const tierListSorted = tierList.toSorted((a, b) => b.pickRate - a.pickRate);
  console.log(tierListSorted);
};
