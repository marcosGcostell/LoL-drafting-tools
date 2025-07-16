import Lolalytics from '../models/api/lolalytics-api.js';
import Stat from '../models/stat-model.js';
import { getListFromDb } from './common-list-handlers.js';
import { isoTimeStamp } from '../models/utils/helpers.js';
import catchAsync from '../models/utils/catch-async.js';

const saveStatsData = async (champion, lane, rank, patch, stats) => {
  try {
    const data = {
      champion,
      lane,
      rank,
      patch,
      createdAt: isoTimeStamp(),
      stats,
    };

    await Stat.create(data);
    console.log(`✅ Stats saved: (${champion}, ${lane}, ${rank}, ${patch})`);
    return data;
  } catch (err) {
    throw err;
  }
};

const getStatsData = async (champion, lane, rank, patch) => {
  try {
    console.log({ champion, lane, rank, patch });
    const data = await getListFromDb(Stat, { champion, lane, rank, patch });

    if (data) {
      console.log('Getting Stats from database...');
      return { stats: data.stats, updatedAt: data.createdAt };
    }
    console.log('Getting Stats from website...');
    const stats = await Lolalytics.getStats(champion, lane, rank, patch);
    saveStatsData(champion, lane, rank, patch, stats);
    return { stats, updatedAt: isoTimeStamp() };
  } catch (err) {
    throw err;
  }
};

// getChampionStats function to get stats from database or website
export default catchAsync(async (req, res, next) => {
  const { stats, updatedAt } = await getStatsData(
    req.champion,
    req.lane,
    req.rank,
    req.patch,
  );

  // Send response
  res.status(200).json({
    status: 'success',
    updatedAt,
    data: {
      id: req.champion,
      lane: req.lane,
      rank: req.rank,
      patch: req.patch,
      stats,
    },
  });
});
