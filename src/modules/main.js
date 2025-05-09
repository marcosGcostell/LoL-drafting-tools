'use strict';

///////////////////////////////////////
// LOL Drafting tool

//Importing from modules
import { getTierlistData, getCountersData } from './lolalytics-api.js';
import { updateChampionData } from './riot-api.js';

///////////////////////////////////////
// Global variables

const lanes = ['main', 'top', 'jungle', 'middle', 'bottom', 'support'];
const baseURL = 'https://lolalytics.com/lol/';

///////////////////////////////////////
// Script

const init = async function () {
  const counters = await getCountersData('lux', 'middle', 'all');
  console.log(counters);

  const tierList = await getTierlistData('middle', 'all');
  console.log(tierList);

  const tierListSorted = tierList.toSorted((a, b) => b.pickRate - a.pickRate);
  console.log(tierListSorted);

  const champions = await updateChampionData();

  console.log(champions.Aatrox);
};

init();
