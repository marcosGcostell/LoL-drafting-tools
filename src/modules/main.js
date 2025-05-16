'use strict';

///////////////////////////////////////
// LOL Drafting tool

//Importing from modules
// import * as Lolalytics from './lolalytics-api.js';
import { Lolalytics } from './lolalytics-class-api.js';
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

const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

const wait = function (seconds) {
  return new Promise(function (response) {
    setTimeout(response, seconds * 1000);
  });
};

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
  // Always wait before a request to lolalytics
  await wait(getRandomNumber(0.7, 2.2));
  const lolalytics = new Lolalytics();
  if (await lolalytics.init(championList)) {
    console.log(
      lolalytics?.listIntegrity
        ? 'Path list is OK'
        : 'There is an error on the champion list'
    );
    console.log(lolalytics?.championFolders);
  }

  return lolalytics;
  // const lolayticsUrls = new Map(
  //   await lolalytics.getChampionFolders(championList)
  // );
  // console.log(
  //   lolayticsUrls.get('integrity')
  //     ? 'Path list is OK'
  //     : 'There is an error on the champion list'
  // );
  // console.log(lolayticsUrls);
}

const test = async function (lolalytics) {
  await wait(getRandomNumber(0.7, 2.2));
  const counters = await lolalytics.getCounters('lux', 'all', 'middle');
  console.log(counters);

  await wait(getRandomNumber(0.7, 2.2));
  const tierList = await lolalytics.getTierlist('all', 'middle');

  const tierListSorted = tierList.toSorted((a, b) => b.pickRate - a.pickRate);
  console.log(tierListSorted);
};

const lolalytics = await init();
test(lolalytics);
