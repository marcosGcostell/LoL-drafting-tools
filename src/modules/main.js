'use strict';

///////////////////////////////////////
// LOL Drafting tool
import { getTierlistData, getCountersData } from 'lolalytics-api.js';

///////////////////////////////////////
// Global variables

const lanes = ['main', 'top', 'jungle', 'middle', 'bottom', 'support'];

const baseURL = 'https://lolalytics.com/lol/';

const counters = getCountersData('lux', 'middle', 'all');
console.log(counters);

const tierList = getTierlistData('middle', 'all');
console.log(tierList);

// Fix when the promises are resolved
let tierListSorted = [];

setTimeout(() => {
  tierListSorted = tierList.toSorted((a, b) => b.pickRate - a.pickRate);
  console.log(tierListSorted);
}, 1000);
