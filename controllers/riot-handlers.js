import mongoose from 'mongoose';

import { TIME_BEFORE_CHECK } from '../models/common/config.js';
import Version from '../models/riot-version-model.js';
import Champion from '../models/riot-champion-model.js';
import Riot from '../models/api/riot-api.js';

// PRIVATE FUNCTIONS

const hasLocalVersionExpired = version => {
  // Check version last updated timestamp
  const timeElapsed = (Date.now() - version.createdAt) / (3600 * 1000);
  console.log(`Time elasped since last backup: ${timeElapsed}`);
  return timeElapsed > TIME_BEFORE_CHECK;
};

const getLocalVersion = async () => {
  const [version] = await Version.find();
  console.log(`Version readed from database: ${version} ✅`);
  return version;
};

const saveVersion = async version => {
  try {
    const data = {
      id: version,
      createdAt: Date.now(),
    };
    console.log(
      `Version to be saved in database: ${data.id} ${data.createdAt}`
    );
    await Version.deleteMany();
    await Version.create(data);
    console.log('Version saved! ✅');
    return data;
  } catch (err) {
    throw err;
  }
};

const getChampionIds = champions => Object.keys(champions);

const getChampionNames = champions => {
  const championNames = [];
  getChampionIds(champions).forEach(id =>
    championNames.push(champions[id].name)
  );
  return championNames;
};

const getChampionsFromDb = async () => {
  console.log('Getting champions from database...');
  const localChampions = {};
  let query = Champion.find();
  query = query.select('-__v');
  const championsArray = await query;
  championsArray.forEach(el => (localChampions[el.id] = el));
  return localChampions;
};

const saveChampions = async champions => {
  try {
    console.log('Saving champions to database...');
    const championIds = getChampionIds(champions);
    const data = championIds.map(id => champions[id]);
    await Champion.deleteMany();
    await Champion.create(data);
  } catch (err) {
    throw err;
  }
};

export const getChampions = async (req, res) => {
  try {
    console.log('Getting champions...');
    // FIXME Create a version to init the database. Delete after created
    await Version.deleteMany();
    await Version.create({
      id: '15.10.1',
      createdAt: 1748522965864,
    });

    let localVersion = await getLocalVersion();

    // Checks if the local version was updated recently
    if (hasLocalVersionExpired(localVersion)) {
      console.log('Version backup expired!');
      const riotVersion = await Riot.getLastGameVersion();

      // Checks there is a new version and database needs update
      if (riotVersion !== localVersion.id) {
        console.log('There is a new version. Updating database...');
        const champions = await Riot.updateDataFromServer(riotVersion);
        localVersion = await saveVersion(riotVersion);
        await saveChampions(champions);
      }
    }

    // We get the data from database anyway to get the database _id
    const champions = await getChampionsFromDb();

    // Response also send back a list of names and ids of all champions
    const idList = getChampionIds(champions);
    const nameList = getChampionNames(champions);

    // Send response
    res.status(200).json({
      status: 'success',
      results: idList.length,
      data: {
        champions,
        idList,
        nameList,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
