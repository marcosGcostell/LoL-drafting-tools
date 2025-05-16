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
 * @function getRiotChampionData
 * Gets the League of Legends' champion data from Riot API
 * @param {String} version Version patch of the data.
 * @return {Promise<Object>} Object where every champion is a property.
 */
const getRiotChampionData = async function (version) {
  const url = `${dataDragon}cdn/${version}/data/${locale}/champion.json`;

  try {
    const response = await fetch(url);
    const lolChampions = await response.json();

    return lolChampions.data;
  } catch (err) {
    console.error(err);
  }
};

///////////////////////////////////////
// Exported functions

/**
 * @async
 * @function getRiotLastVersion
 * Gets the League of Legends' last version from Riot API
 * @return {Promise<String>} The last version.
 */
export const getRiotLastVersion = async function () {
  const url = `${dataDragon}api/versions.json`;

  try {
    const response = await fetch(url);
    const [data] = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

/**
 * @async
 * @function updateDataFromRiot
 * Read updated version of champions' data from Riot API
 * and create an object with a reduced info version of all the champions
 * Calls to save data
 * @param {String} version Version patch of the data. No arg, get the last version
 * @return {Promise<Object>} Object where every champion is a property.
 */
export const updateDataFromRiot = async function (version = null) {
  // No verion passed, gets the last version
  if (!version) version = await getRiotLastVersion();

  const championsData = {};
  const lolChampions = await getRiotChampionData(version);

  // In championsData create an object for each champion with some data
  Object.keys(lolChampions).forEach(
    championName =>
      (championsData[championName] = {
        version: lolChampions[championName].version,
        id: lolChampions[championName].id,
        key: lolChampions[championName].key,
        name: lolChampions[championName].name,
        img: lolChampions[championName].image.full,
      })
  );

  return championsData;
};
