///////////////////////////////////////
// LOL Drafting tool

//Importing from modules
import Lolalytics from './model/lolalytics-api.js';
import Riot from './model/riot-api.js';
import {
  getLocalVersion,
  getLocalChampions,
  getChampionsList,
  saveChampionsData,
} from './model/server-storage.js';

///////////////////////////////////////
// App state

const lanes = ['main', 'top', 'jungle', 'middle', 'bottom', 'support'];
let champions = {};

///////////////////////////////////////
// Script

async function init() {
  // Checks if updating the champion info is necesary
  // and gets the champion info
  const storedVersion = await getLocalVersion();
  const version = await Riot.getLastGameVersion();

  if (version === storedVersion) {
    champions = await getLocalChampions();
  } else {
    champions = await Riot.updateDataFromServer();
    // saveChampionsData(champions, version);
  }
  console.log(champions);
  console.log(champions['Aatrox']);

  // Get the champion names list
  const championList = getChampionsList(champions);
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

const test = async function () {
  const counters = await Lolalytics.getCounters('Lux', 'all', 'middle');
  console.log(counters);

  const tierList = await Lolalytics.getTierlist('all', 'middle');

  const tierListSorted = tierList.toSorted((a, b) => b.pickRate - a.pickRate);
  console.log(tierListSorted);
};

// await init();
// test();
