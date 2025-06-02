import Riot from '../models/api/riot-api.js';
import Lolalytics from '../models/api/lolalytics-api.js';

import Version from '../models/riot-version-model.js';
import Champion from '../models/riot-champion-model.js';
import { hasLocalVersionExpired } from '../models/common/helpers.js';

export const checkGameVersions = async (req, res, next) => {
  try {
    const [version] = await Version.find();
    req.version = version.id;
    req.update = false;
    console.log(`Version readed from database: ${version.id} ✅`);

    if (hasLocalVersionExpired(version.createdAt)) {
      console.log('Version backup expired!');
      req.version = await Riot.getLastGameVersion();
      req.update = req.version !== version.id;
    }
    next();
  } catch (err) {
    throw err;
  }
};

export const updateDatabase = async (req, res, next) => {
  try {
    if (!req.update) return next();

    console.log('There is a new version. Updating database...');
    const champions = await Riot.updateDataFromServer(req.version);
    const idList = Object.keys(champions);
    const nameList = [];
    idList.forEach(id => nameList.push(champions[id].name));

    // Add the lolalytics folder for each champion
    const folders = await Lolalytics.getChampionFolders(idList, nameList);
    if (!Lolalytics.listIntegrity) {
      // TODO this error should be handled, maybe with a folder list backup
      // Id's tight coupled with lolalytics website
      console.log('Lolalytics folder list has errors! 🧨');
    }

    idList.forEach(id => (champions[id].id = folders[id]));

    // Save data to the database
    console.log('Saving data to database...');
    await Version.deleteMany();
    await Version.create({
      id: req.version,
      createdAt: new Date().toISOString(),
    });
    console.log(`Version saved. id: ${req.version} ✅`);

    const data = idList.map(id => champions[id]);
    await Champion.deleteMany();
    await Champion.create(data);

    next();
  } catch (err) {
    throw err;
  }
};

export const getChampions = async (req, res) => {
  try {
    // Get the data from database
    console.log('Getting champions from database...');
    const champions = {};
    let query = Champion.find();
    query = query.select('-__v');
    const championsArray = await query;
    championsArray.forEach(el => (champions[el.riotId] = el));

    const idList = Object.keys(champions);
    const nameList = championsArray.map(el => el.name);

    console.log(`${idList.length} Champions read from database ✅`);

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
