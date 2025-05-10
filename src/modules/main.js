'use strict';

///////////////////////////////////////
// LOL Drafting tool

//Importing from modules
import {
  getChampionsUrlName,
  getTierlistData,
  getCountersData,
} from './lolalytics-api.js';
import { getLolLastVersion, updateChampionData } from './riot-api.js';
import {
  getLocalVersion,
  getLocalChampions,
  getChampionsList,
  saveChampionsData,
} from './local-api.js';

///////////////////////////////////////
// Global variables

const lanes = ['main', 'top', 'jungle', 'middle', 'bottom', 'support'];
let champions = {};

///////////////////////////////////////
// Script

const init = async function () {
  // Checks if updating the champion info is necesary
  // and gets the champion info
  const storedVersion = await getLocalVersion();
  const version = await getLolLastVersion();
  if (version === storedVersion) {
    champions = await getLocalChampions();
  } else {
    champions = await updateChampionData();
    // saveChampionsData(champions, version);
  }
  console.log(champions);
  console.log(champions.Aatrox);

  // Get the champion names list
  const championList = getChampionsList(champions);
  console.log(championList);

  // Get the url for every champion in Lolalytics website
  const lolayticsUrls = new Map(await getChampionsUrlName());
  console.log(lolayticsUrls);
};

const test = async function () {
  const counters = await getCountersData('lux', 'middle', 'all');
  console.log(counters);

  const tierList = await getTierlistData('middle', 'all');
  console.log(tierList);

  const tierListSorted = tierList.toSorted((a, b) => b.pickRate - a.pickRate);
  console.log(tierListSorted);
};

init();
test();
