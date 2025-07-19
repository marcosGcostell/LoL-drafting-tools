import Riot from '../models/api/riot-api.js';
import Lolalytics from '../models/api/lolalytics-api.js';

import Version from '../models/riot-version-model.js';
import Champion from '../models/riot-champion-model.js';
import riotDataCache from '../models/riot-data-cache.js';
import { expirationDate } from '../models/utils/helpers.js';
import catchAsync from '../models/utils/catch-async.js';

export const checkGameVersion = catchAsync(async (req, res, next) => {
  // First check version in cache
  const cacheVersion = riotDataCache.version;
  if (
    cacheVersion?.id &&
    new Date(cacheVersion.createdAt).toISOString() > expirationDate()
  ) {
    req.version = cacheVersion.id;
    req.createdAt = cacheVersion.createdAt;
    req.update = false;
    console.log(`Version readed from cache: ${cacheVersion.id} ✅`);
    return next();
  }

  // If no valid cache, check in database
  const [dbVersion] = await Version.find();
  if (
    dbVersion?.id &&
    new Date(dbVersion.createdAt).toISOString() > expirationDate()
  ) {
    req.version = dbVersion.id;
    req.createdAt = dbVersion.createdAt;
    req.update = false;
    riotDataCache.version = dbVersion;
    console.log(`Version readed from database: ${dbVersion.id} ✅`);
    return next();
  }

  // No valid versions, get it from riot site
  const versionId = await Riot.getLastGameVersion();
  req.version = await Version.replaceFromString(versionId);
  req.createdAt = new Date().toISOString();
  riotDataCache.version = { id: req.version, createdAt: req.createdAt };
  req.update = req.version !== dbVersion?.id;
  next();
});

export const updateDatabase = catchAsync(async (req, res, next) => {
  if (!req.update) return next();

  console.log('There is a new version. Updating database...');
  const champions = await Riot.getNewData(req.version);
  const riotIdList = Object.keys(champions);
  const nameList = riotIdList.map(id => champions[id].name);
  req.integrity = true;

  // Add the lolalytics folder for each champion
  let folders = await Lolalytics.getChampionFolders(riotIdList, nameList);
  if (!Lolalytics.listIntegrity) {
    // TODO Maybe should warn the client that this plan b may not work

    // Ignore folders fetched and get them from Riot data
    folders = Object.fromEntries(riotIdList.map(id => [id, id.toLowerCase()]));
    req.integrity = false;
    Version.updateOne({ id: req.version }, { integrity: false });
    console.log('Lolalytics folder list has errors! 🧨');
  }
  riotIdList.forEach(id => {
    champions[id].id = folders[id];
  });

  // Save data to cache and database
  await Champion.replaceFromObject(champions);
  await Champion.findAsObject();
  riotDataCache.champions = champions;
  riotDataCache.integrity = req.integrity;
  Object.assign(riotDataCache, riotDataCache.getLists(champions));

  next();
});

export const getChampions = catchAsync(async (req, res, next) => {
  // Cache is always updated here. Get data from cache
  const { data, integrity } = riotDataCache.getData();
  console.log(`${data.idList.length} Champions read ✅`);

  // Send response
  res.status(200).json({
    status: 'success',
    results: data.idList.length,
    integrity,
    data,
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
