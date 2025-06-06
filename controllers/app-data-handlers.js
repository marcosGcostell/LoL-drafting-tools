import Riot from '../models/api/riot-api.js';
import Lolalytics from '../models/api/lolalytics-api.js';

import Version from '../models/riot-version-model.js';
import Champion from '../models/riot-champion-model.js';
import { riotRole, riotRank } from '../models/riot-static-model.js';
import { expirationDate } from '../models/common/helpers.js';

export const checkGameVersion = async (req, res, next) => {
  try {
    const [validVersion] = await Version.find({
      createdAt: { $gte: expirationDate() },
    });
    if (validVersion) {
      req.version = validVersion.id;
      req.update = false;
      console.log(`Version readed from database: ${validVersion.id} ✅`);
      return next();
    }

    console.log('Version backup expired!');
    req.version = await Version.replaceFromString(
      await Riot.getLastGameVersion()
    );
    req.update = req.version !== validVersion?.id;
    next();
  } catch (err) {
    throw err;
  }
};

export const updateDatabase = async (req, res, next) => {
  try {
    if (!req.update) return next();

    console.log('There is a new version. Updating database...');
    const champions = await Riot.getNewData(req.version);
    const idList = Object.keys(champions);
    const nameList = idList.map(id => champions[id].name);

    // Add the lolalytics folder for each champion
    let folders = await Lolalytics.getChampionFolders(idList, nameList);
    if (!Lolalytics.listIntegrity) {
      // TODO Maybe should warn the client that this plan b may not work

      // Ignore folders fetched and get them from Riot data
      folders = idList.map(id => id.toLowerCase());
      console.log('Lolalytics folder list has errors! 🧨');
    }
    idList.forEach(id => (champions[id].id = folders[id]));

    // Save data to the database
    console.log('Saving data to database...');
    await Champion.replaceFromObject(champions);

    next();
  } catch (err) {
    throw err;
  }
};

export const getChampions = async (req, res) => {
  try {
    // Get the data from database
    console.log('Getting champions from database...');
    const champions = await Champion.findAsObject();

    const idList = Object.keys(champions);
    const nameList = idList.map(el => champions[el].name);

    console.log(`${idList.length} Champions read from database ✅`);

    const roles = await riotRole.findAsObject();
    const ranks = await riotRank.findAsObject();

    // Send response
    res.status(200).json({
      status: 'success',
      results: idList.length,
      data: {
        version: req.version,
        champions,
        idList,
        nameList,
        roles,
        ranks,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
