import Lolalytics from '../models/api/lolalytics-api.js';
import Tierlist from '../models/tierlist-model.js';
import tierlistCache from '../models/tierlist-cache.js';
import { getListFromDb } from './common-list-handlers.js';
import {
  riotLolRolesArray,
  DEFAULT_SORT_FIELD,
} from '../models/utils/config.js';
import { isoTimeStamp, expirationDate } from '../models/utils/helpers.js';
import catchAsync from '../models/utils/catch-async.js';
import AppError from '../models/utils/app-error.js';

export const saveTierlist = ({ lane, rank, patch }, list) => {
  const data = {
    rank,
    lane,
    patch,
    createdAt: isoTimeStamp(),
    list,
  };

  Tierlist.create(data);
  console.log(`✅ Tierlist saved: ${lane} - ${rank} - ${patch}`);
  return data;
};

export const getTierlistData = async queryObj => {
  // First try to get the list from memory cache
  const cache = tierlistCache.load(queryObj);
  if (cache && cache.createdAt.toISOString() > expirationDate()) {
    console.log(
      `Getting from cache: Tierlist - ${Object.values(queryObj).join(' - ')}`,
    );
    return cache;
  }

  // Try database if no cache or it's expired
  const data = await getListFromDb(Tierlist, queryObj);
  if (data) {
    console.log(
      `Getting from database: Tierlist - ${Object.values(queryObj).join(' - ')}`,
    );
    tierlistCache.save(data);
    return { tierlist: data.list, createdAt: data.createdAt };
  }

  // Finally scrap the website as fallback
  console.log(
    `Getting from website: Tierlist - ${Object.values(queryObj).join(' - ')}`,
  );
  const tierlist = await Lolalytics.getTierlist(queryObj);

  if (!tierlist.length)
    throw new AppError('Could not find the tierlists data', 404);

  const newData = saveTierlist(queryObj, tierlist);
  tierlistCache.save(newData);
  return { tierlist, createdAt: newData.createdAt };
};

export const getTierlist = catchAsync(async (req, res, next) => {
  const queryObj = { lane: req.lane, rank: req.rank, patch: req.patch };

  const { tierlist, createdAt } = await getTierlistData(queryObj);

  const sort = req.query.sort || DEFAULT_SORT_FIELD;
  tierlist.sort((a, b) => b[sort] - a[sort]);

  // Send response
  res.status(200).json({
    status: 'success',
    results: tierlist.length,
    createdAt,
    data: {
      ...queryObj,
      tierlist,
    },
  });
});

export const getAllTierlist = async (rank, patch) => {
  const allData = await Promise.all(
    riotLolRolesArray.map(lane => getTierlistData({ lane, rank, patch })),
  );
  const allTierlists = {};
  riotLolRolesArray.forEach(lane => {
    allTierlists[lane] = allData.shift().tierlist;
  });
  return allTierlists;
};

export const getAllRoleRates = (championName, allTierlists) => {
  const allRoleRates = {};
  riotLolRolesArray.forEach(lane => {
    const [champion] = allTierlists[lane].filter(
      el => el.name === championName,
    );
    allRoleRates[lane] = champion?.roleRate || 0;
  });
  return allRoleRates;
};
