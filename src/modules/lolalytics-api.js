'use strict';

///////////////////////////////////////
// Global variables

const baseURL = 'https://lolalytics.com/lol/';

///////////////////////////////////////
// Private module functions

// Get the url for counters
const getCountersURL = function (champion, lane, rank) {
  return `${baseURL}${champion}/counters/?lane=${lane}&tier=${rank}`;
};

// Get the url for tierlist
const getTierlistURL = function (lane, rank) {
  let url = `${baseURL}tierlist/?`;
  if (lane !== 'main') url += `lane=${lane}&`;
  // url += `tier=${rank}`;  // Only for list view
  // for grid view
  url += `tier=${rank}&view=grid`;
  return url;
};

// Get data from lolalytics website
async function scrapeData(url) {
  try {
    const response = await fetch(url, { cache: 'reload' });
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return doc;
  } catch (error) {
    console.log(error);
  }
}

///////////////////////////////////////
// Public exported module functions

// Get tier list
export const getTierlistData = function (lane = 'main', rank = 'all') {
  const champions = [];
  // Scrape the lolalytics web page
  scrapeData(getTierlistURL(lane, rank))
    .then(doc => {
      const championTable = doc
        .getElementsByTagName('main')
        .item(0)
        .children.item(5)
        .children.item(1).children;

      for (const item of championTable) {
        if (item.children.length) {
          const champion = {};
          const championCell = item.children.item(0).children.item(0);
          champion.name = championCell.children.item(0).textContent;
          const championDataSection = championCell.children
            .item(1)
            .children.item(1)
            .children.item(0);
          champion.winRatio = championDataSection.children.item(1).textContent;
          champion.pickRate = championDataSection.children.item(2).textContent;
          champion.banRate = championDataSection.children.item(3).textContent;
          champions.push(champion);
        }
      }
    })
    .catch(err => console.log(err));

  return champions;
};

// Get counters data
export const getCountersData = function (champion, lane, rank) {
  const champions = [];
  // Scrape the lolalytics web page
  scrapeData(getCountersURL(champion, lane, rank))
    .then(doc => {
      // Select the table item from the html
      const championTable = doc
        .getElementsByTagName('main')
        .item(0)
        .children.item(5)
        .children.item(0)
        .children.item(1).children;

      for (let i = 0; i < championTable.length; i += 2) {
        // html collection is pairs of spans and q templates
        // Select only the spans
        const championCell = championTable[i].children
          .item(0)
          .children.item(0)
          .children.item(0);
        const champion = {};

        // Get champion name
        champion.name = championCell.children.item(0).textContent;
        // Get winratio
        champion.winRatio = Number.parseFloat(
          championCell.children.item(2).children.item(1).textContent
        );
        // Get Delta 1
        champion.delta1 = Number.parseFloat(
          championCell.children.item(3).children.item(0).textContent.slice(3)
        );
        // Get Delta 2
        champion.delta2 = Number.parseFloat(
          championCell.children.item(3).children.item(1).textContent.slice(3)
        );
        champions.push(champion);
      }
    })
    .catch(err => console.log(err));

  return champions;
};
