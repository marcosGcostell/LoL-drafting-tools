import Lolalytics from '../models/api/lolalytics-api.js';
import Stat from '../models/stat-model.js';
import { getListFromDb } from './common-list-handlers.js';
import catchAsync from '../models/common/catch-async.js';

const saveStatsData = async (champion, lane, rank, stats) => {
  try {
    const data = {
      champion,
      lane,
      rank,
      createdAt: new Date().toISOString(),
      stats,
    };

    await Stat.create(data);
    console.log('Stats saved! ✅');
    return data;
  } catch (err) {
    throw err;
  }
};

const getStatsData = async (champion, lane, rank) => {
  try {
    console.log({ champion, lane, rank });
    const data = await getListFromDb(Stat, { champion, lane, rank });

    if (data) {
      console.log('Getting Stats from database...');
      return { stats: data.stats, updatedAt: data.createdAt };
    }
    console.log('Getting Stats from website...');
    const stats = await Lolalytics.getStats(champion, lane, rank);
    saveStatsData(champion, lane, rank, stats);
    return { stats, updatedAt: new Date().toISOString() };
  } catch (err) {
    throw err;
  }
};

export const getChampionStats = catchAsync(async (req, res, next) => {
  const { stats, updatedAt } = await getStatsData(
    req.champion,
    req.lane,
    req.rank
  );

  // Send response
  res.status(200).json({
    status: 'success',
    updatedAt,
    data: {
      id: req.champion,
      lane: req.lane,
      rank: req.rank,
      stats,
    },
  });
});
