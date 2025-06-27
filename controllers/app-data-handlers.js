import Riot from '../models/api/riot-api.js';
import Lolalytics from '../models/api/lolalytics-api.js';

import Version from '../models/riot-version-model.js';
import Champion from '../models/riot-champion-model.js';
import { riotRole, riotRank } from '../models/riot-static-model.js';
import { expirationDate } from '../models/utils/helpers.js';
import catchAsync from '../models/utils/catch-async.js';

export const checkGameVersion = catchAsync(async (req, res, next) => {
  const [validVersion] = await Version.find({
    createdAt: { $gte: expirationDate() },
  });
  if (validVersion) {
    req.version = validVersion.id;
    req.createdAt = validVersion.createdAt;
    req.update = false;
    console.log(`Version readed from database: ${validVersion.id} ✅`);
    return next();
  }

  console.log('Version backup expired!');
  req.version = await Version.replaceFromString(
    await Riot.getLastGameVersion()
  );
  req.createdAt = new Date().toISOString();
  req.update = req.version !== validVersion?.id;
  next();
});

export const updateDatabase = catchAsync(async (req, res, next) => {
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
    // FIXME this idList.map set the folders as lolalytics API?
    folders = idList.map(id => id.toLowerCase());
    console.log('Lolalytics folder list has errors! 🧨');
  }
  idList.forEach(id => (champions[id].id = folders[id]));

  // Save data to the database
  console.log('Saving data to database...');
  await Champion.replaceFromObject(champions);

  next();
});

export const getChampions = catchAsync(async (req, res, next) => {
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
      createdAt: req.createdAt,
      champions,
      idList,
      nameList,
      roles,
      ranks,
    },
  });
});

export const getVersion = (req, res) => {
  // Send response
  res.status(200).json({
    status: 'success',
    data: {
      version: req.version,
      createdAt: req.createdAt,
    },
  });
};
