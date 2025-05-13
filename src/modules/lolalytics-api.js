'use strict';

///////////////////////////////////////
// Global variables

const baseURL = 'https://lolalytics.com/lol/';

///////////////////////////////////////
// Private module functions

/**
 * @function getCountersURL
 * Returns the url for counters webpage
 * @param {String} champion counters of this champion.
 * @param {String} rank in this rank.
 * @param {String} lane for this role.
 * @param {String} vsLane against this role.
 * @return {String} The url.
 */
const getCountersURL = function (champion, rank, lane, vsLane = lane) {
  let str = `${baseURL}${champion}/counters/?lane=${lane}&tier=${rank}`;
  if (vsLane !== 'main' && vsLane !== lane) str += `&vslane=${vsLane}`;
  return str;
};

/**
 * @function getTierlistURL
 * Returns the url for the tierlist webpage
 * @param {String} rank in this rank.
 * @param {String} lane for this role.
 * @return {String} The url.
 */
const getTierlistURL = function (rank = 'all', lane = 'main') {
  let url = `${baseURL}tierlist/?`;

  if (lane !== 'main') url += `lane=${lane}&`;

  url += `tier=${rank}&view=grid`;
  return url;
};

/**
 * @async
 * @function scrapeData
 * Get html data from lolalytics website
 * @param {String} url to download.
 * @return {Promise<Document>} The html page as DOM Document.
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
 * @async
 * @function getChampionsUrlName
 * Get the champions' path for lolalytics website urls
 * @return {Promise<Array>} of champion arrays.
 */
export const getChampionsUrlName = async function () {
  const champions = [];

  try {
    // Scrape the lolalytics web page
    const htmlData = await scrapeData(`${baseURL}aatrox/counters/`);

    // Select the table where the champion information is
    const championTable =
      htmlData.getElementsByTagName('main')[0].children[5].children[1]
        .firstElementChild.firstElementChild.children;

    for (const item of championTable) {
      if (item.children.length) {
        const champion = [
          item.firstElementChild.firstElementChild.firstElementChild.getAttribute(
            'alt'
          ),
          item.firstElementChild.getAttribute('href').split('/')[2],
        ];

        champions.push(champion);
      }
    }
    return champions;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @async
 * @function getTierlistData
 * Get a tier list from lolalytics website
 * @param {String} rank in this rank.
 * @param {String} lane for this role.
 * @return {Promise<Array>} of champion objects.
 */
export const getTierlistData = async function (rank = 'all', lane = 'main') {
  const champions = [];

  try {
    // Scrape the lolalytics web page
    const htmlData = await scrapeData(getTierlistURL(rank, lane));

    // Select the table where the champion information is
    const championTable =
      htmlData.getElementsByTagName('main')[0].children[5].children[1].children;

    for (const item of championTable) {
      if (item.children.length) {
        const champion = {};
        const championCell = item.firstElementChild.firstElementChild;
        champion.name = championCell.firstElementChild.textContent;
        const championDataSection =
          championCell.children[1].children[1].firstElementChild;
        champion.winRatio = championDataSection.children[1].textContent;
        champion.pickRate = championDataSection.children[2].textContent;
        champion.banRate = championDataSection.children[3].textContent;
        champions.push(champion);
      }
    }
    return champions;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @async
 * @function getCountersData
 * Get counters data from lolalytics website
 * @param {String} champion for this champion.
 * @param {String} lane for this role.
 * @param {String} rank in this rank.
 * @return {Promise<Array>} of champion objects.
 */
export const getCountersData = async function (
  champion,
  rank = 'all',
  lane = 'main',
  vsLane = lane
) {
  const champions = [];

  try {
    // Scrape the lolalytics web page
    const htmlData = await scrapeData(
      getCountersURL(champion, rank, lane, vsLane)
    );

    // Select the table where the champion information is
    const championTable =
      htmlData.getElementsByTagName('main')[0].children[5].firstElementChild
        .children[1].children;

    // html collection is pairs of <spans> and <q:templates>
    // Select only the <spans>
    for (let i = 0; i < championTable.length; i += 2) {
      const championCell =
        championTable[i].firstElementChild.firstElementChild.firstElementChild;
      const champion = {};

      // Get champion name
      champion.name = championCell.firstElementChild.textContent;
      // Get winratio
      champion.winRatio = Number.parseFloat(
        championCell.children[2].children[1].textContent
      );
      // Get Delta 1
      champion.delta1 = Number.parseFloat(
        championCell.children[3].firstElementChild.textContent.slice(3)
      );
      // Get Delta 2
      champion.delta2 = Number.parseFloat(
        championCell.children[3].children[1].textContent.slice(3)
      );
      champions.push(champion);
    }
    return champions;
  } catch (error) {
    console.log(error);
  }
};
