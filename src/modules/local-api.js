'use strict';

///////////////////////////////////////
// Global variables

///////////////////////////////////////
// Exported functions

/**
 * @async
 * @function getLocalVersion
 * Gets the LoL last version stored on local server
 * @return {Promise<String>} The last version.
 */
export const getLocalVersion = async function () {
  try {
    const response = await fetch('src/json/lol-version.json');
    const data = await response.json();
    return data.version;
  } catch (error) {
    console.log(error);
  }

  // With Node.js
  // fs.readFile('../json/version.json', 'utf8', (err, data) => {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  //   const object = JSON.parse(data);
  //   return object.version;
  // });
};

/**
 * @async
 * @function getLocalChampions
 * Gets the champion data from the local JSON file
 * @return {Promise<Object>} The last version.
 */
export const getLocalChampions = async function () {
  try {
    const response = await fetch('src/json/champions.json');
    const champions = await response.json();
    return champions;
  } catch (error) {
    console.log(error);
  }

  // With Node.js
  // fs.readFile('../json/champions.json', 'utf8', (err, data) => {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  //   return JSON.parse(data);
  // });
};

/**
 * @function getChampionsList
 * Gets the champion data from the local JSON file
 * @param {Object} champions Data of all champions
 * @return {Array>} List of all the champion names
 */
export const getChampionsList = function (champions) {
  const championList = [];

  for (const champion in champions) {
    championList.push(champions[champion].name);
  }
  return championList;
};

/**
 * @function saveChampionsData
 * Save the champions data and the version to JSON files
 * @param {Object} champions Data of all champions
 * @param {Object} version Version patch of the data
 */
export const saveChampionsData = function (champions, version) {
  // First save the champions' data
  fs.writeFile('../json/champions.json', JSON.stringify(champions), error => {
    if (error) console.log(error);
  });

  // Then save the version file
  fs.writeFile('../json/lol-version.json', JSON.stringify(version), error => {
    if (error) console.log(error);
  });
};
