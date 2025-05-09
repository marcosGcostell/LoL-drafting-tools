'use strict';

///////////////////////////////////////
// Global variables

const baseURL = 'https://lolalytics.com/lol/';

///////////////////////////////////////
// Private module functions

/**
 * @method
 * Returns the url for counters webpage
 * @param {String} champion counters of this champion.
 * @param {String} lane for this role.
 * @param {String} rank in this rank.
 * @return {String} The url.
 */
const getCountersURL = function (champion, lane, rank) {
  return `${baseURL}${champion}/counters/?lane=${lane}&tier=${rank}`;
};

/**
 * @method
 * Returns the url for the tierlist webpage
 * @param {String} lane for this role.
 * @param {String} rank in this rank.
 * @return {String} The url.
 */
const getTierlistURL = function (lane, rank) {
  let url = `${baseURL}tierlist/?`;

  if (lane !== 'main') url += `lane=${lane}&`;

  url += `tier=${rank}&view=grid`;
  return url;
};

/**
 * @method
 * Get html data from lolalytics website
 * @param {String} url to download.
 * @return {Document} The html page as DOM Documnet.
 */
async function scrapeData(url) {
  try {
    const response = await fetch(url);
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

/**
 * @method
 * Get a tier list from lolalytics website
 * @param {String} lane for this role.
 * @param {String} rank in this rank.
 * @return {Array} of champion objects.
 */
export const getTierlistData = async function (lane = 'main', rank = 'all') {
  const champions = [];

  try {
    // Scrape the lolalytics web page
    const htmlData = await scrapeData(getTierlistURL(lane, rank));

    // Select the table where the champion information is
    const championTable = htmlData
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
    return champions;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @method
 * Get counters data from lolalytics website
 * @param {String} champion for this champion.
 * @param {String} lane for this role.
 * @param {String} rank in this rank.
 * @return {Array} of champion objects.
 */
export const getCountersData = async function (champion, lane, rank) {
  const champions = [];

  try {
    // Scrape the lolalytics web page
    const htmlData = await scrapeData(getCountersURL(champion, lane, rank));

    // Select the table where the champion information is
    const championTable = htmlData
      .getElementsByTagName('main')
      .item(0)
      .children.item(5)
      .children.item(0)
      .children.item(1).children;

    // html collection is pairs of <spans> and <q:templates>
    // Select only the <spans>
    for (let i = 0; i < championTable.length; i += 2) {
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
    return champions;
  } catch (error) {
    console.log(error);
  }
};
