import Lolalytics from '../models/api/lolalytics-api.js';
import Counter from '../models/counter-model.js';
import { getAllRoleRates, getAllTierlist } from './tierlist-handlers.js';
import { getListFromDb } from './common-list-handlers.js';
import { DEFAULT_SORT_FIELD } from '../models/common/config.js';
import catchAsync from '../models/common/catch-async.js';

const saveCounterList = async (champion, lane, rank, vslane, list) => {
  const data = {
    champion,
    lane,
    rank,
    vslane,
    createdAt: new Date().toISOString(),
    list,
  };

  await Counter.create(data);
  console.log('Counter list saved! ✅');
  return data;
};

const getCounterListData = async (champion, lane, rank, vslane) => {
  console.log({ champion, lane, rank, vslane });
  const data = await getListFromDb(Counter, { champion, lane, rank, vslane });

  if (data) {
    console.log('Getting Counters from database...');
    return { counterList: data.list, updatedAt: data.createdAt };
  }
  console.log('Getting Counters from website...');
  const counterList = await Lolalytics.getCounters(
    champion,
    lane,
    rank,
    vslane
  );
  saveCounterList(champion, lane, rank, vslane, counterList);
  return { counterList, updatedAt: new Date().toISOString() };
};

export const getCounterList = catchAsync(async (req, res, next) => {
  const { counterList, updatedAt } = await getCounterListData(
    req.champion,
    req.lane,
    req.rank,
    req.vslane
  );
  const allTierlists = await getAllTierlist(req.rank);

  const completeList = counterList.map(el => {
    const [champion] = allTierlists[req.vslane].filter(
      item => el.name === item.name
    );
    return {
      name: el.name,
      winRatio: el.winRatio,
      opponentWR: champion?.winRatio || 0,
      opponentLane: req.vslane,
      delta1: el.delta1,
      delta2: el.delta2,
      roleRates: getAllRoleRates(el.name, allTierlists),
      pickRate: champion?.pickRate || 0,
      banRate: champion?.banRate || 0,
    };
  });

  const sort = req.query.sort || DEFAULT_SORT_FIELD;
  completeList.sort((a, b) => b[sort] - a[sort]);

  // Send response
  res.status(200).json({
    status: 'success',
    results: completeList.length,
    updatedAt,
    data: {
      counterList: completeList,
    },
  });
});
