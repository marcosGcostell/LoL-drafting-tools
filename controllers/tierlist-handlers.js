import Lolalytics from '../models/api/lolalytics-api.js';
import Tierlist from '../models/tierlist-model.js';
import { getListFromDb } from './common-list-handlers.js';
import { riotLolRolesArray } from '../models/common/config.js';
import catchAsync from '../models/common/catch-async.js';

const saveTierlist = (lane, rank, list) => {
  const data = {
    rank,
    lane,
    createdAt: new Date().toISOString(),
    list,
  };

  Tierlist.create(data);
  console.log('Tierlist saved! ✅');
};

export const getTierlistData = async (lane, rank) => {
  console.log({ lane, rank });
  const data = await getListFromDb(Tierlist, { lane, rank });

  if (data) {
    console.log('Getting Tierlist from database...');
    return { tierlist: data.list, updatedAt: data.createdAt };
  }

  console.log('Getting Tierlist from website...');
  const tierlist = await Lolalytics.getTierlist(lane, rank);
  saveTierlist(lane, rank, tierlist);
  return { tierlist, updatedAt: new Date().toISOString() };
};

export const getTierlist = catchAsync(async (req, res, next) => {
  const { tierlist, updatedAt } = await getTierlistData(req.lane, req.rank);

  // Send response
  res.status(200).json({
    status: 'success',
    results: tierlist.length,
    updatedAt,
    data: {
      tierlist,
    },
  });
});

export const getAllTierlist = async rank => {
  const allData = await Promise.all(
    riotLolRolesArray.map(lane => getTierlistData(lane, rank))
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
