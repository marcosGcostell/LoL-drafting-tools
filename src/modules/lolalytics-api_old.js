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
  return `${baseURL}tierlist/?${
    lane !== 'main' ? `lane=${lane}&` : ''
  }tier=${rank}&view=grid`;
};

/**
 * @async
 * @function scrapeWebPage
 * Get html data from lolalytics website
 * @param {String} url to download.
 * @return {Promise<Document>} The html page as DOM Document.
 */
async function scrapeWebPage(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return doc;
  } catch (err) {
    console.error(err);
  }
}

///////////////////////////////////////
// Public exported module functions

/**
 * @async
 * @function getChampionFolders
 * Get the champions' path for lolalytics website urls
 * @return {Promise<Array>} of champion arrays.
 */
export const getChampionFolders = async function (officialRiotChampionList) {
  const champions = [];

  try {
    // Scrape the lolalytics web page
    const htmlData = await scrapeWebPage(`${baseURL}aatrox/counters/`);

    // Select the table where the champion information is (HTMLCollection)
    // convert it to an Array and filter only champions (elements with children)
    const championsGrid = Array.from(
      htmlData.getElementsByTagName('main')[0].children[5].children[1]
        .firstElementChild.firstElementChild.children
    ).filter(element => element.children.length);

    // Store an array of name and path pairs
    // from the HTMLElemts array
    const champions = championsGrid.map(cell => {
      return [
        cell.firstElementChild.firstElementChild.firstElementChild.getAttribute(
          'alt'
        ),
        cell.firstElementChild.getAttribute('href').split('/')[2],
      ];
    });

    // All names have to exist in the same way in Riot List
    const listIntegrity = champions.reduce(
      (integrity, elem) =>
        officialRiotChampionList.includes(elem[0]) && integrity,
      true
    );
    // Add the integrity register and return
    champions.push(['integrity', listIntegrity]);
    return champions;
  } catch (err) {
    console.error(err);
  }
};

/**
 * @async
 * @function getTierlist
 * Get a tier list from lolalytics website
 * @param {String} rank in this rank.
 * @param {String} lane for this role.
 * @return {Promise<Array>} of champion objects.
 */
export const getTierlist = async function (rank = 'all', lane = 'main') {
  try {
    // Scrape the lolalytics web page
    const htmlData = await scrapeWebPage(getTierlistURL(rank, lane));

    // Select the table where the champion information is (HTMLCollection)
    // convert it to an Array and filter only champions (elements with children)
    const championsGrid = Array.from(
      htmlData.getElementsByTagName('main')[0].children[5].children[1].children
    ).filter(element => element.children.length);

    // return an array of objects of some selected data
    // from the HTMLElemts array
    return championsGrid.map(cell => {
      const championElement = cell.firstElementChild.firstElementChild;
      const dataSection =
        championElement.children[1].children[1].firstElementChild;
      return {
        name: championElement.firstElementChild.textContent,
        winRatio: dataSection.children[1].textContent,
        pickRate: dataSection.children[2].textContent,
        banRate: dataSection.children[2].textContent,
      };
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 * @async
 * @function getCounters
 * Get counters data from lolalytics website
 * @param {String} champion for this champion.
 * @param {String} lane for this role.
 * @param {String} rank in this rank.
 * @return {Promise<Array>} of champion objects.
 */
export const getCounters = async function (
  champion,
  rank = 'all',
  lane = 'main',
  vsLane = lane
) {
  try {
    // Scrape the lolalytics web page
    const htmlData = await scrapeWebPage(
      getCountersURL(champion, rank, lane, vsLane)
    );

    // Select the table where the champion information is (HTMLCollection)
    // convert it to an Array and filter only the <span> elements
    const championsGrid = Array.from(
      htmlData.getElementsByTagName('main')[0].children[5].firstElementChild
        .children[1].children
    ).filter(element => element.tagName === 'SPAN');

    // return an array of objects of some selected data
    // from the HTMLElemts array
    return championsGrid.map(cell => {
      const dataElement =
        cell.firstElementChild.firstElementChild.firstElementChild;
      return {
        name: dataElement.firstElementChild.textContent,
        winRatio: Number.parseFloat(
          dataElement.children[2].children[1].textContent
        ),
        delta1: Number.parseFloat(
          dataElement.children[3].firstElementChild.textContent.slice(3)
        ),
        delta2: Number.parseFloat(
          dataElement.children[3].children[1].textContent.slice(3)
        ),
      };
    });
  } catch (err) {
    console.error(err);
  }
};
