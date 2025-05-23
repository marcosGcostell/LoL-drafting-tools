// app.mjs
import { writeFile, readFile } from 'fs/promises';
import { resolve } from 'path';
import Riot from './src/js/model/riot-api.js';
import { RIOT_DATA_JSON } from './src/js/common/config.js';
import { JSON_CHAMPIONS } from './src/js/common/config.js';
import { riotLolRanks } from './src/js/common/config.js';
import { riotLolRoles } from './src/js/common/config.js';

const riotDataPath = resolve(RIOT_DATA_JSON);
const championsPath = resolve(JSON_CHAMPIONS);

// Objeto que queremos guardar

// Guardar el archivo
async function saveLocalData(version, champions) {
  try {
    const riotData = {
      version: version,
      champions: champions,
      roles: riotLolRoles,
      ranks: riotLolRanks,
    };
    console.log(`Saving data file: ${RIOT_DATA_JSON}`);
    await writeFile(riotDataPath, JSON.stringify(riotData, null, 2));
    console.log('[Saved]');
    // console.log(`Saving champions file: ${JSON_CHAMPIONS}`);
    // await writeFile(championsPath, JSON.stringify(champions, null, 2));
    // console.log('[Saved]');
  } catch (error) {
    console.error('❌ Error al guardar el archivo:', error);
  }
}

async function getUpdatedData() {
  try {
    console.log('Getting version...');
    const version = await Riot.getLastGameVersion();
    console.log(`Riot LOL Version: ${version}`);
    console.log('Getting champions...');
    const champions = await Riot.updateDataFromServer();
    const list = Object.keys(champions);
    console.log(`Number of champions found: ${list.length}`);
    await saveLocalData(version, champions);
  } catch (error) {}
}

console.log('Fetching data...');
getUpdatedData();
