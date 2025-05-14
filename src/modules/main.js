'use strict';

///////////////////////////////////////
// LOL Drafting tool

//Importing from modules
import * as lolalytics from './lolalytics-api.js';
import { getRiotLastVersion, updateDataFromRiot } from './riot-api.js';
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

async function init() {
  // Checks if updating the champion info is necesary
  // and gets the champion info
  const storedVersion = await getLocalVersion();
  const version = await getRiotLastVersion();

  if (version === storedVersion) {
    champions = await getLocalChampions();
  } else {
    champions = await updateDataFromRiot();
    // saveChampionsData(champions, version);
  }
  console.log(champions);
  console.log(champions.Aatrox);

  // Get the champion names list
  const championList = getChampionsList(champions);
  console.log(championList);

  // Get the url for every champion in Lolalytics website
  const lolayticsUrls = new Map(
    await lolalytics.getChampionPaths(championList)
  );
  console.log(lolayticsUrls);
}

const test = async function () {
  const counters = await lolalytics.getCounters('lux', 'all', 'middle');
  console.log(counters);

  const tierList = await lolalytics.getTierlist('all', 'middle');
  console.log(tierList);

  const tierListSorted = tierList.toSorted((a, b) => b.pickRate - a.pickRate);
  console.log(tierListSorted);
};

init();
// test();
