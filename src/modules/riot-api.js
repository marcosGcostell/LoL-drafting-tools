'use strict';

///////////////////////////////////////
// Global variables
const locale = 'en_US';
const dataDragon = 'https://ddragon.leagueoflegends.com/';

///////////////////////////////////////
// Private module functions

/**
 * @method
 * Gets the League of Legends' last version from Riot API
 * @return {String} The last version.
 */
const getLolLastVersion = async function () {
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
 * @method
 * Gets the League of Legends' champion data from Riot API
 * @param {String} version Version patch of the data.
 * @return {Object} Object where every champion is a property.
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

/**
 * @method
 * Save the champions data and the version to JSON files
 * @param {Object} champions Data of all champions
 * @param {Object} version Version patch of the data
 * @return {Object} Object where every champion is a property.
 */
const saveChampionsData = function (champions, version) {
  // First save the champions' data
  const fs = require('fs');

  fs.writeFile('../json/champions.json', JSON.stringify(champions), error => {
    if (error) console.log(error);
  });

  // Then save the version file
  fs.writeFile('../json/version.json', JSON.stringify(version), error => {
    if (error) console.log(error);
  });
};

/**
 * @method
 * Read updated version of champions' data from Riot API
 * and create an object with a reduced info version of all the champions
 * Calls to save data
 * @param {String} version Version patch of the data. No arg, get the last version
 * @return {Object} Object where every champion is a property.
 */

///////////////////////////////////////
// Exported functions

export const updateChampionData = async function (version = null) {
  //
  if (!version) version = await getLolLastVersion();

  // Implement checking if updating is necesary
  // ....
  if (true) {
    const storedVersion = { version: version };
    const championsLite = {};
    const lolChampions = await getLolChampionData(version);

    for (const champion in lolChampions) {
      championsLite[champion] = {};

      championsLite[champion].version = lolChampions[champion].version;
      championsLite[champion].id = lolChampions[champion].id;
      championsLite[champion].key = lolChampions[champion].key;
      championsLite[champion].name = lolChampions[champion].name;
      championsLite[champion].img = lolChampions[champion].image.full;
    }

    // saveChampionsData(championsLite, storedVersion);
    return championsLite;
  }
};
