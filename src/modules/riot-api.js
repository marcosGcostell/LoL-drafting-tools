'use strict';
// import * as fs from 'node:fs';

///////////////////////////////////////
// Global variables
const locale = 'en_US';
const dataDragon = 'https://ddragon.leagueoflegends.com/';

///////////////////////////////////////
// Private module functions

/**
 * @async
 * @function getLolChampionData
 * Gets the League of Legends' champion data from Riot API
 * @param {String} version Version patch of the data.
 * @return {Promise<Object>} Object where every champion is a property.
 */
const getLolChampionData = async function (version) {
  const url = `${dataDragon}cdn/${version}/data/${locale}/champion.json`;

  try {
    const response = await fetch(url);
    const lolChampions = await response.json();

    return lolChampions.data;
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////
// Exported functions

/**
 * @async
 * @function getLolLastVersion
 * Gets the League of Legends' last version from Riot API
 * @return {Promise<String>} The last version.
 */
export const getLolLastVersion = async function () {
  const url = `${dataDragon}api/versions.json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.log(error);
  }
};

/**
 * @async
 * @function updateChampionData
 * Read updated version of champions' data from Riot API
 * and create an object with a reduced info version of all the champions
 * Calls to save data
 * @param {String} version Version patch of the data. No arg, get the last version
 * @return {Promise<Object>} Object where every champion is a property.
 */
export const updateChampionData = async function (version = null) {
  // No verion passed, gets the last version
  if (!version) version = await getLolLastVersion();

  const localVersion = { version: version };
  const championsLite = {};
  const lolChampions = await getLolChampionData(version);

  // Iterate every properties (champions) of the object
  for (const champion in lolChampions) {
    championsLite[champion] = {};

    championsLite[champion].version = lolChampions[champion].version;
    championsLite[champion].id = lolChampions[champion].id;
    championsLite[champion].key = lolChampions[champion].key;
    championsLite[champion].name = lolChampions[champion].name;
    championsLite[champion].img = lolChampions[champion].image.full;
  }

  return championsLite;
};
