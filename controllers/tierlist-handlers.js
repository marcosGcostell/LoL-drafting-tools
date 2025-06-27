import Lolalytics from '../models/api/lolalytics-api.js';
import Tierlist from '../models/tierlist-model.js';
import { getListFromDb } from './common-list-handlers.js';
import {
  riotLolRolesArray,
  DEFAULT_SORT_FIELD,
} from '../models/utils/config.js';
import { isoTimeStamp } from '../models/utils/helpers.js';
import catchAsync from '../models/utils/catch-async.js';
import AppError from '../models/utils/app-error.js';

export const saveTierlist = (lane, rank, patch, list) => {
  const data = {
    rank,
    lane,
    patch,
    createdAt: isoTimeStamp(),
    list,
  };

  Tierlist.create(data);
  console.log(`✅ Tierlist saved: (${lane}, ${rank}, ${patch})`);
};

export const getTierlistData = async (lane, rank, patch) => {
  console.log({ lane, rank, patch });
  const data = await getListFromDb(Tierlist, { lane, rank, patch });

  if (data) {
    console.log('Getting Tierlist from database...');
    return { tierlist: data.list, updatedAt: data.createdAt };
  }

  console.log('Getting Tierlist from website...');
  const tierlist = await Lolalytics.getTierlist(lane, rank, patch);
  if (!tierlist.length)
    throw new AppError('Could not find the tierlists data', 404);
  saveTierlist(lane, rank, patch, tierlist);
  return { tierlist, updatedAt: isoTimeStamp() };
};

export const getTierlist = catchAsync(async (req, res, next) => {
  const { tierlist, updatedAt } = await getTierlistData(
    req.lane,
    req.rank,
    req.patch
  );

  const sort = req.query.sort || DEFAULT_SORT_FIELD;
  tierlist.sort((a, b) => b[sort] - a[sort]);

  // Send response
  res.status(200).json({
    status: 'success',
    results: tierlist.length,
    updatedAt,
    data: {
      lane: req.lane,
      rank: req.rank,
      patch: req.patch,
      tierlist,
    },
  });
});

export const getAllTierlist = async (rank, patch) => {
  const allData = await Promise.all(
    riotLolRolesArray.map(lane => getTierlistData(lane, rank, patch))
  );
  const allTierlists = {};
  riotLolRolesArray.forEach(
    lane => (allTierlists[lane] = allData.shift().tierlist)
  );
  return allTierlists;
};

export const getAllRoleRates = (championName, allTierlists) => {
  const allRoleRates = {};
  riotLolRolesArray.forEach(lane => {
    const [champion] = allTierlists[lane].filter(
      el => el.name === championName
    );
    allRoleRates[lane] = champion?.roleRate || 0;
  });
  return allRoleRates;
};
