import Lolalytics from '../models/api/lolalytics-api.js';
import Stat from '../models/stat-model.js';
import { getListFromDb } from './common-list-handlers.js';
import { isoTimeStamp } from '../models/utils/helpers.js';
import catchAsync from '../models/utils/catch-async.js';

const saveStatsData = async (queryObj, stats) => {
  try {
    const data = {
      ...queryObj,
      createdAt: isoTimeStamp(),
      stats,
    };

    await Stat.create(data);
    console.log(
      `✅ Stats saved: (${queryObj.champion}, ${queryObj.lane}, ${queryObj.rank}, ${queryObj.patch})`,
    );
    return data;
  } catch (err) {
    throw err;
  }
};

const getStatsData = async queryObj => {
  try {
    console.log(queryObj);
    const data = await getListFromDb(Stat, queryObj);

    if (data) {
      console.log('Getting Stats from database...');
      return { stats: data.stats, updatedAt: data.createdAt };
    }
    console.log('Getting Stats from website...');
    const stats = await Lolalytics.getStats(queryObj);
    saveStatsData(queryObj, stats);
    return { stats, updatedAt: isoTimeStamp() };
  } catch (err) {
    throw err;
  }
};

// getChampionStats function to get stats from database or website
export default catchAsync(async (req, res, next) => {
  const queryObj = {
    champion: req.champion,
    lane: req.lane,
    rank: req.rank,
    patch: req.patch,
  };
  const { stats, updatedAt } = await getStatsData(queryObj);
  delete queryObj.champion;

  // Send response
  res.status(200).json({
    status: 'success',
    updatedAt,
    data: {
      id: req.champion,
      ...queryObj,
      stats,
    },
  });
});
